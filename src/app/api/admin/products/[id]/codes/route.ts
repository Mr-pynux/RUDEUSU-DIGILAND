import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest, unauthorized } from "@/lib/admin";

export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

/** POST /api/admin/products/:id/codes — bulk-add activation codes (one per line). */
export async function POST(req: Request, ctx: RouteCtx) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const raw = String(body?.codes ?? "");
    const lines = raw.split(/\r?\n/);

    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // normalize + dedupe within the payload
    const seen = new Set<string>();
    const candidates: string[] = [];
    for (const line of lines) {
      const value = line.trim();
      if (value.length < 3 || value.length > 300) continue;
      if (seen.has(value)) continue;
      seen.add(value);
      candidates.push(value);
    }

    // drop codes that already exist for this product
    const existing = await db.code.findMany({
      where: { productId: id, value: { in: candidates } },
      select: { value: true },
    });
    const existingSet = new Set(existing.map((e) => e.value));
    const fresh = candidates.filter((c) => !existingSet.has(c)).slice(0, 1000);
    const skipped = candidates.length - fresh.length;

    if (fresh.length > 0) {
      await db.code.createMany({
        data: fresh.map((value) => ({ value, productId: id })),
      });
    }

    return NextResponse.json({ added: fresh.length, skipped });
  } catch (err) {
    console.error("admin add codes error", err);
    return NextResponse.json({ error: "Could not add codes." }, { status: 500 });
  }
}

/** GET /api/admin/products/:id/codes — list codes of one product. */
export async function GET(req: Request, ctx: RouteCtx) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const { id } = await ctx.params;
    const codes = await db.code.findMany({
      where: { productId: id },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return NextResponse.json({
      codes: codes.map((c) => ({
        id: c.id,
        value: c.value,
        sold: c.sold,
        orderShortId: c.orderShortId,
        createdAt: c.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("admin list codes error", err);
    return NextResponse.json({ error: "Could not load codes." }, { status: 500 });
  }
}

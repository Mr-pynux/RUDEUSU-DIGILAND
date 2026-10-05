import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest, unauthorized } from "@/lib/admin";

export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function toLines(raw: unknown): string[] {
  const list = Array.isArray(raw) ? raw.map((x) => String(x)) : String(raw ?? "").split(/\r?\n/);
  return list.map((l) => l.trim());
}

/** POST /api/admin/products/:id/accounts — bulk-add Gmail/password accounts. */
export async function POST(req: Request, ctx: RouteCtx) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const { id } = await ctx.params;
    const body = await req.json();

    const product = await db.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // Two paired lists (line i of emails ↔ line i of passwords) or one list "email----password".
    const emails = toLines(body?.emails);
    const passwords = toLines(body?.passwords);
    const combined = toLines(body?.combined);

    type Pair = { email: string; password: string; extra: string };
    const pairs: Pair[] = [];
    const skipped: string[] = [];

    const maxLen = Math.max(emails.length, passwords.length, combined.length);

    for (let i = 0; i < maxLen; i++) {
      let email = emails[i] ?? "";
      let password = passwords[i] ?? "";
      let extra = "";

      if (!email && combined[i]) {
        // accept "email----password", "email | password", "email:password", "email, password"
        const raw = combined[i];
        const m = raw.match(/^(.+?)(?:----|\s*\|\s*|\s*:\s*|\s*,\s*)(.+)$/);
        if (m) {
          email = m[1].trim();
          password = m[2].trim();
        }
      }
      if (!email && !password) continue;

      // optional third field via "email----password----note"
      if (email.includes("----")) {
        const parts = email.split("----").map((p) => p.trim());
        email = parts[0];
        if (!password && parts[1]) password = parts[1];
        if (parts[2]) extra = parts.slice(2).join(" ");
      }

      if (!EMAIL_RE.test(email) || password.length < 1) {
        skipped.push(email || `(line ${i + 1})`);
        continue;
      }
      pairs.push({ email: email.toLowerCase(), password, extra });
    }

    // dedupe within payload + against DB
    const seen = new Set<string>();
    const fresh: Pair[] = [];
    for (const p of pairs) {
      if (seen.has(p.email)) {
        skipped.push(p.email);
        continue;
      }
      seen.add(p.email);
      fresh.push(p);
    }

    const existing = await db.account.findMany({
      where: { productId: id, email: { in: fresh.map((f) => f.email) } },
      select: { email: true },
    });
    const existingSet = new Set(existing.map((e) => e.email));
    const toAdd = fresh.filter((f) => !existingSet.has(f.email)).slice(0, 1000);
    const dupes = fresh.length - toAdd.length;

    if (toAdd.length > 0) {
      await db.account.createMany({
        data: toAdd.map((a) => ({
          email: a.email,
          password: a.password,
          extra: a.extra.slice(0, 300),
          productId: id,
        })),
      });
    }

    return NextResponse.json({
      added: toAdd.length,
      skipped: skipped.length + dupes,
    });
  } catch (err) {
    console.error("admin add accounts error", err);
    return NextResponse.json({ error: "Could not add accounts." }, { status: 500 });
  }
}

/** GET /api/admin/products/:id/accounts — list accounts of one product. */
export async function GET(req: Request, ctx: RouteCtx) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const { id } = await ctx.params;
    const accounts = await db.account.findMany({
      where: { productId: id },
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return NextResponse.json({
      accounts: accounts.map((a) => ({
        id: a.id,
        email: a.email,
        password: a.password,
        extra: a.extra,
        sold: a.sold,
        orderShortId: a.orderShortId,
        createdAt: a.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("admin list accounts error", err);
    return NextResponse.json({ error: "Could not load accounts." }, { status: 500 });
  }
}

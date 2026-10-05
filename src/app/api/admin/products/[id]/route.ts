import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest, unauthorized } from "@/lib/admin";

export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: RouteCtx) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const { id } = await ctx.params;
    const body = await req.json();

    const existing = await db.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const data: Record<string, unknown> = {};

    if (body.title !== undefined) {
      const title = String(body.title).trim().slice(0, 140);
      if (title.length >= 4) data.title = title;
    }
    if (body.brand !== undefined) data.brand = String(body.brand).trim().slice(0, 60) || existing.brand;
    if (body.shortDescription !== undefined) {
      const sd = String(body.shortDescription).trim().slice(0, 220);
      if (sd.length >= 8) data.shortDescription = sd;
    }
    if (body.description !== undefined) data.description = String(body.description).trim().slice(0, 4000);
    if (body.features !== undefined) data.features = String(body.features).trim().slice(0, 2000);
    if (body.requirements !== undefined) data.requirements = String(body.requirements).trim().slice(0, 1000);
    if (body.instructions !== undefined) data.instructions = String(body.instructions).trim().slice(0, 2000);
    if (body.emoji !== undefined) data.emoji = String(body.emoji).slice(0, 8);
    if (body.badge !== undefined) data.badge = String(body.badge).trim().slice(0, 20) || null;
    if (body.deliveryType !== undefined) {
      data.deliveryType = String(body.deliveryType) === "MANUAL" ? "MANUAL" : "INSTANT";
    }
    if (body.deliveryKind !== undefined) {
      data.deliveryKind = String(body.deliveryKind) === "ACCOUNT" ? "ACCOUNT" : "KEY";
    }
    if (body.codePrefix !== undefined) {
      data.codePrefix =
        String(body.codePrefix).replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6) || "DIGI";
    }
    if (body.price !== undefined) {
      const price = Math.round(Number(body.price) * 100) / 100;
      if (!Number.isFinite(price) || price < 0.5 || price > 10000) {
        return NextResponse.json({ error: "Price must be between $0.50 and $10,000." }, { status: 400 });
      }
      data.price = price;
    }
    if (body.oldPrice !== undefined) {
      const op = Number(body.oldPrice);
      data.oldPrice = Number.isFinite(op) && op > 0 ? Math.round(op * 100) / 100 : null;
    }
    if (body.stock !== undefined) {
      data.stock = Math.max(0, Math.min(99999, Math.floor(Number(body.stock) || 0)));
    }
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);

    const updated = await db.product.update({ where: { id }, data });

    return NextResponse.json({
      product: { id: updated.id, title: updated.title, price: updated.price, stock: updated.stock, isActive: updated.isActive },
    });
  } catch (err) {
    console.error("admin update product error", err);
    return NextResponse.json({ error: "Could not update product." }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: RouteCtx) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const { id } = await ctx.params;
    await db.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin delete product error", err);
    return NextResponse.json({ error: "Could not delete product." }, { status: 500 });
  }
}

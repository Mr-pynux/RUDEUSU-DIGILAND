import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest, unauthorized } from "@/lib/admin";
import { generateCode } from "@/lib/delivery";
import { sendDeliveryEmail } from "@/lib/mailer";
import type { DeliveredItem, DeliveredAccount } from "@/lib/types";

export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

function randomPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function mapOrder(o: {
  id: string;
  shortId: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone: string;
  buyerNotes: string;
  itemsJson: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  paymentMethod: string;
  status: string;
  emailStatus: string;
  deliveredAt: Date | null;
  createdAt: Date;
}) {
  return {
    id: o.id,
    shortId: o.shortId,
    buyerEmail: o.buyerEmail,
    buyerName: o.buyerName,
    buyerPhone: o.buyerPhone,
    buyerNotes: o.buyerNotes,
    items: JSON.parse(o.itemsJson) as DeliveredItem[],
    subtotal: o.subtotal,
    serviceFee: o.serviceFee,
    total: o.total,
    paymentMethod: o.paymentMethod,
    status: o.status,
    emailStatus: o.emailStatus,
    deliveredAt: o.deliveredAt ? o.deliveredAt.toISOString() : null,
    createdAt: o.createdAt.toISOString(),
  };
}

/**
 * POST /api/admin/orders/:id/deliver
 *   { resend?: boolean }
 *
 * The seller presses "Send to Gmail":
 *   - NEW order  → allocate a pool key / Gmail account per item (oldest first),
 *                  attach them to the order, mark DELIVERED and email the buyer.
 *   - resend on a DELIVERED order → re-send the email (no new allocation).
 */
export async function POST(req: Request, ctx: RouteCtx) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const { id } = await ctx.params;
    let resend = false;
    try {
      const body = await req.json();
      resend = Boolean(body?.resend);
    } catch {
      // empty body is fine
    }

    const order = await db.order.findUnique({ where: { id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // ---------- resend only ----------
    if (order.status === "DELIVERED" || order.status === "COMPLETED") {
      if (!resend) {
        return NextResponse.json(
          { error: "This order was already delivered to the buyer." },
          { status: 409 }
        );
      }
      const items = JSON.parse(order.itemsJson) as DeliveredItem[];
      const emailStatus = await sendDeliveryEmail({
        id: order.id,
        shortId: order.shortId,
        buyerEmail: order.buyerEmail,
        total: order.total,
        paymentMethod: order.paymentMethod,
        items,
      });
      const updated = await db.order.update({
        where: { id },
        data: { emailStatus },
      });
      return NextResponse.json({ order: mapOrder(updated), emailStatus, resent: true });
    }

    if (order.status !== "NEW") {
      return NextResponse.json({ error: "Order cannot be delivered in its current state." }, { status: 409 });
    }

    // ---------- allocate pool stock & deliver ----------
    const items = JSON.parse(order.itemsJson) as DeliveredItem[];
    const fallbacks: string[] = [];

    for (const item of items) {
      const product = await db.product.findUnique({ where: { slug: item.slug } });
      if (!product) continue; // product deleted — leave item empty

      if (item.kind === "ACCOUNT") {
        const pool = await db.account.findMany({
          where: { productId: product.id, sold: false },
          orderBy: { createdAt: "asc" },
          take: item.quantity,
        });
        const accounts: DeliveredAccount[] = [];
        for (const a of pool) {
          await db.account.update({
            where: { id: a.id },
            data: { sold: true, orderShortId: order.shortId },
          });
          accounts.push({ email: a.email, password: a.password, extra: a.extra });
        }
        // fallback demo credentials if the pool ran dry — seller should restock
        while (accounts.length < item.quantity) {
          const email = `rudeusu.${Math.random().toString(36).slice(2, 8)}@gmail-demo.com`;
          accounts.push({ email, password: randomPassword(), extra: "" });
          fallbacks.push(`${item.title}: ${email} (pool empty)`);
        }
        item.accounts = accounts;
      } else {
        const pool = await db.code.findMany({
          where: { productId: product.id, sold: false },
          orderBy: { createdAt: "asc" },
          take: item.quantity,
        });
        const codes: string[] = [];
        for (const c of pool) {
          await db.code.update({
            where: { id: c.id },
            data: { sold: true, orderShortId: order.shortId },
          });
          codes.push(c.value);
        }
        // fallback generated keys if the pool ran dry — seller should restock
        while (codes.length < item.quantity) {
          codes.push(generateCode(product.codePrefix));
          fallbacks.push(`${item.title}: generated key (pool empty)`);
        }
        item.codes = codes;
      }
    }

    const emailStatus = await sendDeliveryEmail({
      id: order.id,
      shortId: order.shortId,
      buyerEmail: order.buyerEmail,
      total: order.total,
      paymentMethod: order.paymentMethod,
      items,
    });

    const updated = await db.order.update({
      where: { id },
      data: {
        itemsJson: JSON.stringify(items),
        status: "DELIVERED",
        emailStatus,
        deliveredAt: new Date(),
      },
    });

    return NextResponse.json({
      order: mapOrder(updated),
      emailStatus,
      fallbacks,
    });
  } catch (err) {
    console.error("admin deliver order error", err);
    return NextResponse.json({ error: "Could not deliver this order." }, { status: 500 });
  }
}

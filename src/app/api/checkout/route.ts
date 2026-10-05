import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  computeServiceFee,
  generateCode,
  generateOrderShortId,
  isValidEmail,
} from "@/lib/delivery";
import { sendDeliveryEmail } from "@/lib/mailer";
import type { DeliveredItem } from "@/lib/types";

type CheckoutItem = { slug: string; quantity: number };

function randomPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email: string = String(body?.email ?? "").trim().toLowerCase();
    const paymentMethod: string = String(body?.paymentMethod ?? "card");
    const items: CheckoutItem[] = Array.isArray(body?.items) ? body.items : [];

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address — your goods are delivered there." },
        { status: 400 }
      );
    }

    if (items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // Load products and validate stock
    const slugs = items.map((i) => String(i.slug));
    const products = await db.product.findMany({ where: { slug: { in: slugs } } });
    const bySlug = new Map(products.map((p) => [p.slug, p]));

    let subtotal = 0;
    const delivered: DeliveredItem[] = [];
    const consumedCodeIds: string[] = [];
    const consumedAccountIds: string[] = [];
    const shortId = generateOrderShortId();

    for (const item of items) {
      const product = bySlug.get(item.slug);
      const qty = Math.max(1, Math.min(10, Math.floor(Number(item.quantity) || 1)));
      if (!product) {
        return NextResponse.json(
          { error: `Product "${item.slug}" no longer exists.` },
          { status: 400 }
        );
      }
      if (product.stock < qty) {
        return NextResponse.json(
          { error: `Only ${product.stock} left in stock for "${product.title}".` },
          { status: 409 }
        );
      }
      subtotal += product.price * qty;

      const isAccount = product.deliveryKind === "ACCOUNT";

      if (isAccount) {
        // ---- ACCOUNT delivery: consume Gmail/password credentials (oldest first)
        const pool = await db.account.findMany({
          where: { productId: product.id, sold: false },
          orderBy: { createdAt: "asc" },
          take: qty,
        });
        for (const a of pool) {
          await db.account.update({
            where: { id: a.id },
            data: { sold: true, orderShortId: shortId },
          });
          consumedAccountIds.push(a.id);
        }
        const generated = Array.from({ length: qty - pool.length }, () => ({
          email: `${product.codePrefix.toLowerCase()}.${Math.random()
            .toString(36)
            .slice(2, 8)}@rudeusu-mail.com`,
          password: randomPassword(),
          extra: "",
        }));
        delivered.push({
          slug: product.slug,
          title: product.title,
          emoji: product.emoji,
          gradient: product.gradient,
          quantity: qty,
          unitPrice: product.price,
          kind: "ACCOUNT",
          codes: [],
          accounts: [...pool.map((a) => ({ email: a.email, password: a.password, extra: a.extra })), ...generated],
          instructions: product.instructions,
          sellerName: product.sellerName,
        });
      } else {
        // ---- KEY delivery: consume uploaded codes from the admin pool first (oldest first)
        const poolCodes = await db.code.findMany({
          where: { productId: product.id, sold: false },
          orderBy: { createdAt: "asc" },
          take: qty,
        });
        for (const c of poolCodes) {
          await db.code.update({
            where: { id: c.id },
            data: { sold: true, orderShortId: shortId },
          });
          consumedCodeIds.push(c.id);
        }
        const generated = Array.from(
          { length: qty - poolCodes.length },
          () => generateCode(product.codePrefix)
        );
        delivered.push({
          slug: product.slug,
          title: product.title,
          emoji: product.emoji,
          gradient: product.gradient,
          quantity: qty,
          unitPrice: product.price,
          kind: "KEY",
          codes: [...poolCodes.map((c) => c.value), ...generated],
          instructions: product.instructions,
          sellerName: product.sellerName,
        });
      }
    }

    subtotal = Math.round(subtotal * 100) / 100;
    const serviceFee = computeServiceFee(subtotal);
    const total = Math.round((subtotal + serviceFee) * 100) / 100;

    // Create order + update stock/sold atomically enough for demo scale
    const order = await db.order.create({
      data: {
        shortId,
        buyerEmail: email,
        itemsJson: JSON.stringify(delivered),
        subtotal,
        serviceFee,
        total,
        paymentMethod,
        status: "COMPLETED",
      },
    });

    for (const item of delivered) {
      await db.product.update({
        where: { slug: item.slug },
        data: {
          stock: { decrement: item.quantity },
          sold: { increment: item.quantity },
        },
      });
    }

    // ---- Gmail delivery: email the keys / accounts to the buyer after payment
    let deliveryEmail = "queued";
    try {
      await sendDeliveryEmail({
        id: order.id,
        shortId: order.shortId,
        buyerEmail: order.buyerEmail,
        total: order.total,
        paymentMethod: order.paymentMethod,
        items: delivered,
      });
      deliveryEmail = gmailConfiguredFlag() ? "sent" : "queued";
    } catch (mailErr) {
      console.error("delivery email error", mailErr);
      deliveryEmail = "failed";
    }

    return NextResponse.json({
      order: {
        id: order.id,
        shortId: order.shortId,
        buyerEmail: order.buyerEmail,
        items: delivered,
        subtotal: order.subtotal,
        serviceFee: order.serviceFee,
        total: order.total,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: order.createdAt,
      },
      deliveryEmail,
    });
  } catch (err) {
    console.error("checkout error", err);
    return NextResponse.json(
      { error: "Payment processor temporarily unavailable. Please retry." },
      { status: 500 }
    );
  }
}

function gmailConfiguredFlag(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

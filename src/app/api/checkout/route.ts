import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeServiceFee, generateOrderShortId, isValidEmail } from "@/lib/delivery";
import type { DeliveredItem } from "@/lib/types";

type CheckoutItem = { slug: string; quantity: number };

/**
 * Manual-delivery checkout (RUDEUSU DIGILAND flow):
 *  1. Buyer fills the information form (name, Gmail, phone, notes) and pays.
 *  2. The order lands in the admin panel as a sale with status NEW.
 *  3. The seller presses "Send to Gmail" → the pool key / Gmail account is
 *     allocated and emailed to the buyer (see /api/admin/orders/[id]/deliver).
 *
 * Nothing is delivered here — stock is only reserved.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email: string = String(body?.email ?? "").trim().toLowerCase();
    const name: string = String(body?.name ?? "").trim();
    const phone: string = String(body?.phone ?? "").trim();
    const notes: string = String(body?.notes ?? "").trim();
    const paymentMethod: string = String(body?.paymentMethod ?? "card");
    const items: CheckoutItem[] = Array.isArray(body?.items) ? body.items : [];

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid Gmail / email address — your goods will be sent there." },
        { status: 400 }
      );
    }
    if (name.length < 2) {
      return NextResponse.json(
        { error: "Please write your full name in the order form." },
        { status: 400 }
      );
    }
    if (items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    // Load products, validate stock and build the order snapshot
    const slugs = items.map((i) => String(i.slug));
    const products = await db.product.findMany({ where: { slug: { in: slugs } } });
    const bySlug = new Map(products.map((p) => [p.slug, p]));

    let subtotal = 0;
    const snapshot: DeliveredItem[] = [];

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

      // Snapshot only — keys / accounts are attached later when the seller sends.
      snapshot.push({
        slug: product.slug,
        title: product.title,
        emoji: product.emoji,
        gradient: product.gradient,
        quantity: qty,
        unitPrice: product.price,
        kind: product.deliveryKind === "ACCOUNT" ? "ACCOUNT" : "KEY",
        codes: [],
        accounts: [],
        instructions: product.instructions,
        sellerName: product.sellerName,
      });
    }

    subtotal = Math.round(subtotal * 100) / 100;
    const serviceFee = computeServiceFee(subtotal);
    const total = Math.round((subtotal + serviceFee) * 100) / 100;
    const shortId = generateOrderShortId();

    const order = await db.order.create({
      data: {
        shortId,
        buyerEmail: email,
        buyerName: name.slice(0, 120),
        buyerPhone: phone.slice(0, 60),
        buyerNotes: notes.slice(0, 500),
        itemsJson: JSON.stringify(snapshot),
        subtotal,
        serviceFee,
        total,
        paymentMethod,
        status: "NEW",
      },
    });

    // Reserve stock (the pool item itself is attached at delivery time)
    for (const item of snapshot) {
      await db.product.update({
        where: { slug: item.slug },
        data: {
          stock: { decrement: item.quantity },
          sold: { increment: item.quantity },
        },
      });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        shortId: order.shortId,
        buyerEmail: order.buyerEmail,
        buyerName: order.buyerName,
        buyerPhone: order.buyerPhone,
        buyerNotes: order.buyerNotes,
        items: snapshot,
        subtotal: order.subtotal,
        serviceFee: order.serviceFee,
        total: order.total,
        paymentMethod: order.paymentMethod,
        status: order.status,
        emailStatus: "",
        deliveredAt: null,
        createdAt: order.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("checkout error", err);
    return NextResponse.json(
      { error: "Checkout temporarily unavailable. Please retry." },
      { status: 500 }
    );
  }
}

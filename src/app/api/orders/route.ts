import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isValidEmail } from "@/lib/delivery";
import type { ApiOrder, DeliveredItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = String(searchParams.get("email") ?? "").trim().toLowerCase();

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Enter the email you used at checkout." },
      { status: 400 }
    );
  }

  const orders = await db.order.findMany({
    where: { buyerEmail: email },
    orderBy: { createdAt: "desc" },
    take: 25,
  });

  const mapped: ApiOrder[] = orders.map((o) => ({
    id: o.id,
    shortId: o.shortId,
    buyerEmail: o.buyerEmail,
    items: JSON.parse(o.itemsJson) as DeliveredItem[],
    subtotal: o.subtotal,
    serviceFee: o.serviceFee,
    total: o.total,
    paymentMethod: o.paymentMethod,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));

  return NextResponse.json({ orders: mapped });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest, unauthorized } from "@/lib/admin";
import { gmailConfigured } from "@/lib/mailer";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const [products, codeCounts, accountCounts, orders, totalOrders, awaitingOrders, emails, emailsSent, emailsQueued] =
      await Promise.all([
        db.product.findMany({
          orderBy: { createdAt: "desc" },
          include: { category: true },
        }),
        db.code.groupBy({
          by: ["productId", "sold"],
          _count: { _all: true },
        }),
        db.account.groupBy({
          by: ["productId", "sold"],
          _count: { _all: true },
        }),
        db.order.findMany({ orderBy: { createdAt: "desc" }, take: 60 }),
        db.order.count(),
        db.order.count({ where: { status: "NEW" } }),
        db.emailLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
        db.emailLog.count({ where: { status: "SENT" } }),
        db.emailLog.count({ where: { status: "QUEUED" } }),
      ]);

    const codeMap = new Map<string, { available: number; sold: number }>();
    for (const row of codeCounts) {
      const entry = codeMap.get(row.productId) ?? { available: 0, sold: 0 };
      if (row.sold) entry.sold += row._count._all;
      else entry.available += row._count._all;
      codeMap.set(row.productId, entry);
    }

    const accountMap = new Map<string, { available: number; sold: number }>();
    for (const row of accountCounts) {
      const entry = accountMap.get(row.productId) ?? { available: 0, sold: 0 };
      if (row.sold) entry.sold += row._count._all;
      else entry.available += row._count._all;
      accountMap.set(row.productId, entry);
    }

    const revenue = Math.round(orders.reduce((acc, o) => acc + o.total, 0) * 100) / 100;
    const codesAvailable = products.reduce(
      (acc, p) => acc + (codeMap.get(p.id)?.available ?? 0),
      0
    );
    const codesSold = products.reduce((acc, p) => acc + (codeMap.get(p.id)?.sold ?? 0), 0);
    const accountsAvailable = products.reduce(
      (acc, p) => acc + (accountMap.get(p.id)?.available ?? 0),
      0
    );
    const accountsSold = products.reduce((acc, p) => acc + (accountMap.get(p.id)?.sold ?? 0), 0);

    return NextResponse.json({
      stats: {
        totalProducts: products.length,
        totalOrders,
        awaitingOrders,
        revenue,
        codesAvailable,
        codesSold,
        accountsAvailable,
        accountsSold,
        emailsSent,
        emailsQueued,
        gmailConfigured: gmailConfigured(),
      },
      products: products.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        brand: p.brand,
        shortDescription: p.shortDescription,
        description: p.description,
        features: p.features,
        requirements: p.requirements,
        price: p.price,
        oldPrice: p.oldPrice,
        emoji: p.emoji,
        gradient: p.gradient,
        badge: p.badge,
        stock: p.stock,
        sold: p.sold,
        rating: p.rating,
        ratingCount: p.ratingCount,
        sellerName: p.sellerName,
        sellerRating: p.sellerRating,
        sellerSales: p.sellerSales,
        deliveryType: p.deliveryType,
        deliveryKind: p.deliveryKind,
        codePrefix: p.codePrefix,
        instructions: p.instructions,
        categorySlug: p.category.slug,
        categoryName: p.category.name,
        isActive: p.isActive,
        createdAt: p.createdAt.toISOString(),
        codesAvailable: codeMap.get(p.id)?.available ?? 0,
        codesSold: codeMap.get(p.id)?.sold ?? 0,
        accountsAvailable: accountMap.get(p.id)?.available ?? 0,
        accountsSold: accountMap.get(p.id)?.sold ?? 0,
      })),
      orders: orders.map((o) => ({
        id: o.id,
        shortId: o.shortId,
        buyerEmail: o.buyerEmail,
        buyerName: o.buyerName,
        buyerPhone: o.buyerPhone,
        buyerNotes: o.buyerNotes,
        items: JSON.parse(o.itemsJson),
        subtotal: o.subtotal,
        serviceFee: o.serviceFee,
        total: o.total,
        paymentMethod: o.paymentMethod,
        status: o.status,
        emailStatus: o.emailStatus,
        deliveredAt: o.deliveredAt ? o.deliveredAt.toISOString() : null,
        createdAt: o.createdAt.toISOString(),
      })),
      emails: emails.map((e) => ({
        id: e.id,
        to: e.to,
        subject: e.subject,
        bodyHtml: e.bodyHtml,
        status: e.status,
        error: e.error,
        orderId: e.orderId,
        createdAt: e.createdAt.toISOString(),
      })),
    });
  } catch (err) {
    console.error("admin data error", err);
    return NextResponse.json({ error: "Could not load admin data." }, { status: 500 });
  }
}

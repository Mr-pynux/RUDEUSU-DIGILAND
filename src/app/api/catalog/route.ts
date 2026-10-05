import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { CatalogResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const [categories, products, orderCount] = await Promise.all([
    db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    db.product.findMany({
      where: { isActive: true },
      orderBy: { sold: "desc" },
      include: { category: true },
    }),
    db.order.count(),
  ]);

  const totalSales = products.reduce((acc, p) => acc + p.sold, 0);
  const avgRating =
    products.length > 0
      ? products.reduce((acc, p) => acc + p.rating, 0) / products.length
      : 0;

  const response: CatalogResponse = {
    categories: categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      tagline: c.tagline,
      emoji: c.emoji,
      productCount: c._count.products,
    })),
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
      imageUrl: p.imageUrl,
      badge: p.badge,
      stock: p.stock,
      sold: p.sold,
      rating: p.rating,
      ratingCount: p.ratingCount,
      sellerName: p.sellerName,
      sellerRating: p.sellerRating,
      sellerSales: p.sellerSales,
      codePrefix: p.codePrefix,
      instructions: p.instructions,
      deliveryType: p.deliveryType,
      categorySlug: p.category.slug,
      categoryName: p.category.name,
      createdAt: p.createdAt.toISOString(),
    })),
    stats: {
      totalProducts: products.length,
      totalSales,
      avgRating: Math.round(avgRating * 10) / 10,
      totalOrders: orderCount + 128450, // historic baseline of the marketplace
    },
  };

  return NextResponse.json(response);
}

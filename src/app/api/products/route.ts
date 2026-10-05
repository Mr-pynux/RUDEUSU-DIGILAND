import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const GRADIENTS = [
  "from-violet-500 via-fuchsia-500 to-rose-400",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-orange-400 via-amber-500 to-yellow-400",
  "from-rose-400 via-pink-500 to-fuchsia-500",
  "from-cyan-500 via-sky-500 to-blue-500",
  "from-lime-500 via-emerald-500 to-teal-500",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const title: string = String(body?.title ?? "").trim().slice(0, 120);
    const brand: string = String(body?.brand ?? "Rudeusu DigiLand").trim().slice(0, 60) || "Rudeusu DigiLand";
    const categorySlug: string = String(body?.categorySlug ?? "");
    const shortDescription: string = String(body?.shortDescription ?? "").trim().slice(0, 200);
    const description: string = String(body?.description ?? "").trim().slice(0, 2000);
    const featuresRaw: string = String(body?.features ?? "").trim().slice(0, 1500);
    const price = Math.round(Number(body?.price) * 100) / 100;
    const stock = Math.max(1, Math.min(9999, Math.floor(Number(body?.stock) || 10)));
    const emoji: string = String(body?.emoji ?? "🛒").slice(0, 4);
    const deliveryType: string = String(body?.deliveryType ?? "INSTANT") === "MANUAL" ? "MANUAL" : "INSTANT";
    const sellerName: string = String(body?.sellerName ?? "Rudeusu").trim().slice(0, 40) || "Rudeusu";

    if (title.length < 5) {
      return NextResponse.json({ error: "Title must be at least 5 characters." }, { status: 400 });
    }
    if (!categorySlug) {
      return NextResponse.json({ error: "Pick a category for your product." }, { status: 400 });
    }
    if (shortDescription.length < 10) {
      return NextResponse.json({ error: "Write a short description (10+ characters)." }, { status: 400 });
    }
    if (!Number.isFinite(price) || price < 0.5 || price > 5000) {
      return NextResponse.json({ error: "Price must be between $0.50 and $5000." }, { status: 400 });
    }

    const category = await db.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      return NextResponse.json({ error: "Unknown category." }, { status: 400 });
    }

    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 60);
    const slug = `${base || "product"}-${Date.now().toString(36).slice(-5)}`;

    const product = await db.product.create({
      data: {
        slug,
        title,
        brand,
        shortDescription,
        description: description || shortDescription,
        features: featuresRaw || "Digital product with instant delivery.",
        price,
        emoji,
        gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
        badge: "NEW",
        stock,
        sold: 0,
        rating: 5.0,
        ratingCount: 0,
        sellerName,
        sellerRating: 5.0,
        sellerSales: 0,
        deliveryType,
        codePrefix: brand.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 4) || "DIGI",
        instructions:
          "1. Open the delivery email you received.\n2. Copy your activation code.\n3. Follow the instructions attached to redeem it.",
        categoryId: category.id,
      },
    });

    return NextResponse.json({
      product: { slug: product.slug, title: product.title, price: product.price },
    });
  } catch (err) {
    console.error("create product error", err);
    return NextResponse.json({ error: "Could not publish product." }, { status: 500 });
  }
}

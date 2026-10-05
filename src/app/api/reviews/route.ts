import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing product slug." }, { status: 400 });
  }

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      reviews: { orderBy: { createdAt: "desc" }, take: 40 },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({
    reviews: product.reviews.map((r) => ({
      id: r.id,
      author: r.author,
      rating: r.rating,
      comment: r.comment,
      verified: r.verified,
      createdAt: r.createdAt,
    })),
    rating: product.rating,
    ratingCount: product.ratingCount,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug: string = String(body?.slug ?? "");
    const author: string = String(body?.author ?? "").trim().slice(0, 40);
    const comment: string = String(body?.comment ?? "").trim().slice(0, 600);
    const rating = Math.max(1, Math.min(5, Math.floor(Number(body?.rating) || 5)));

    if (!slug) {
      return NextResponse.json({ error: "Missing product." }, { status: 400 });
    }
    if (author.length < 2) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (comment.length < 5) {
      return NextResponse.json(
        { error: "Please write a short review (at least 5 characters)." },
        { status: 400 }
      );
    }

    const product = await db.product.findUnique({ where: { slug } });
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const review = await db.review.create({
      data: { productId: product.id, author, rating, comment, verified: true },
    });

    // Recompute aggregate rating
    const agg = await db.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: { rating: true },
    });
    const seedShare = 0.8; // weight existing marketplace rating with new reviews
    const newRating =
      agg._avg.rating !== null
        ? (product.rating * seedShare + agg._avg.rating * (1 - seedShare))
        : product.rating;
    const updated = await db.product.update({
      where: { slug },
      data: {
        rating: Math.round(newRating * 10) / 10,
        ratingCount: { increment: 1 },
      },
    });

    return NextResponse.json({
      review: {
        id: review.id,
        author: review.author,
        rating: review.rating,
        comment: review.comment,
        verified: review.verified,
        createdAt: review.createdAt,
      },
      rating: updated.rating,
      ratingCount: updated.ratingCount,
    });
  } catch (err) {
    console.error("review error", err);
    return NextResponse.json({ error: "Could not save review." }, { status: 500 });
  }
}

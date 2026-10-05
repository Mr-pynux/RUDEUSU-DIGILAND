import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest, unauthorized } from "@/lib/admin";

export const dynamic = "force-dynamic";

const GRADIENTS = [
  "from-violet-500 via-fuchsia-500 to-rose-400",
  "from-emerald-500 via-teal-500 to-cyan-500",
  "from-orange-400 via-amber-500 to-yellow-400",
  "from-rose-400 via-pink-500 to-fuchsia-500",
  "from-lime-500 via-emerald-500 to-teal-500",
  "from-purple-500 via-violet-500 to-indigo-400",
];

function parseCodes(raw: unknown): string[] {
  const list = Array.isArray(raw)
    ? raw.map((c) => String(c))
    : String(raw ?? "").split(/\r?\n/);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const line of list) {
    const value = line.trim();
    if (value.length < 3 || value.length > 300) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    out.push(value);
    if (out.length >= 1000) break;
  }
  return out;
}

export async function POST(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const body = await req.json();

    const title: string = String(body?.title ?? "").trim().slice(0, 140);
    const brand: string = String(body?.brand ?? "RUDEUSU DIGILAND").trim().slice(0, 60) || "RUDEUSU DIGILAND";
    const categorySlug: string = String(body?.categorySlug ?? "");
    const shortDescription: string = String(body?.shortDescription ?? "").trim().slice(0, 220);
    const description: string = String(body?.description ?? "").trim().slice(0, 4000);
    const features: string = String(body?.features ?? "").trim().slice(0, 2000);
    const requirements: string = String(body?.requirements ?? "").trim().slice(0, 1000);
    const instructions: string = String(body?.instructions ?? "").trim().slice(0, 2000);
    const badge: string = String(body?.badge ?? "").trim().slice(0, 20);
    const emoji: string = String(body?.emoji ?? "📦").slice(0, 8);
    const gradient: string = GRADIENTS.includes(String(body?.gradient))
      ? String(body?.gradient)
      : GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
    const deliveryType: string = String(body?.deliveryType ?? "INSTANT") === "MANUAL" ? "MANUAL" : "INSTANT";
    const deliveryKind: string = String(body?.deliveryKind ?? "KEY") === "ACCOUNT" ? "ACCOUNT" : "KEY";
    const codePrefix: string =
      String(body?.codePrefix ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 6) || "DIGI";
    const sellerName: string = String(body?.sellerName ?? "RUDEUSU Official").trim().slice(0, 40) || "RUDEUSU Official";

    const price = Math.round(Number(body?.price) * 100) / 100;
    const oldPriceRaw = Number(body?.oldPrice);
    const oldPrice = Number.isFinite(oldPriceRaw) && oldPriceRaw > 0 ? Math.round(oldPriceRaw * 100) / 100 : null;
    const stock = Math.max(0, Math.min(99999, Math.floor(Number(body?.stock) || 0)));

    if (title.length < 4) {
      return NextResponse.json({ error: "Title must be at least 4 characters." }, { status: 400 });
    }
    if (!categorySlug) {
      return NextResponse.json({ error: "Pick a category." }, { status: 400 });
    }
    if (shortDescription.length < 8) {
      return NextResponse.json(
        { error: "Write a short description (at least 8 characters)." },
        { status: 400 }
      );
    }
    if (!Number.isFinite(price) || price < 0.5 || price > 10000) {
      return NextResponse.json({ error: "Price must be between $0.50 and $10,000." }, { status: 400 });
    }

    const category = await db.category.findUnique({ where: { slug: categorySlug } });
    if (!category) {
      return NextResponse.json({ error: "Unknown category." }, { status: 400 });
    }

    const base =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 60) || "product";
    const slug = `${base}-${Date.now().toString(36).slice(-5)}`;

    const codes = parseCodes(body?.codes);

    const product = await db.product.create({
      data: {
        slug,
        title,
        brand,
        shortDescription,
        description: description || shortDescription,
        features: features || "Digital product with instant delivery.",
        requirements,
        price,
        oldPrice,
        emoji,
        gradient,
        badge: badge || null,
        stock,
        sold: 0,
        rating: 5.0,
        ratingCount: 0,
        sellerName,
        sellerRating: 5.0,
        sellerSales: 0,
        deliveryType,
        deliveryKind,
        codePrefix,
        instructions:
          instructions ||
          "1. Open the delivery email you received.\n2. Copy your activation code.\n3. Follow the attached instructions to redeem it.",
        categoryId: category.id,
      },
    });

    if (codes.length > 0) {
      await db.code.createMany({
        data: codes.map((value) => ({ value, productId: product.id })),
      });
    }

    // Optional Gmail accounts uploaded at creation (paired lists or combined lines)
    let accountsAdded = 0;
    {
      const emails: string[] = Array.isArray(body?.emails)
        ? body.emails.map((e: unknown) => String(e).trim().toLowerCase())
        : String(body?.emails ?? "").split(/\r?\n/).map((l) => l.trim().toLowerCase());
      const passwords: string[] = Array.isArray(body?.passwords)
        ? body.passwords.map((p: unknown) => String(p).trim())
        : String(body?.passwords ?? "").split(/\r?\n/).map((l) => l.trim());
      const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const seenEmail = new Set<string>();
      const rows: { email: string; password: string }[] = [];
      for (let i = 0; i < Math.max(emails.length, passwords.length); i++) {
        const email = (emails[i] ?? "").trim();
        const password = (passwords[i] ?? "").trim();
        if (!email || !password) continue;
        if (!EMAIL_RE.test(email) || seenEmail.has(email)) continue;
        seenEmail.add(email);
        rows.push({ email, password });
      }
      if (rows.length > 0) {
        await db.account.createMany({
          data: rows.map((r) => ({ ...r, productId: product.id })),
        });
        accountsAdded = rows.length;
      }
    }

    return NextResponse.json({
      product: { id: product.id, slug: product.slug, title: product.title },
      codesAdded: codes.length,
      accountsAdded,
    });
  } catch (err) {
    console.error("admin create product error", err);
    return NextResponse.json({ error: "Could not create product." }, { status: 500 });
  }
}

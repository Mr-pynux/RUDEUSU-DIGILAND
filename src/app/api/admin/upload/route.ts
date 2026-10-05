import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { isAdminRequest, unauthorized } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

/**
 * POST /api/admin/upload — product image upload (admin only).
 * multipart/form-data with field "file" → saved under public/uploads,
 * returns { url: "/uploads/<name>" } for the product's imageUrl field.
 */
export async function POST(req: Request) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No image file received." }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image must be under 4 MB." }, { status: 400 });
    }

    const ext = ALLOWED[file.type];
    if (!ext) {
      return NextResponse.json(
        { error: "Unsupported image type. Use PNG, JPG, WEBP or GIF." },
        { status: 400 }
      );
    }

    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });

    const name = `p${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, name), bytes);

    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (err) {
    console.error("admin upload error", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}

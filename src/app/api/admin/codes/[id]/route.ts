import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest, unauthorized } from "@/lib/admin";

export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

/** DELETE /api/admin/codes/:id — delete a single unsold code. */
export async function DELETE(req: Request, ctx: RouteCtx) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const { id } = await ctx.params;

    const code = await db.code.findUnique({ where: { id } });
    if (!code) {
      return NextResponse.json({ error: "Code not found." }, { status: 404 });
    }
    if (code.sold) {
      return NextResponse.json(
        { error: "This code was already sold and cannot be deleted." },
        { status: 409 }
      );
    }

    await db.code.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin delete code error", err);
    return NextResponse.json({ error: "Could not delete code." }, { status: 500 });
  }
}

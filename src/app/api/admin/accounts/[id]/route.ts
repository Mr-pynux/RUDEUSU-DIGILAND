import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminRequest, unauthorized } from "@/lib/admin";

export const dynamic = "force-dynamic";

type RouteCtx = { params: Promise<{ id: string }> };

/** DELETE /api/admin/accounts/:id — delete a single unsold account. */
export async function DELETE(req: Request, ctx: RouteCtx) {
  if (!isAdminRequest(req)) return unauthorized();

  try {
    const { id } = await ctx.params;

    const account = await db.account.findUnique({ where: { id } });
    if (!account) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }
    if (account.sold) {
      return NextResponse.json(
        { error: "This account was already sold and cannot be deleted." },
        { status: 409 }
      );
    }

    await db.account.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("admin delete account error", err);
    return NextResponse.json({ error: "Could not delete account." }, { status: 500 });
  }
}

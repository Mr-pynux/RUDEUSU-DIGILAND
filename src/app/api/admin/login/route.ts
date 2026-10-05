import { NextResponse } from "next/server";
import { ADMIN_PASSWORD, ADMIN_TOKEN } from "@/lib/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const password = String(body?.password ?? "");

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Wrong password." }, { status: 401 });
    }

    return NextResponse.json({ ok: true, token: ADMIN_TOKEN });
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}

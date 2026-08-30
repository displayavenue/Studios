import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await loginUser(String(body.email), String(body.password));
    return NextResponse.json({ ok: true, ...user });
  } catch {
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }
}

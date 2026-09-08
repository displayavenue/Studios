import { NextRequest, NextResponse } from "next/server";
import { registerUser, loginUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    await registerUser({
      email: String(body.email),
      password: String(body.password),
      firstName: body.firstName ? String(body.firstName) : undefined,
      lastName: body.lastName ? String(body.lastName) : undefined,
    });
    const user = await loginUser(String(body.email), String(body.password));
    return NextResponse.json({ ok: true, ...user });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "SIGNUP_FAILED";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

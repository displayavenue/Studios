import { NextResponse } from "next/server";
import {
  createAdminSessionToken,
  getExpectedAdminPassword,
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  readAdminSession,
} from "@/lib/cms-auth";

export async function GET() {
  const session = await readAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({ authenticated: true, email: session.email, role: session.role });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: string; email?: string };
  if (!body.password || body.password !== getExpectedAdminPassword()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const token = createAdminSessionToken(body.email || "admin@homeopathypharma.com");
  const res = NextResponse.json({ ok: true, email: body.email || "admin@homeopathypharma.com" });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}

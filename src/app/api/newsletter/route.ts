import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const email = form?.get("email") || (await req.json().catch(() => ({}))).email;
  if (!email) return NextResponse.json({ error: "EMAIL_REQUIRED" }, { status: 400 });
  // Consent-aware placeholder — no fake list growth
  return NextResponse.redirect(new URL("/?newsletter=1", req.url));
}

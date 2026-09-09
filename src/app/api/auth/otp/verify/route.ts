import { NextRequest, NextResponse } from "next/server";
import { verifyLoginOtp } from "@/lib/auth-otp";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await verifyLoginOtp({
      phone: String(body.phone || ""),
      code: String(body.code || ""),
    });
    await trackEvent({
      eventName: "otp_verify",
      userId: user.id,
      properties: { ok: true },
      pageUrl: "/login",
    });
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "VERIFY_FAILED";
    return NextResponse.json(
      { error: msg, message: "Invalid or expired OTP. Try again." },
      { status: 401 },
    );
  }
}

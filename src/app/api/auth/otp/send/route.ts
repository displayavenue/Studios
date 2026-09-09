import { NextRequest, NextResponse } from "next/server";
import { sendLoginOtp } from "@/lib/auth-otp";
import { trackEvent } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await sendLoginOtp({
      phone: String(body.phone || ""),
      countryCode: String(body.countryCode || "+91"),
    });
    await trackEvent({
      eventName: "otp_send",
      properties: { phoneSuffix: result.phone.slice(-4), mock: result.mock },
      pageUrl: "/login",
    });
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "SEND_FAILED";
    const status = msg === "INVALID_PHONE" ? 400 : 500;
    return NextResponse.json(
      { error: msg, message: msg === "INVALID_PHONE" ? "Enter a valid 10-digit Indian mobile number." : msg },
      { status },
    );
  }
}

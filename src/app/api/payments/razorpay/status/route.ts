import { NextResponse } from "next/server";
import { getRazorpayKeyId } from "@/providers/payment";
import { useMockProviders } from "@/config/site";

export const dynamic = "force-dynamic";

export async function GET() {
  const keyId = getRazorpayKeyId();
  const mock = useMockProviders();
  const configured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

  return NextResponse.json({
    ok: true,
    configured,
    mockProviders: mock,
    keyIdPrefix: keyId ? `${keyId.slice(0, 12)}…` : "",
    mode: keyId.startsWith("rzp_live_") ? "live" : keyId.startsWith("rzp_test_") ? "test" : mock ? "mock" : "unset",
    checkoutReady: configured && !mock,
  });
}

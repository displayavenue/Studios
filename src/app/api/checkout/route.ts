import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { createCheckoutOrder } from "@/services/order/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = await getSession();
    const jar = await cookies();
    const guestId = jar.get("velora_guest")?.value;

    const result = await createCheckoutOrder({
      userId: session?.id,
      sessionId: guestId,
      email: String(body.email),
      phone: String(body.phone),
      address: body.address,
      paymentMethod: body.paymentMethod === "COD" ? "COD" : "RAZORPAY",
      couponCode: body.couponCode,
      idempotencyKey: body.idempotencyKey,
      utm: body.utm,
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "CHECKOUT_FAILED" },
      { status: 400 },
    );
  }
}

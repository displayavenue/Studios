import { NextRequest, NextResponse } from "next/server";
import { confirmRazorpayPayment } from "@/services/order/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await confirmRazorpayPayment({
      orderId: body.orderId,
      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
      signature: body.signature,
      createSession: body.createSession !== false,
    });

    return NextResponse.json({
      ok: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
      },
      redirectTo: `/checkout/success?order=${order.orderNumber}`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "PAYMENT_FAILED" },
      { status: 400 },
    );
  }
}

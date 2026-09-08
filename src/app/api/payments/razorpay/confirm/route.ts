import { NextRequest, NextResponse } from "next/server";
import {
  confirmRazorpayPayment,
  processPaidOrder,
  finalizeOrderCosts,
} from "@/services/order/service";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await confirmRazorpayPayment({
      orderId: body.orderId,
      razorpayOrderId: body.razorpayOrderId,
      razorpayPaymentId: body.razorpayPaymentId,
      signature: body.signature,
    });

    // Clear guest cart
    const jar = await cookies();
    const guestId = jar.get("velora_guest")?.value;
    if (guestId) {
      const cart = await prisma.cart.findFirst({ where: { sessionId: guestId } });
      if (cart) await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    const processed = await processPaidOrder(order.id);
    await finalizeOrderCosts(order.id);

    await prisma.analyticsEvent.create({
      data: {
        eventName: "purchase",
        orderId: order.id,
        value: order.total,
        metaEventId: `purchase_${order.id}_${body.razorpayPaymentId}`,
      },
    });

    return NextResponse.json({ ok: true, order: processed });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "PAYMENT_FAILED" },
      { status: 400 },
    );
  }
}

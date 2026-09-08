import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/providers/payment";
import { confirmRazorpayPayment } from "@/services/order/service";
import { PaymentStatus } from "@/generated/prisma/enums";

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 401 });
  }

  const payload = JSON.parse(raw) as {
    event: string;
    payload?: {
      payment?: {
        entity?: {
          id: string;
          order_id: string;
          status: string;
        };
      };
    };
  };

  try {
    if (payload.event === "payment.captured") {
      const entity = payload.payload?.payment?.entity;
      if (entity) {
        const payment = await prisma.payment.findFirst({
          where: { razorpayOrderId: entity.order_id },
        });
        if (payment && payment.status !== PaymentStatus.SUCCESS) {
          await confirmRazorpayPayment({
            orderId: payment.orderId,
            razorpayOrderId: entity.order_id,
            razorpayPaymentId: entity.id,
            signature: signature || "webhook",
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "PROCESSING_FAILED" },
      { status: 500 },
    );
  }
}

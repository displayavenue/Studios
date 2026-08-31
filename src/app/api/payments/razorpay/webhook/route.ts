import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/providers/payment";
import { confirmRazorpayPayment, processPaidOrder, finalizeOrderCosts } from "@/services/order/service";

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

  const eventId = `${payload.event}_${payload.payload?.payment?.entity?.id || Date.now()}`;

  const existing = await prisma.webhookEvent.findUnique({
    where: { provider_eventId: { provider: "razorpay", eventId } },
  });
  if (existing?.processed) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  const webhook = await prisma.webhookEvent.upsert({
    where: { provider_eventId: { provider: "razorpay", eventId } },
    create: {
      provider: "razorpay",
      eventId,
      eventType: payload.event,
      payload,
    },
    update: {},
  });

  try {
    if (payload.event === "payment.captured") {
      const entity = payload.payload?.payment?.entity;
      if (entity) {
        const payment = await prisma.payment.findFirst({
          where: { razorpayOrderId: entity.order_id },
        });
        if (payment && payment.status !== "CAPTURED") {
          await confirmRazorpayPayment({
            orderId: payment.orderId,
            razorpayOrderId: entity.order_id,
            razorpayPaymentId: entity.id,
            signature: signature || "webhook",
          });
          await processPaidOrder(payment.orderId);
          await finalizeOrderCosts(payment.orderId);
        }
      }
    }

    await prisma.webhookEvent.update({
      where: { id: webhook.id },
      data: { processed: true, processedAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    await prisma.webhookEvent.update({
      where: { id: webhook.id },
      data: { error: e instanceof Error ? e.message : "ERROR" },
    });
    return NextResponse.json({ error: "PROCESSING_FAILED" }, { status: 500 });
  }
}

import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { verifyRazorpayWebhookSignature } from "@/lib/payments/razorpay";
import { triggerWorkflow } from "@/lib/workflows/engine";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (secret) {
      const ok = verifyRazorpayWebhookSignature(rawBody, signature);
      if (!ok) return jsonError("Invalid webhook signature", 400);
    }

    const event = JSON.parse(rawBody) as {
      event?: string;
      payload?: {
        payment?: {
          entity?: {
            id?: string;
            order_id?: string;
            status?: string;
            amount?: number;
          };
        };
        order?: { entity?: { id?: string } };
      };
    };

    const paymentEntity = event.payload?.payment?.entity;
    const orderId = paymentEntity?.order_id || event.payload?.order?.entity?.id;

    if (
      orderId &&
      (event.event === "payment.captured" ||
        event.event === "order.paid" ||
        paymentEntity?.status === "captured")
    ) {
      const payment = await prisma.payment.findFirst({
        where: { razorpayOrderId: orderId },
      });
      if (payment && payment.status !== "PAID") {
        const updated = await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            razorpayPaymentId: paymentEntity?.id || payment.razorpayPaymentId,
          },
        });
        await triggerWorkflow({
          event: "payment.paid",
          organizationId: updated.organizationId,
          entityType: "payment",
          entityId: updated.id,
          payload: { via: "webhook", razorpayEvent: event.event },
        });
        return jsonOk({ processed: true, paymentId: updated.id, status: updated.status });
      }
      return jsonOk({ processed: false, reason: payment ? "already_paid" : "payment_not_found" });
    }

    return jsonOk({
      processed: false,
      reason: "ignored_event",
      event: event.event || null,
      webhookSecretConfigured: Boolean(secret),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

import { z } from "zod";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { markPaymentPaid } from "@/lib/payments/razorpay";
import { prisma } from "@/lib/db";
import { triggerWorkflow } from "@/lib/workflows/engine";

const schema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const payment = await markPaymentPaid({
      orderId: body.razorpay_order_id,
      razorpayPaymentId: body.razorpay_payment_id,
      razorpaySignature: body.razorpay_signature,
    });

    await triggerWorkflow({
      event: "payment.paid",
      organizationId: payment.organizationId,
      entityType: "payment",
      entityId: payment.id,
      payload: { purpose: payment.purpose, amountInr: payment.amountInr },
    });

    // Auto-unlock assessment when strategy_call payment references one
    const meta =
      payment.metadata && typeof payment.metadata === "object"
        ? (payment.metadata as Record<string, unknown>)
        : {};
    if (typeof meta.assessmentId === "string" && meta.assessmentId) {
      await prisma.assessment.update({
        where: { id: meta.assessmentId },
        data: { unlocked: true },
      }).catch(() => null);
    }

    return jsonOk({
      paymentId: payment.id,
      status: payment.status,
      purpose: payment.purpose,
      amountInr: payment.amountInr,
    });
  } catch (err) {
    if (err instanceof Error && /signature|not found/i.test(err.message)) {
      return jsonError(err.message, 400);
    }
    return handleApiError(err);
  }
}

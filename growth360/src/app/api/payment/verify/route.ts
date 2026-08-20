import { z } from "zod";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { verifyRazorpaySignature } from "@/lib/razorpay";

const bodySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  paymentId: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = bodySchema.parse(await req.json());
    const valid = verifyRazorpaySignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });
    if (!valid) return jsonError("Payment verification failed", 400);

    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { razorpayOrderId: body.razorpay_order_id },
          ...(body.paymentId ? [{ id: body.paymentId }] : []),
        ],
      },
    });
    if (!payment) return jsonError("Payment not found", 404);

    const updated = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "paid",
        razorpayPaymentId: body.razorpay_payment_id,
        razorpaySignature: body.razorpay_signature,
      },
    });

    if (payment.assessmentId) {
      await prisma.assessment.update({
        where: { id: payment.assessmentId },
        data: { unlocked: true },
      });
    }

    return jsonOk({
      paymentId: updated.id,
      status: updated.status,
      assessmentId: updated.assessmentId,
      bookingReady: true,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

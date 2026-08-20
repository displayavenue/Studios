import { z } from "zod";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { verifyAndCaptureQuotationPayment } from "@/lib/quotations/payments";

const schema = z.object({
  orderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

/** Public verify endpoint used after Razorpay checkout on the quotation page. */
export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const result = await verifyAndCaptureQuotationPayment({
      orderId: body.orderId,
      razorpayPaymentId: body.razorpayPaymentId,
      razorpaySignature: body.razorpaySignature,
    });

    return jsonOk({
      alreadyProcessed: result.alreadyProcessed,
      paymentId: result.payment.id,
      status: result.payment.status,
      quotationId: result.payment.quotationId,
      quotationStatus: "quotation" in result ? result.quotation.status : undefined,
      invoiceNumber: "invoice" in result ? result.invoice.invoiceNumber : undefined,
      receiptNumber: "receipt" in result ? result.receipt.receiptNumber : undefined,
    });
  } catch (err) {
    if (err instanceof Error && /signature|not found|mismatch|amount/i.test(err.message)) {
      return jsonError(err.message, 400);
    }
    return handleApiError(err);
  }
}

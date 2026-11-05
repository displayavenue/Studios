import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { verifyRazorpayWebhookSignature } from "@/lib/payments/razorpay";
import { triggerWorkflow } from "@/lib/workflows/engine";
import { getCompanyProfile, nextInvoiceNumber, nextReceiptNumber } from "@/lib/quotations/numbering";

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
      id?: string;
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

    const eventId =
      event.id ||
      `${event.event || "evt"}:${event.payload?.payment?.entity?.id || event.payload?.order?.entity?.id || Date.now()}`;

    const existing = await prisma.razorpayWebhookEvent.findUnique({ where: { eventId } });
    if (existing?.processedAt) {
      return jsonOk({ processed: false, reason: "already_processed", eventId });
    }
    await prisma.razorpayWebhookEvent.upsert({
      where: { eventId },
      create: {
        eventId,
        eventType: event.event || "unknown",
        payload: event as object,
      },
      update: {},
    });

    const paymentEntity = event.payload?.payment?.entity;
    const orderId = paymentEntity?.order_id || event.payload?.order?.entity?.id;

    if (
      orderId &&
      (event.event === "payment.captured" ||
        event.event === "order.paid" ||
        paymentEntity?.status === "captured")
    ) {
      // Quotation platform payments
      const quotePayment = await prisma.quotePayment.findFirst({
        where: { razorpayOrderId: orderId },
      });
      if (quotePayment) {
        if (quotePayment.status !== "PAID" && paymentEntity?.id && secret) {
          const quotation = await prisma.quotation.findUniqueOrThrow({
            where: { id: quotePayment.quotationId },
          });
          const newPaid = quotation.paidPaise + quotePayment.amountPaise;
          const fullyPaid = newPaid >= quotation.grandTotalPaise;
          const company = await getCompanyProfile();
          const receiptNumber = await nextReceiptNumber(company.receiptPrefix);
          const invoiceNumber = await nextInvoiceNumber(company.invoicePrefix);

          await prisma.$transaction(async (tx) => {
            await tx.quotePayment.update({
              where: { id: quotePayment.id },
              data: {
                status: "PAID",
                razorpayPaymentId: paymentEntity.id,
                paidAt: new Date(),
                method: "razorpay",
              },
            });
            await tx.quotation.update({
              where: { id: quotation.id },
              data: {
                paidPaise: newPaid,
                status: fullyPaid ? "PAID" : "PARTIALLY_PAID",
                paymentStatus: fullyPaid ? "PAID" : "PARTIALLY_PAID",
                isImmutable: true,
                acceptedAt: quotation.acceptedAt || new Date(),
              },
            });
            const invoice = await tx.quoteInvoice.create({
              data: {
                quotationId: quotation.id,
                clientId: quotePayment.clientId,
                organizationId: quotePayment.organizationId,
                invoiceNumber,
                status: fullyPaid ? "PAID" : "PARTIALLY_PAID",
                amountPaise: quotation.grandTotalPaise,
                gstPaise: quotation.totalGstPaise,
                taxablePaise: quotation.taxablePaise,
                issuedAt: new Date(),
                paidAt: fullyPaid ? new Date() : null,
              },
            });
            await tx.quoteReceipt.create({
              data: {
                receiptNumber,
                quotationId: quotation.id,
                paymentId: quotePayment.id,
                invoiceId: invoice.id,
                clientId: quotePayment.clientId,
                organizationId: quotePayment.organizationId,
                amountPaise: quotePayment.amountPaise,
                gstPaise: quotePayment.gstPaise,
                balancePaise: Math.max(0, quotation.grandTotalPaise - newPaid),
                paidAt: new Date(),
                method: "razorpay",
                transactionId: paymentEntity.id,
              },
            });
            await tx.quotationEvent.create({
              data: {
                quotationId: quotation.id,
                type: "payment.successful",
                message: `Webhook: payment captured for order ${orderId}`,
                meta: { eventId, receiptNumber, invoiceNumber },
              },
            });
          });
        }
        await prisma.razorpayWebhookEvent.update({
          where: { eventId },
          data: { processedAt: new Date() },
        });
        return jsonOk({ processed: true, type: "quote_payment", orderId, eventId });
      }

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
        await prisma.razorpayWebhookEvent.update({
          where: { eventId },
          data: { processedAt: new Date() },
        });
        return jsonOk({
          processed: true,
          paymentId: updated.id,
          status: updated.status,
          eventId,
        });
      }
      await prisma.razorpayWebhookEvent.update({
        where: { eventId },
        data: { processedAt: new Date() },
      });
      return jsonOk({
        processed: false,
        reason: payment ? "already_paid" : "payment_not_found",
        eventId,
      });
    }

    await prisma.razorpayWebhookEvent.update({
      where: { eventId },
      data: { processedAt: new Date() },
    });
    return jsonOk({
      processed: false,
      reason: "ignored_event",
      event: event.event || null,
      webhookSecretConfigured: Boolean(secret),
      eventId,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

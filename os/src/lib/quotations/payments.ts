import crypto from "crypto";
import { prisma } from "../db";
import { getRazorpay, verifyRazorpaySignature } from "../payments/razorpay";
import { getCompanyProfile, nextInvoiceNumber, nextReceiptNumber } from "./numbering";
import { paiseToInr } from "./money";

export async function createQuotationPaymentOrder(params: {
  quotationId: string;
  purpose?: "advance" | "balance" | "full" | "milestone";
  milestoneId?: string;
}) {
  const quotation = await prisma.quotation.findUniqueOrThrow({
    where: { id: params.quotationId },
    include: { client: true, items: true },
  });

  if (["CANCELLED", "REJECTED", "EXPIRED"].includes(quotation.status)) {
    throw new Error("This quotation cannot accept payments");
  }
  if (quotation.validUntil < new Date() && quotation.status !== "ACCEPTED" && quotation.status !== "PARTIALLY_PAID") {
    throw new Error("This quotation has expired");
  }

  const purpose = params.purpose || "advance";
  let amountPaise = 0;
  if (purpose === "advance") {
    amountPaise = Math.max(0, quotation.advancePaise - quotation.paidPaise);
    if (amountPaise <= 0) throw new Error("Advance already paid");
  } else if (purpose === "balance" || purpose === "full") {
    amountPaise = Math.max(0, quotation.grandTotalPaise - quotation.paidPaise);
    if (amountPaise <= 0) throw new Error("Quotation already fully paid");
  } else if (purpose === "milestone" && params.milestoneId) {
    const milestone = await prisma.quoteMilestone.findFirstOrThrow({
      where: { id: params.milestoneId, quotationId: quotation.id },
    });
    if (milestone.status === "paid") throw new Error("Milestone already paid");
    amountPaise = milestone.amountPaise;
  } else {
    throw new Error("Invalid payment purpose");
  }

  // Never trust frontend amounts — always recompute from DB
  const amountInr = paiseToInr(amountPaise);
  const amountPaiseInt = Math.round(amountInr * 100);
  const gstShare = quotation.grandTotalPaise
    ? Math.round((amountPaiseInt * quotation.totalGstPaise) / quotation.grandTotalPaise)
    : 0;

  const payment = await prisma.quotePayment.create({
    data: {
      quotationId: quotation.id,
      clientId: quotation.clientId,
      organizationId: quotation.organizationId,
      amountPaise: amountPaiseInt,
      gstPaise: gstShare,
      purpose,
      milestoneId: params.milestoneId,
      status: "CREATED",
      metadata: {
        quotationNumber: quotation.quotationNumber,
        expectedAmountPaise: amountPaiseInt,
      },
    },
  });

  const razorpay = getRazorpay();
  if (!razorpay) {
    const mockOrderId = `order_mock_${payment.id.slice(0, 12)}`;
    await prisma.quotePayment.update({
      where: { id: payment.id },
      data: { razorpayOrderId: mockOrderId, status: "INITIATED" },
    });
    await prisma.quotation.update({
      where: { id: quotation.id },
      data: { paymentStatus: "INITIATED" },
    });
    return {
      paymentId: payment.id,
      orderId: mockOrderId,
      amountInr,
      amountPaise: amountPaiseInt,
      currency: "INR",
      keyId:
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        process.env.RAZORPAY_KEY_ID ||
        "rzp_test_mock",
      mock: true,
      quotationNumber: quotation.quotationNumber,
      clientName: quotation.client.companyName,
      clientEmail: quotation.client.email,
      clientPhone: quotation.client.mobile,
    };
  }

  const order = await razorpay.orders.create({
    amount: amountPaiseInt,
    currency: "INR",
    receipt: payment.id.slice(0, 40),
    notes: {
      quotationId: quotation.id,
      paymentId: payment.id,
      purpose,
      quotationNumber: quotation.quotationNumber,
    },
  });

  await prisma.quotePayment.update({
    where: { id: payment.id },
    data: { razorpayOrderId: order.id, status: "INITIATED" },
  });
  await prisma.quotation.update({
    where: { id: quotation.id },
    data: { paymentStatus: "INITIATED" },
  });

  return {
    paymentId: payment.id,
    orderId: order.id,
    amountInr,
    amountPaise: amountPaiseInt,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID!,
    mock: false,
    quotationNumber: quotation.quotationNumber,
    clientName: quotation.client.companyName,
    clientEmail: quotation.client.email,
    clientPhone: quotation.client.mobile,
  };
}

export async function verifyAndCaptureQuotationPayment(params: {
  orderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const payment = await prisma.quotePayment.findFirst({
    where: { razorpayOrderId: params.orderId },
    include: { quotation: true, client: true },
  });
  if (!payment) throw new Error("Payment not found");
  if (payment.status === "PAID") {
    // Idempotent
    return { payment, alreadyProcessed: true };
  }

  const ok = verifyRazorpaySignature({
    orderId: params.orderId,
    paymentId: params.razorpayPaymentId,
    signature: params.razorpaySignature,
  });
  if (!ok) throw new Error("Invalid Razorpay signature");

  // Amount integrity: Razorpay order amount was created server-side; ensure metadata matches
  const expected = Number(
    (payment.metadata as { expectedAmountPaise?: number } | null)?.expectedAmountPaise ??
      payment.amountPaise,
  );
  if (expected !== payment.amountPaise) {
    throw new Error("Payment amount mismatch");
  }

  const company = await getCompanyProfile();
  const receiptNumber = await nextReceiptNumber(company.receiptPrefix);
  const invoiceNumber = await nextInvoiceNumber(company.invoicePrefix);

  const result = await prisma.$transaction(async (tx) => {
    const paidPayment = await tx.quotePayment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        razorpayPaymentId: params.razorpayPaymentId,
        razorpaySignature: params.razorpaySignature,
        paidAt: new Date(),
        method: "razorpay",
      },
    });

    const quotation = await tx.quotation.findUniqueOrThrow({
      where: { id: payment.quotationId },
    });
    const newPaid = quotation.paidPaise + payment.amountPaise;
    const fullyPaid = newPaid >= quotation.grandTotalPaise;
    const status = fullyPaid ? "PAID" : "PARTIALLY_PAID";
    const paymentStatus = fullyPaid ? "PAID" : "PARTIALLY_PAID";

    const updatedQuote = await tx.quotation.update({
      where: { id: quotation.id },
      data: {
        paidPaise: newPaid,
        status,
        paymentStatus,
        isImmutable: true,
        acceptedAt: quotation.acceptedAt || new Date(),
      },
    });

    const invoice = await tx.quoteInvoice.create({
      data: {
        quotationId: quotation.id,
        clientId: payment.clientId,
        organizationId: payment.organizationId,
        invoiceNumber,
        status: fullyPaid ? "PAID" : "PARTIALLY_PAID",
        amountPaise: quotation.grandTotalPaise,
        gstPaise: quotation.totalGstPaise,
        taxablePaise: quotation.taxablePaise,
        issuedAt: new Date(),
        paidAt: fullyPaid ? new Date() : null,
        lineItems: { purpose: payment.purpose, paidPaise: payment.amountPaise },
      },
    });

    const receipt = await tx.quoteReceipt.create({
      data: {
        receiptNumber,
        quotationId: quotation.id,
        paymentId: payment.id,
        invoiceId: invoice.id,
        clientId: payment.clientId,
        organizationId: payment.organizationId,
        amountPaise: payment.amountPaise,
        gstPaise: payment.gstPaise,
        balancePaise: Math.max(0, quotation.grandTotalPaise - newPaid),
        paidAt: new Date(),
        method: "razorpay",
        transactionId: params.razorpayPaymentId,
      },
    });

    await tx.quotationEvent.create({
      data: {
        quotationId: quotation.id,
        type: "payment.successful",
        message: `Payment of ₹${(payment.amountPaise / 100).toFixed(2)} received`,
        meta: {
          paymentId: payment.id,
          razorpayPaymentId: params.razorpayPaymentId,
          receiptNumber,
          invoiceNumber,
        },
      },
    });

    return { payment: paidPayment, quotation: updatedQuote, invoice, receipt };
  });

  return { ...result, alreadyProcessed: false };
}

export function publicQuotationPath(quotationNumber: string, token: string) {
  return `/q/${encodeURIComponent(quotationNumber)}/${token}`;
}

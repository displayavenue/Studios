import crypto from "crypto";
import Razorpay from "razorpay";
import { prisma } from "../db";

export function getBookingFeeInr() {
  return Number(process.env.BOOKING_FEE_INR || 99);
}

/** Uses RAZORPAY_KEY_SECRET (OS env name). */
export function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
}

export async function createStrategyCallOrder(params: {
  organizationId: string;
  assessmentId?: string;
  name: string;
  email: string;
  whatsapp: string;
}) {
  const amountInr = getBookingFeeInr();
  const amountPaise = amountInr * 100;
  const razorpay = getRazorpay();

  const payment = await prisma.payment.create({
    data: {
      organizationId: params.organizationId,
      amountInr,
      purpose: "strategy_call",
      status: "CREATED",
      metadata: {
        name: params.name,
        email: params.email,
        whatsapp: params.whatsapp,
        assessmentId: params.assessmentId || null,
      },
    },
  });

  if (!razorpay) {
    const mockOrderId = `order_mock_${payment.id.slice(0, 12)}`;
    await prisma.payment.update({
      where: { id: payment.id },
      data: { razorpayOrderId: mockOrderId, status: "CREATED" },
    });
    return {
      paymentId: payment.id,
      orderId: mockOrderId,
      amountInr,
      amountPaise,
      currency: "INR",
      keyId:
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        process.env.RAZORPAY_KEY_ID ||
        "rzp_test_mock",
      mock: true,
    };
  }

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: payment.id.slice(0, 40),
    notes: {
      organizationId: params.organizationId,
      assessmentId: params.assessmentId || "",
      paymentId: payment.id,
      purpose: "strategy_call",
    },
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { razorpayOrderId: order.id },
  });

  return {
    paymentId: payment.id,
    orderId: order.id,
    amountInr,
    amountPaise,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID!,
    mock: false,
  };
}

export function verifyRazorpaySignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return params.orderId.startsWith("order_mock_");
  }
  const body = `${params.orderId}|${params.paymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === params.signature;
}

export async function markPaymentPaid(params: {
  orderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const payment = await prisma.payment.findFirst({
    where: { razorpayOrderId: params.orderId },
  });
  if (!payment) throw new Error("Payment not found");

  const ok = verifyRazorpaySignature({
    orderId: params.orderId,
    paymentId: params.razorpayPaymentId,
    signature: params.razorpaySignature,
  });
  if (!ok) throw new Error("Invalid Razorpay signature");

  return prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: "PAID",
      razorpayPaymentId: params.razorpayPaymentId,
      razorpaySignature: params.razorpaySignature,
    },
  });
}

export async function createProposalOrder(params: {
  organizationId: string;
  proposalId: string;
  amountInr: number;
  metadata?: Record<string, unknown>;
}) {
  const amountInr = Math.round(params.amountInr);
  if (amountInr <= 0) throw new Error("Proposal amount must be > 0");
  const amountPaise = amountInr * 100;
  const razorpay = getRazorpay();

  const payment = await prisma.payment.create({
    data: {
      organizationId: params.organizationId,
      amountInr,
      purpose: "proposal",
      status: "CREATED",
      metadata: {
        proposalId: params.proposalId,
        ...(params.metadata || {}),
      },
    },
  });

  if (!razorpay) {
    const mockOrderId = `order_mock_${payment.id.slice(0, 12)}`;
    await prisma.payment.update({
      where: { id: payment.id },
      data: { razorpayOrderId: mockOrderId, status: "CREATED" },
    });
    return {
      paymentId: payment.id,
      orderId: mockOrderId,
      amountInr,
      amountPaise,
      currency: "INR",
      keyId:
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        process.env.RAZORPAY_KEY_ID ||
        "rzp_test_mock",
      mock: true,
    };
  }

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt: payment.id.slice(0, 40),
    notes: {
      organizationId: params.organizationId,
      proposalId: params.proposalId,
      paymentId: payment.id,
      purpose: "proposal",
    },
  });

  await prisma.payment.update({
    where: { id: payment.id },
    data: { razorpayOrderId: order.id },
  });

  return {
    paymentId: payment.id,
    orderId: order.id,
    amountInr,
    amountPaise,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID!,
    mock: false,
  };
}

export function verifyRazorpayWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return null; // caller decides policy when unset
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return expected === signature;
}

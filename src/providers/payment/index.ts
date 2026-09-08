import crypto from "crypto";
import { useMockProviders } from "@/config/site";

export type PaymentOrderResult = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  keyId: string;
  mock: boolean;
};

function razorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function getRazorpayKeyId(): string {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "";
}

/**
 * Create Razorpay order server-side.
 * Uses clearly labeled mock when credentials are missing or mocks are forced.
 */
export async function createPaymentOrder(input: {
  amountPaise: number;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<PaymentOrderResult> {
  const keyId = getRazorpayKeyId() || "rzp_test_mock";

  if (!razorpayConfigured() || useMockProviders()) {
    return {
      id: `order_mock_${Date.now()}`,
      amount: input.amountPaise,
      currency: "INR",
      receipt: input.receipt,
      keyId,
      mock: true,
    };
  }

  const auth = Buffer.from(
    `${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`,
  ).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: input.amountPaise,
      currency: "INR",
      receipt: input.receipt.slice(0, 40),
      notes: input.notes,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Razorpay order failed: ${text}`);
  }

  const data = (await res.json()) as {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
  };

  return { ...data, keyId, mock: false };
}

export async function verifyPaymentSignature(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  signature: string;
}): Promise<boolean> {
  if (!razorpayConfigured() || useMockProviders()) {
    if (input.signature.startsWith("mock_")) return true;
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;

  const body = `${input.razorpayOrderId}|${input.razorpayPaymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return expected === input.signature;
}

export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    if (useMockProviders()) return true;
    return false;
  }
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return expected === signature;
}

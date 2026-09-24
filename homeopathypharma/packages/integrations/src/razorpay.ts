/**
 * Razorpay integration — SERVER-SIDE ONLY.
 *
 * **Security rules:**
 * - Order amounts are computed server-side from catalog snapshots — NEVER trust frontend totals.
 * - Payment success is confirmed only after signature verification or signed webhook events.
 * - Webhook handlers MUST call `assertWebhookSignatureOrThrow` before mutating payment state.
 *
 * Payment state machine (aligned with Prisma `PaymentStatus`):
 * ```
 * CREATED → PENDING → AUTHORIZED → CAPTURED
 *                  ↘ FAILED
 * CAPTURED → REFUNDED | PARTIALLY_REFUNDED
 * ```
 *
 * See `@homeopathypharma/integrations/state-machines` for transition guards.
 *
 * TODO: Implement with razorpay npm package in @homeopathypharma/api.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

export interface RazorpayCreateOrderInput {
  /** Amount in paise — must come from server checkout total, not client input. */
  amountPaise: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayRefundInput {
  paymentId: string;
  amountPaise?: number;
  notes?: Record<string, string>;
}

export interface RazorpayRefund {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
}

export interface RazorpayClient {
  createOrder(input: RazorpayCreateOrderInput): Promise<RazorpayOrder>;
  verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean;
  verifyWebhookSignature(body: string, signature: string, secret: string): boolean;
  refund(input: RazorpayRefundInput): Promise<RazorpayRefund>;
}

export class RazorpayNotConfiguredError extends Error {
  constructor() {
    super("Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
    this.name = "RazorpayNotConfiguredError";
  }
}

export class RazorpayWebhookSignatureError extends Error {
  readonly code = "INVALID_RAZORPAY_WEBHOOK_SIGNATURE" as const;

  constructor(message = "Razorpay webhook signature verification failed") {
    super(message);
    this.name = "RazorpayWebhookSignatureError";
  }
}

/**
 * Compute Razorpay webhook HMAC-SHA256 (hex digest).
 * Razorpay sends the digest in the `X-Razorpay-Signature` header.
 */
export function computeRazorpayWebhookSignature(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

/**
 * Validate Razorpay webhook signature — throws on failure.
 * Call this before any payment state transition driven by webhook payloads.
 */
export function assertWebhookSignatureOrThrow(
  body: string,
  signature: string | undefined | null,
  secret: string,
): void {
  if (!secret) {
    throw new RazorpayNotConfiguredError();
  }
  if (!signature?.trim()) {
    throw new RazorpayWebhookSignatureError("Missing X-Razorpay-Signature header");
  }

  const expected = computeRazorpayWebhookSignature(body, secret);
  const valid =
    expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(signature, "utf8"));

  if (!valid) {
    throw new RazorpayWebhookSignatureError();
  }
}

/** Stub — throws until credentials are wired in the API service. */
export const stubRazorpayClient: RazorpayClient = {
  async createOrder() {
    throw new RazorpayNotConfiguredError();
  },
  verifyPaymentSignature() {
    throw new RazorpayNotConfiguredError();
  },
  verifyWebhookSignature(body, signature, secret) {
    try {
      assertWebhookSignatureOrThrow(body, signature, secret);
      return true;
    } catch {
      return false;
    }
  },
  async refund() {
    throw new RazorpayNotConfiguredError();
  },
};

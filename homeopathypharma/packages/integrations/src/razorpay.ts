/**
 * Razorpay integration — SERVER-SIDE ONLY.
 * TODO: Implement with razorpay npm package in @homeopathypharma/api.
 */

export interface RazorpayCreateOrderInput {
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

/** Stub — throws until credentials are wired in the API service. */
export const stubRazorpayClient: RazorpayClient = {
  async createOrder() {
    throw new RazorpayNotConfiguredError();
  },
  verifyPaymentSignature() {
    throw new RazorpayNotConfiguredError();
  },
  verifyWebhookSignature() {
    throw new RazorpayNotConfiguredError();
  },
  async refund() {
    throw new RazorpayNotConfiguredError();
  },
};

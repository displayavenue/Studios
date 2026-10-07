import { z } from "zod";

const addressSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^\+[1-9]\d{6,14}$/),
  line1: z.string().trim().min(3).max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  postalCode: z.string().trim().min(3).max(20),
  countryCode: z.string().length(2).toUpperCase(),
});

export type CheckoutAddress = z.infer<typeof addressSchema>;

export const checkoutCreateSchema = z.object({
  cartToken: z.string().uuid().optional(),
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  billingSameAsShipping: z.boolean().default(true),
  paymentMethod: z.enum(["razorpay", "cod"]).default("razorpay"),
  couponCode: z.string().trim().max(64).optional(),
  /** ISO 4217 — must match server-side cart currency. */
  currency: z.string().length(3).toUpperCase().optional(),
  customerNote: z.string().trim().max(500).optional(),
  /** Required when cart contains Rx-only products. */
  prescriptionUploadId: z.string().uuid().optional(),
});

export type CheckoutCreateInput = z.infer<typeof checkoutCreateSchema>;

export const checkoutConfirmPaymentSchema = z.object({
  orderId: z.string().uuid(),
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

export type CheckoutConfirmPaymentInput = z.infer<typeof checkoutConfirmPaymentSchema>;

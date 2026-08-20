import { z } from "zod";

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.coerce.number().int().min(1).max(99),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;

export const cartAddSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(20),
  /** Guest cart token when unauthenticated. */
  cartToken: z.string().uuid().optional(),
});

export type CartAddInput = z.infer<typeof cartAddSchema>;

export const cartUpdateItemSchema = z.object({
  lineId: z.string().uuid(),
  quantity: z.coerce.number().int().min(0).max(99),
});

export type CartUpdateItemInput = z.infer<typeof cartUpdateItemSchema>;

export const cartUpdateSchema = z.object({
  items: z.array(cartUpdateItemSchema).min(1).max(20),
  cartToken: z.string().uuid().optional(),
});

export type CartUpdateInput = z.infer<typeof cartUpdateSchema>;

export const cartRemoveSchema = z.object({
  lineIds: z.array(z.string().uuid()).min(1).max(20),
  cartToken: z.string().uuid().optional(),
});

export type CartRemoveInput = z.infer<typeof cartRemoveSchema>;

export const cartMergeSchema = z.object({
  guestCartToken: z.string().uuid(),
});

export type CartMergeInput = z.infer<typeof cartMergeSchema>;

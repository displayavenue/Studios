import { z } from "zod";

export const couponApplySchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(64)
    .transform((v) => v.toUpperCase()),
  cartToken: z.string().uuid().optional(),
});

export type CouponApplyInput = z.infer<typeof couponApplySchema>;

export const couponRemoveSchema = z.object({
  cartToken: z.string().uuid().optional(),
});

export type CouponRemoveInput = z.infer<typeof couponRemoveSchema>;

export const couponCreateSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(64)
    .transform((v) => v.toUpperCase()),
  type: z.enum(["percentage", "fixed", "free_shipping"]),
  value: z.coerce.number().positive(),
  minOrderAmount: z.coerce.number().nonnegative().optional(),
  maxDiscountAmount: z.coerce.number().positive().optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  perUserLimit: z.coerce.number().int().positive().default(1),
  startsAt: z.string().datetime({ offset: true }),
  expiresAt: z.string().datetime({ offset: true }),
  applicableCategorySlugs: z.array(z.string().trim().max(120)).optional(),
  applicableProductIds: z.array(z.string().uuid()).optional(),
});

export type CouponCreateInput = z.infer<typeof couponCreateSchema>;

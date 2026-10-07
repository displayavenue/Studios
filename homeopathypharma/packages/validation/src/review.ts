import { z } from "zod";

export const reviewCreateSchema = z.object({
  productId: z.string().uuid(),
  /** Must match a verified purchase — enforced server-side. */
  orderId: z.string().uuid(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(120),
  body: z.string().trim().min(20).max(5000),
  /** Optional structured pros/cons for moderation UI. */
  pros: z.array(z.string().trim().max(200)).max(5).optional(),
  cons: z.array(z.string().trim().max(200)).max(5).optional(),
  /** Anonymous display name override — subject to moderation. */
  displayName: z.string().trim().min(2).max(60).optional(),
});

export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;

export const reviewModerationSchema = z.object({
  reviewId: z.string().uuid(),
  action: z.enum(["approve", "reject", "flag"]),
  moderationNote: z.string().trim().max(1000).optional(),
});

export type ReviewModerationInput = z.infer<typeof reviewModerationSchema>;

export const reviewListQuerySchema = z.object({
  productId: z.string().uuid(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.enum(["newest", "oldest", "rating_high", "rating_low", "helpful"]).default("newest"),
  rating: z.coerce.number().int().min(1).max(5).optional(),
});

export type ReviewListQuery = z.infer<typeof reviewListQuerySchema>;

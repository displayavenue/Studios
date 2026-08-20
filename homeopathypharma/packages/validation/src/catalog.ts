import { z } from "zod";
import { paginationQuerySchema, sortQuerySchema } from "./pagination.js";

export const productSortFields = [
  "relevance",
  "price_asc",
  "price_desc",
  "name_asc",
  "name_desc",
  "newest",
  "rating",
] as const;

export const productFilterQuerySchema = paginationQuerySchema
  .merge(sortQuerySchema(productSortFields))
  .extend({
    q: z.string().trim().max(200).optional(),
    categorySlug: z.string().trim().max(120).optional(),
    conditionSlug: z.string().trim().max(120).optional(),
    bodySystemSlug: z.string().trim().max(120).optional(),
    organSlug: z.string().trim().max(120).optional(),
    brandSlug: z.string().trim().max(120).optional(),
    potency: z.string().trim().max(32).optional(),
    form: z.enum(["dilution", "tablet", "globule", "ointment", "drop", "spray", "kit"]).optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    inStock: z.coerce.boolean().optional(),
    prescriptionRequired: z.coerce.boolean().optional(),
    petSafe: z.coerce.boolean().optional(),
    tags: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .transform((v) => (typeof v === "string" ? v.split(",").map((t) => t.trim()).filter(Boolean) : v)),
  })
  .refine(
    (data) =>
      data.minPrice === undefined ||
      data.maxPrice === undefined ||
      data.minPrice <= data.maxPrice,
    { message: "minPrice must be less than or equal to maxPrice", path: ["minPrice"] },
  );

export type ProductFilterQuery = z.infer<typeof productFilterQuerySchema>;

export const categoryListQuerySchema = paginationQuerySchema.extend({
  parentSlug: z.string().trim().max(120).optional(),
  includeEmpty: z.coerce.boolean().default(false),
});

export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;

export const productSlugParamSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
});

export type ProductSlugParam = z.infer<typeof productSlugParamSchema>;

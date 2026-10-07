import { z } from "zod";

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export function sortQuerySchema<T extends readonly [string, ...string[]]>(allowed: T) {
  return z.object({
    sort: z.enum(allowed).optional(),
    sortDir: z.enum(["asc", "desc"]).optional(),
  });
}

export const cursorPaginationSchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CursorPaginationQuery = z.infer<typeof cursorPaginationSchema>;

export const searchQuerySchema = paginationQuerySchema.extend({
  q: z.string().trim().min(1).max(200),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

export const dateRangeQuerySchema = z
  .object({
    from: z.string().datetime({ offset: true }).optional(),
    to: z.string().datetime({ offset: true }).optional(),
  })
  .refine(
    (data) => !data.from || !data.to || new Date(data.from) <= new Date(data.to),
    { message: "from must be before to", path: ["from"] },
  );

export type DateRangeQuery = z.infer<typeof dateRangeQuerySchema>;

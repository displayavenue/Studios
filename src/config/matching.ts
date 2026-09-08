/** Product slugs that need two birth charts (Ashtakoota / synastry). */
export const MATCHING_PRODUCT_SLUGS = new Set([
  "guna-milan",
  "love-compatibility",
  "couple-kundali",
  "marriage-timing",
]);

export function productNeedsPartner(slug: string): boolean {
  return MATCHING_PRODUCT_SLUGS.has(slug);
}

import { PRODUCTS } from "./products";
import { getCatalogCategory, getCatalogTopic } from "./taxonomy";

export function productsForCategory(categorySlug: string) {
  const category = getCatalogCategory(categorySlug);
  return PRODUCTS.filter(
    (p) => p.healthAreas.includes(categorySlug) || (category ? p.category === category.name : false),
  );
}

export function productsForTopic(topicSlug: string) {
  const match = getCatalogTopic(topicSlug);
  if (!match) return PRODUCTS.filter((p) => p.healthAreas.includes(topicSlug));
  const remedyKey = `${match.category.slug}-${topicSlug}`;
  return PRODUCTS.filter(
    (p) => p.healthAreas.includes(topicSlug) || p.remedySlug === remedyKey || p.slug.includes(`-${topicSlug}-`),
  );
}

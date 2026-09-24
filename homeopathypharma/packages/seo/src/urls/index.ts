/** Base path segments for storefront routes. */
export const ROUTE_PREFIXES = {
  products: "/products",
  categories: "/categories",
  conditions: "/conditions",
  bodySystems: "/body-systems",
  organs: "/organs",
  doctors: "/doctors",
  pets: "/pets",
  articles: "/articles",
} as const;

export interface UrlBuilderOptions {
  baseUrl: string;
  locale?: string;
}

function normalizeBase(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

function slugPath(prefix: string, slug: string): string {
  const clean = slug.trim().toLowerCase();
  return `${prefix}/${encodeURIComponent(clean)}`;
}

export function productUrl(opts: UrlBuilderOptions, slug: string): string {
  return `${normalizeBase(opts.baseUrl)}${slugPath(ROUTE_PREFIXES.products, slug)}`;
}

export function categoryUrl(opts: UrlBuilderOptions, slug: string): string {
  return `${normalizeBase(opts.baseUrl)}${slugPath(ROUTE_PREFIXES.categories, slug)}`;
}

export function conditionUrl(opts: UrlBuilderOptions, slug: string): string {
  return `${normalizeBase(opts.baseUrl)}${slugPath(ROUTE_PREFIXES.conditions, slug)}`;
}

export function bodySystemUrl(opts: UrlBuilderOptions, slug: string): string {
  return `${normalizeBase(opts.baseUrl)}${slugPath(ROUTE_PREFIXES.bodySystems, slug)}`;
}

export function organUrl(opts: UrlBuilderOptions, slug: string): string {
  return `${normalizeBase(opts.baseUrl)}${slugPath(ROUTE_PREFIXES.organs, slug)}`;
}

export function doctorUrl(opts: UrlBuilderOptions, slug: string): string {
  return `${normalizeBase(opts.baseUrl)}${slugPath(ROUTE_PREFIXES.doctors, slug)}`;
}

export function petUrl(opts: UrlBuilderOptions, slug: string): string {
  return `${normalizeBase(opts.baseUrl)}${slugPath(ROUTE_PREFIXES.pets, slug)}`;
}

export function articleUrl(opts: UrlBuilderOptions, slug: string): string {
  return `${normalizeBase(opts.baseUrl)}${slugPath(ROUTE_PREFIXES.articles, slug)}`;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbUrls(
  opts: UrlBuilderOptions,
  items: BreadcrumbItem[],
): { name: string; url: string }[] {
  const base = normalizeBase(opts.baseUrl);
  return items.map((item) => ({
    name: item.name,
    url: `${base}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
  }));
}

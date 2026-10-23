import type { MetadataRoute } from "next";
import { brands } from "@/lib/content/brands";
import { DOCTORS } from "@/lib/content/doctors";
import { PRODUCTS } from "@/lib/content/products";
import { remedies } from "@/lib/content/remedies";
import { CATALOG_TAXONOMY, listCatalogTopicSlugs } from "@/lib/content/taxonomy";
import { BUNDLE_SLUGS, HEALTH_AREA_SLUGS } from "@/lib/static-params";

export const dynamic = "force-static";

const siteUrl = process.env.WEB_URL ?? process.env.NEXT_PUBLIC_WEB_URL ?? "https://homeopathypharma.com";

/** Live storefront sitemap — includes published products, remedies, brands, and Mumbai doctors. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "/",
    "/about/",
    "/contact/",
    "/faq/",
    "/how-it-works/",
    "/shop/",
    "/shop/categories/",
    "/shop/brands/",
    "/shop/bundles/",
    "/shop/offers/",
    "/shop/new-arrivals/",
    "/shop/bestsellers/",
    "/shop/doctor-recommended/",
    "/shop/health-areas/",
    "/login/",
    "/login/patient/",
    "/login/doctor/",
    "/login/admin/",
    "/doctor/",
    "/ops/",
    "/remedies/",
    "/brands/",
    "/bundles/",
    "/consult/",
    "/consult/online/",
    "/consult/offline/",
    "/doctors/",
    "/doctors/city/mumbai/",
    "/doctors/city/delhi/",
    "/doctors/city/bengaluru/",
    "/health/",
    "/health/womens-health/",
    "/health/mens-health/",
    "/health/child-health/",
    "/health/senior-health/",
    "/health/pet-health/",
    "/pets/",
    "/blog/",
    "/guides/",
    "/research/",
    "/sources/",
    "/manufacturers/",
    "/doctor-verification/",
    "/track-order/",
    "/serviceability/",
    "/search/",
    "/privacy-policy/",
    "/terms/",
    "/medical-disclaimer/",
    "/shipping-policy/",
    "/return-policy/",
    "/refund-policy/",
    "/cart/",
    "/checkout/",
  ];

  const paths = [
    ...staticPaths,
    ...HEALTH_AREA_SLUGS.map((slug) => `/shop/health-areas/${slug}/`),
    ...CATALOG_TAXONOMY.map((c) => `/shop/categories/${c.slug}/`),
    ...[...new Set(listCatalogTopicSlugs())].map((slug) => `/shop/topics/${slug}/`),
    ...BUNDLE_SLUGS.map((slug) => `/bundles/${slug}/`),
    ...brands.map((b) => `/brands/${b.slug}/`),
    ...remedies.map((r) => `/remedies/${r.slug}/`),
    ...PRODUCTS.map((p) => `/products/${p.slug}/`),
    ...DOCTORS.map((d) => `/doctors/${d.slug}/`),
    ...DOCTORS.map((d) => `/consult/book/${d.slug}/`),
  ];

  return paths.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority:
      path === "/"
        ? 1
        : path.startsWith("/products/") || path.startsWith("/doctors/")
          ? 0.8
          : 0.7,
  }));
}

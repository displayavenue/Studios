import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { HEALTH_AREA_LABELS } from "@/lib/content/health-areas";
import { PRODUCTS } from "@/lib/content/products";
import { HEALTH_AREA_SLUGS } from "@/lib/static-params";

export const metadata: Metadata = buildPageMetadata(
  "Shop by health area",
  "/shop/health-areas",
  "Discover products by wellness theme — shop discovery, not medical advice.",
);

export default function HealthAreasIndexPage() {
  return (
    <ContentPage
      title="Shop by health area"
      description="Browse products grouped by wellness themes. For product discovery only — we do not make disease treatment claims on these pages."
      path="/shop/health-areas"
    >
      <ul className="catalog-grid" role="list">
        {HEALTH_AREA_SLUGS.map((slug) => {
          const count = PRODUCTS.filter((p) => p.healthAreas.includes(slug)).length;
          return (
            <li key={slug} className="catalog-tile">
              <Link href={`/shop/health-areas/${slug}/`} className="catalog-tile__link hp-focus-ring">
                <p className="catalog-tile__eyebrow">{count} products</p>
                <h3 className="catalog-tile__title font-display">{HEALTH_AREA_LABELS[slug]}</h3>
                <p className="catalog-tile__meta">Shop discovery only — not medical advice</p>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-8)" }}>
        Shop-by pages are for product discovery only. Not medical advice. Products are not presented as treatments
        for specific diseases. For educational condition information, visit the{" "}
        <Link href="/health/" className="hp-link">
          health knowledge hub
        </Link>
        .
      </p>
    </ContentPage>
  );
}

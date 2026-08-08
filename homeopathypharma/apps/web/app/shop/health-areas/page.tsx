import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { HEALTH_AREA_SLUGS } from "@/lib/static-params";

export const metadata: Metadata = buildPageMetadata(
  "Shop by health area",
  "/shop/health-areas",
  "Discover products by wellness theme — shop discovery, not medical advice.",
);

const healthAreaLabels: Record<(typeof HEALTH_AREA_SLUGS)[number], string> = {
  "digestive-health": "Digestive health",
  "respiratory-health": "Respiratory health",
  "skin-health": "Skin health",
  "pet-care": "Pet care",
};

export default function HealthAreasIndexPage() {
  return (
    <ContentPage
      title="Shop by health area"
      description="Browse products grouped by wellness themes. For product discovery only — we do not make disease treatment claims on these pages."
      path="/shop/health-areas"
    >
      <p style={{ marginTop: 0, maxWidth: "60ch" }}>
        Health areas help you find products often browsed for everyday wellness themes. For medically reviewed
        condition information, visit the{" "}
        <Link href="/health/" className="hp-link hp-focus-ring">
          health knowledge hub
        </Link>
        .
      </p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-3)" }}>
        {HEALTH_AREA_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/shop/health-areas/${slug}/`} className="hp-link hp-focus-ring font-display">
              {healthAreaLabels[slug]}
            </Link>
          </li>
        ))}
      </ul>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-8)" }}>
        Shop-by pages are for product discovery only. Not medical advice. Products are not presented as treatments
        for specific diseases.
      </p>
    </ContentPage>
  );
}

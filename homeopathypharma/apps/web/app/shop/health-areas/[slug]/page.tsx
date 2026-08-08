import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { HEALTH_AREA_SLUGS, toParams } from "@/lib/static-params";

const healthAreaLabels: Record<(typeof HEALTH_AREA_SLUGS)[number], string> = {
  "digestive-health": "Digestive health",
  "respiratory-health": "Respiratory health",
  "skin-health": "Skin health",
  "pet-care": "Pet care",
};

export function generateStaticParams() {
  return toParams(HEALTH_AREA_SLUGS);
}

interface HealthAreaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: HealthAreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const label =
    healthAreaLabels[slug as (typeof HEALTH_AREA_SLUGS)[number]] ?? slug.replace(/-/g, " ");
  return buildPageMetadata(
    label,
    `/shop/health-areas/${slug}`,
    `Browse products for ${label.toLowerCase()} — shop discovery, not medical advice.`,
  );
}

export default async function HealthAreaPage({ params }: HealthAreaPageProps) {
  const { slug } = await params;
  const label =
    healthAreaLabels[slug as (typeof HEALTH_AREA_SLUGS)[number]] ?? slug.replace(/-/g, " ");

  return (
    <ContentPage
      title={label}
      description="Products often browsed in this wellness theme. Shop discovery only — no disease treatment claims."
      path={`/shop/health-areas/${slug}`}
    >
      <div className="product-placeholder">
        Product listing from <code>GET /v1/shop/health-areas/{slug}</code> via{" "}
        <code>product_health_area_map</code>.
      </div>
      <p style={{ marginTop: "var(--hp-space-6)" }}>
        <Link href="/shop/health-areas/" className="hp-link hp-focus-ring">
          ← All health areas
        </Link>
      </p>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        For product discovery only. Not medical advice and not a substitute for professional care. We do not claim
        these products treat or cure specific conditions.
      </p>
    </ContentPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ProductGrid } from "@/components/product-grid";
import { HEALTH_AREA_LABELS, type HealthAreaSlug } from "@/lib/content/health-areas";
import { productsByHealthArea } from "@/lib/content/products";
import { HEALTH_AREA_SLUGS, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(HEALTH_AREA_SLUGS);
}

interface HealthAreaPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: HealthAreaPageProps): Promise<Metadata> {
  const { slug } = await params;
  const label = HEALTH_AREA_LABELS[slug as HealthAreaSlug] ?? slug.replace(/-/g, " ");
  return buildPageMetadata(
    label,
    `/shop/health-areas/${slug}`,
    `Browse products for ${label.toLowerCase()} — shop discovery, not medical advice.`,
  );
}

export default async function HealthAreaPage({ params }: HealthAreaPageProps) {
  const { slug } = await params;
  const label = HEALTH_AREA_LABELS[slug as HealthAreaSlug] ?? slug.replace(/-/g, " ");
  const products = productsByHealthArea(slug);

  return (
    <ContentPage
      title={label}
      description="Products often browsed in this wellness theme. Shop discovery only — no disease treatment claims."
      path={`/shop/health-areas/${slug}`}
    >
      <p style={{ marginTop: 0 }}>
        {products.length} products tagged under {label.toLowerCase()}.
      </p>
      <ProductGrid products={products} />
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

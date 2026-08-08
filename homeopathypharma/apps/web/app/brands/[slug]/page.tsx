import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { BRAND_SLUGS, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(BRAND_SLUGS);
}

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");
  return buildPageMetadata(
    title,
    `/brands/${slug}`,
    `Explore ${title} homeopathic products — brand profile, manufacturers, and catalog.`,
  );
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");

  return (
    <ContentPage
      title={title}
      description="Brand hub — logo, country, linked manufacturers, regulatory notes, and product catalog."
      path={`/brands/${slug}`}
    >
      <div className="product-placeholder">
        Brand profile from <code>GET /v1/brands/{slug}</code>. Includes logo, country of origin, manufacturer
        links (<code>brand_manufacturer_map</code>), regulatory notes, SEO metadata, and published products.
      </div>
      <ul style={{ marginTop: "var(--hp-space-6)", paddingLeft: "var(--hp-space-6)" }}>
        <li>Logo and official website (when published)</li>
        <li>Primary and secondary manufacturers (separate entities)</li>
        <li>Product grid filtered by brand</li>
        <li>Regulatory notes for admin/compliance review — not a legal opinion</li>
      </ul>
      <p style={{ marginTop: "var(--hp-space-6)" }}>
        <Link href="/brands/" className="hp-link hp-focus-ring">
          ← All brands
        </Link>
      </p>
    </ContentPage>
  );
}

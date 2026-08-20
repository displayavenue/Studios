import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { getProduct } from "@/lib/content/products";
import { BUNDLE_SLUGS, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(BUNDLE_SLUGS);
}

interface BundlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BundlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return buildPageMetadata(
    product?.name ?? slug.replace(/-/g, " "),
    `/bundles/${slug}`,
    product
      ? `${product.name} — curated kit with transparent pricing.`
      : `Curated bundle: ${slug.replace(/-/g, " ")}.`,
  );
}

export default async function BundleDetailPage({ params }: BundlePageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return (
      <ContentPage title="Bundle not found" path={`/bundles/${slug}`}>
        <Link href="/bundles/" className="hp-link">
          ← All bundles
        </Link>
      </ContentPage>
    );
  }

  return (
    <ContentPage title={product.name} description={product.batchNote} path={`/bundles/${slug}`}>
      <div className="price-row">
        <span className="price-row__current">₹{product.priceInr}</span>
        {product.mrpInr > product.priceInr ? <span className="price-row__mrp">MRP ₹{product.mrpInr}</span> : null}
      </div>
      <ul className="detail-meta">
        <li>
          <strong>Brand</strong>
          <span>{product.brandName}</span>
        </li>
        <li>
          <strong>Pack</strong>
          <span>{product.packSize}</span>
        </li>
        <li>
          <strong>Contents note</strong>
          <span>{product.ingredients}</span>
        </li>
      </ul>
      <p>{product.directions}</p>
      <p style={{ color: "var(--hp-color-text-muted)" }}>{product.warnings}</p>
      <div style={{ marginTop: "var(--hp-space-6)" }}>
        <Link href={`/products/${product.slug}/`}>
          <Button variant="accent">View full product page</Button>
        </Link>
      </div>
      <p style={{ marginTop: "var(--hp-space-6)" }}>
        <Link href="/bundles/" className="hp-link hp-focus-ring">
          ← All bundles
        </Link>
      </p>
    </ContentPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BrandProductBrowser } from "@/components/brand-product-browser";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { getBrand, listBrandSlugs } from "@/lib/content/brands";
import { productsByBrand } from "@/lib/content/products";
import { toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(listBrandSlugs());
}

interface BrandPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrand(slug);
  return buildPageMetadata(
    brand?.name ?? slug.replace(/-/g, " "),
    `/brands/${slug}`,
    brand?.summary ?? `Explore ${slug.replace(/-/g, " ")} homeopathic products.`,
  );
}

export default async function BrandDetailPage({ params }: BrandPageProps) {
  const { slug } = await params;
  const brand = getBrand(slug);
  const products = productsByBrand(slug);

  if (!brand) {
    return (
      <ContentPage title="Brand not found" path={`/brands/${slug}`}>
        <Link href="/brands/" className="hp-link">
          ← All brands
        </Link>
      </ContentPage>
    );
  }

  return (
    <ContentPage title={brand.name} description={brand.tagline} path={`/brands/${slug}`}>
      <p style={{ maxWidth: "65ch" }}>{brand.summary}</p>
      <ul className="detail-meta">
        <li>
          <strong>Manufacturer</strong>
          <span>{brand.manufacturer}</span>
        </li>
        <li>
          <strong>Products</strong>
          <span>{products.length} published SKUs</span>
        </li>
      </ul>
      <BrandProductBrowser products={products} />
      <p style={{ marginTop: "var(--hp-space-6)" }}>
        <Link href="/brands/" className="hp-link hp-focus-ring">
          ← All brands
        </Link>
      </p>
    </ContentPage>
  );
}

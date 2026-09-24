import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ProductGrid } from "@/components/product-grid";
import { PRODUCTS } from "@/lib/content/products";

export const metadata: Metadata = buildPageMetadata(
  "Bundles & kits",
  "/bundles",
  "Curated homeopathic product bundles for common wellness goals.",
);

export default function BundlesIndexPage() {
  const bundles = PRODUCTS.filter((p) => p.category === "Bundles");

  return (
    <ContentPage
      title="Bundles & kits"
      description="Multi-product bundles curated for discovery — individual items remain available separately."
      path="/bundles"
    >
      <p style={{ marginTop: 0, maxWidth: "60ch" }}>
        Bundles group published SKUs with transparent pricing. Each kit page lists pack details without implying
        disease treatment.
      </p>
      <ProductGrid products={bundles} />
      <p style={{ marginTop: "var(--hp-space-6)" }}>
        Prefer single remedies?{" "}
        <Link href="/shop/" className="hp-link hp-focus-ring">
          Browse the full shop
        </Link>
        .
      </p>
    </ContentPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ProductGrid } from "@/components/product-grid";
import { PRODUCTS } from "@/lib/content/products";

export const metadata: Metadata = buildPageMetadata(
  "Shop bundles",
  "/shop/bundles",
  "Curated product bundles from the HomeopathyPharma catalogue.",
);

export default function ShopBundlesPage() {
  const bundles = PRODUCTS.filter((p) => p.category === "Bundles");

  return (
    <ContentPage title="Shop bundles" description="Curated kits from the live catalogue." path="/shop/bundles">
      <ProductGrid products={bundles} />
      <p style={{ marginTop: "var(--hp-space-6)" }}>
        <Link href="/bundles/" className="hp-link">
          Open bundles hub →
        </Link>
      </p>
    </ContentPage>
  );
}

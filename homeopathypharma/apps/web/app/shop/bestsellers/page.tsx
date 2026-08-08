import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ProductGrid } from "@/components/product-grid";
import { PRODUCTS } from "@/lib/content/products";

export const metadata: Metadata = buildPageMetadata(
  "Bestsellers",
  "/shop/bestsellers",
  "Popular homeopathic products currently published on HomeopathyPharma.",
);

export default function BestsellersPage() {
  const bestsellers = [...PRODUCTS]
    .sort((a, b) => a.priceInr - b.priceInr)
    .filter((p) => p.category === "Single Remedies")
    .slice(0, 24);

  return (
    <ContentPage
      title="Bestsellers"
      description="A rotating selection of frequently browsed single-remedy packs from the live catalogue."
      path="/shop/bestsellers"
    >
      <ProductGrid products={bestsellers} />
    </ContentPage>
  );
}

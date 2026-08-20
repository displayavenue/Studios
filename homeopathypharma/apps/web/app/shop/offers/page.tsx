import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ProductGrid } from "@/components/product-grid";
import { PRODUCTS } from "@/lib/content/products";

export const metadata: Metadata = buildPageMetadata(
  "Offers",
  "/shop/offers",
  "Products currently priced below MRP on HomeopathyPharma.",
);

export default function OffersPage() {
  const offers = PRODUCTS.filter((p) => p.mrpInr > p.priceInr).slice(0, 30);

  return (
    <ContentPage
      title="Offers"
      description="Published products currently listed below MRP. Prices update as catalogue packs change."
      path="/shop/offers"
    >
      <ProductGrid products={offers} />
    </ContentPage>
  );
}

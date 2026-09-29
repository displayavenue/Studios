import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ProductGrid } from "@/components/product-grid";
import { PRODUCTS } from "@/lib/content/products";

export const metadata: Metadata = buildPageMetadata(
  "New arrivals",
  "/shop/new-arrivals",
  "Recently published products on HomeopathyPharma.",
);

export default function NewArrivalsPage() {
  const newest = [...PRODUCTS].slice(-24).reverse();

  return (
    <ContentPage
      title="New arrivals"
      description="Recently published SKUs from the catalogue."
      path="/shop/new-arrivals"
    >
      <ProductGrid products={newest} />
    </ContentPage>
  );
}

import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Bestsellers", "/shop/bestsellers", "Popular products chosen by our customers.");

export default function Page() {
  return (
    <ContentPage title="Bestsellers" description="Popular products chosen by our customers." path="/shop/bestsellers">
      <p className="product-placeholder">Bestsellers from GET /v1/products?sort=bestsellers.</p>
    </ContentPage>
  );
}

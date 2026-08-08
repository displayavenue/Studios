import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Shop by brand", "/shop/brands", "Explore products from trusted manufacturers.");

export default function Page() {
  return (
    <ContentPage title="Shop by brand" description="Explore products from trusted manufacturers." path="/shop/brands">
      <p className="product-placeholder">Brands from GET /v1/brands.</p>
    </ContentPage>
  );
}

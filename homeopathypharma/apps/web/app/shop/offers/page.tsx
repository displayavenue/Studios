import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Offers", "/shop/offers", "Current promotions and seasonal offers.");

export default function Page() {
  return (
    <ContentPage title="Offers" description="Current promotions and seasonal offers." path="/shop/offers">
      <p className="product-placeholder">Offers from GET /v1/offers.</p>
    </ContentPage>
  );
}

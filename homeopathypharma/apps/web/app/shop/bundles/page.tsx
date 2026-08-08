import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Bundles & kits", "/shop/bundles", "Curated product bundles for common wellness goals.");

export default function Page() {
  return (
    <ContentPage title="Bundles & kits" description="Curated product bundles for common wellness goals." path="/shop/bundles">
      <p className="product-placeholder">Bundles from GET /v1/bundles.</p>
    </ContentPage>
  );
}

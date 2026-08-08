import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Shop", "/shop", "Browse homeopathic remedies and wellness products.");

export default function Page() {
  return (
    <ContentPage title="Shop" description="Browse homeopathic remedies and wellness products." path="/shop">
      <p className="product-placeholder">Main catalog from GET /v1/products.</p>
    </ContentPage>
  );
}

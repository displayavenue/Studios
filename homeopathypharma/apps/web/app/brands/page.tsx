import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Brands", "/brands", "Homeopathic and wellness brands available in our catalog.");

export default function Page() {
  return (
    <ContentPage title="Brands" description="Homeopathic and wellness brands available in our catalog." path="/brands">
      <p className="product-placeholder">Brand directory from GET /v1/brands.</p>
    </ContentPage>
  );
}

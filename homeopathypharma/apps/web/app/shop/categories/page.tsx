import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Shop by category", "/shop/categories", "Browse remedies organized by therapeutic category.");

export default function Page() {
  return (
    <ContentPage title="Shop by category" description="Browse remedies organized by therapeutic category." path="/shop/categories">
      <p className="product-placeholder">Categories from GET /v1/categories.</p>
    </ContentPage>
  );
}

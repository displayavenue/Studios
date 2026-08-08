import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("New arrivals", "/shop/new-arrivals", "Recently added products in our catalog.");

export default function Page() {
  return (
    <ContentPage title="New arrivals" description="Recently added products in our catalog." path="/shop/new-arrivals">
      <p className="product-placeholder">New arrivals from GET /v1/products?sort=new.</p>
    </ContentPage>
  );
}

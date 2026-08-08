import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Doctor recommended", "/shop/doctor-recommended", "Products highlighted by verified practitioners.");

export default function Page() {
  return (
    <ContentPage title="Doctor recommended" description="Products highlighted by verified practitioners." path="/shop/doctor-recommended">
      <p className="product-placeholder">Recommendations from GET /v1/products?filter=doctor-recommended.</p>
    </ContentPage>
  );
}

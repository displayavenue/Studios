import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Track your order",
  "/track-order",
  "Check delivery status with your order ID.",
);

export default function Page() {
  return (
    <ContentPage title="Track your order" description="Check delivery status with your order ID." path="/track-order">
      <p className="product-placeholder">
        Order tracking loads from <code>GET /v1/orders/track</code> after you enter an order ID and verification details.
      </p>
    </ContentPage>
  );
}

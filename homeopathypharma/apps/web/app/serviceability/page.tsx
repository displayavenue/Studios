import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Delivery serviceability",
  "/serviceability",
  "Check whether we deliver to your PIN code.",
);

export default function Page() {
  return (
    <ContentPage title="Delivery serviceability" description="Check whether we deliver to your PIN code." path="/serviceability">
      <p className="product-placeholder">
        PIN code checks use <code>GET /v1/logistics/serviceability?pin=</code>.
      </p>
    </ContentPage>
  );
}

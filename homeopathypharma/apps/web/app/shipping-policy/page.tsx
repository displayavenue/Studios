import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Shipping policy",
  "/shipping-policy",
  "Delivery timelines, carriers, and service areas.",
);

export default function Page() {
  return (
    <ContentPage title="Shipping policy" description="Delivery timelines, carriers, and service areas." path="/shipping-policy">
      <p className="disclaimer-banner">
        <strong>Draft placeholder — counsel review required.</strong> Final policy will describe shipping methods,
        estimated delivery windows, and regional restrictions.
      </p>
    </ContentPage>
  );
}

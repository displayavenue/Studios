import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Refund policy",
  "/refund-policy",
  "How refunds are processed after returns or cancellations.",
);

export default function Page() {
  return (
    <ContentPage title="Refund policy" description="How refunds are processed after returns or cancellations." path="/refund-policy">
      <p className="disclaimer-banner">
        <strong>Draft placeholder — counsel review required.</strong> Final policy will describe refund methods,
        processing times, and partial refund cases.
      </p>
    </ContentPage>
  );
}

import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Return policy",
  "/return-policy",
  "Eligible returns, timelines, and process overview.",
);

export default function Page() {
  return (
    <ContentPage title="Return policy" description="Eligible returns, timelines, and process overview." path="/return-policy">
      <p className="disclaimer-banner">
        <strong>Draft placeholder — counsel review required.</strong> Final policy will describe return eligibility,
        condition requirements, and refund coordination.
      </p>
    </ContentPage>
  );
}

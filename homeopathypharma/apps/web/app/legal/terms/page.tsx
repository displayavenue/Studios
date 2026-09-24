import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Terms of service", "/legal/terms");

export default function TermsPage() {
  return (
    <ContentPage title="Terms of service" path="/legal/terms">
      <p className="disclaimer-banner">
        <strong>Draft placeholder — counsel review required.</strong> Final terms will cover pharmacy sales,
        consultations, account use, and dispute resolution.
      </p>
    </ContentPage>
  );
}

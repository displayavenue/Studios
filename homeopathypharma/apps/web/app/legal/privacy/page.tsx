import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Privacy policy", "/legal/privacy");

export default function PrivacyPage() {
  return (
    <ContentPage title="Privacy policy" path="/legal/privacy">
      <p className="disclaimer-banner">
        <strong>Draft placeholder — counsel review required.</strong> Final privacy policy will describe data
        collection, cookies, health-data handling, and regional compliance (including applicable healthcare and
        ecommerce regulations).
      </p>
    </ContentPage>
  );
}

import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Medical disclaimer", "/legal/disclaimer");

export default function DisclaimerPage() {
  return (
    <ContentPage title="Medical disclaimer" path="/legal/disclaimer">
      <div style={{ display: "grid", gap: "var(--hp-space-4)", maxWidth: "60ch" }}>
        <p>
          HomeopathyPharma provides educational content and pharmacy services. Nothing on this site is intended to
          be — or to substitute for — professional medical advice, diagnosis, or treatment.
        </p>
        <p>
          Always seek the advice of your physician or other qualified health provider with questions about a medical
          condition. Never disregard professional medical advice or delay care because of something you read here.
        </p>
        <p className="disclaimer-banner">
          <strong>Legal review pending.</strong> This disclaimer will be finalized with qualified counsel before
          launch.
        </p>
      </div>
    </ContentPage>
  );
}

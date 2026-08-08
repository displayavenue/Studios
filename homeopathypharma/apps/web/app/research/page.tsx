import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Research", "/research", "Educational research summaries.");

export default function Page() {
  return (
    <ContentPage title="Research" description="Plain-language research summaries for education." path="/research">
      <p style={{ maxWidth: "60ch" }}>
        We publish short educational summaries of publicly discussed research themes. Summaries are not treatment
        recommendations and do not replace professional medical judgment.
      </p>
      <p className="disclaimer-banner" style={{ marginTop: "1.25rem" }}>
        Educational content only. Always consult a qualified healthcare provider for personal decisions.
      </p>
    </ContentPage>
  );
}

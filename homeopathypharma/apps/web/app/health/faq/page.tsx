import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Health FAQ",
  "/health/faq",
  "Common questions about homeopathy and our educational content.",
);

export default function HealthFaqPage() {
  return (
    <ContentPage title="Health FAQ" path="/health/faq">
      <p className="product-placeholder">Health FAQ entries from GET /v1/health/faq.</p>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        Answers are for general education only and do not replace advice from a qualified healthcare provider.
      </p>
    </ContentPage>
  );
}

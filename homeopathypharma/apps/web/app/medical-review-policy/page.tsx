import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Medical review policy", "/medical-review-policy", "How clinical reviewers evaluate health content before publication.");

export default function Page() {
  return (
    <ContentPage title="Medical review policy" description="How clinical reviewers evaluate health content before publication." path="/medical-review-policy">
      <p className="product-placeholder">Medical review process and reviewer qualifications.</p>
    </ContentPage>
  );
}

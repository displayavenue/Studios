import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Medical review policy", "/medical-review-policy", "How clinical review works.");

export default function Page() {
  return (
    <ContentPage title="Medical review policy" description="How clinical review is applied to educational content." path="/medical-review-policy">
      <p style={{ maxWidth: "60ch" }}>
        Health education pages go through editorial checks before publication. Doctor verification badges are issued
        only after admin credential review — listing a profile is not the same as verification.
      </p>
    </ContentPage>
  );
}

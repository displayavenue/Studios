import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Editorial policy", "/editorial-policy", "How we create, review, and update educational content.");

export default function Page() {
  return (
    <ContentPage title="Editorial policy" description="How we create, review, and update educational content." path="/editorial-policy">
      <p className="product-placeholder">Editorial standards and workflow overview.</p>
    </ContentPage>
  );
}

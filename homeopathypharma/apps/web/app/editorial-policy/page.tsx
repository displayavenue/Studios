import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Editorial policy", "/editorial-policy", "How we write and review educational content.");

export default function Page() {
  return (
    <ContentPage title="Editorial policy" description="How HomeopathyPharma writes and reviews educational content." path="/editorial-policy">
      <p style={{ maxWidth: "60ch" }}>
        Educational pages are written for clarity and caution. We avoid unsupported treatment claims, separate
        shop discovery from medical advice, and prefer transparent labelling language on product pages.
      </p>
    </ContentPage>
  );
}

import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Sources", "/sources", "References and citations used in our educational content.");

export default function Page() {
  return (
    <ContentPage title="Sources" description="References and citations used in our educational content." path="/sources">
      <p className="product-placeholder">Sources from GET /v1/content/sources.</p>
    </ContentPage>
  );
}

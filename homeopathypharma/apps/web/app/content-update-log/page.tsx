import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Content update log", "/content-update-log", "Recent revisions to published educational articles.");

export default function Page() {
  return (
    <ContentPage title="Content update log" description="Recent revisions to published educational articles." path="/content-update-log">
      <p className="product-placeholder">Update log from GET /v1/content/update-log.</p>
    </ContentPage>
  );
}

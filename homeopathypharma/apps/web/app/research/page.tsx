import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Research", "/research", "Summaries of published research — educational context only.");

export default function Page() {
  return (
    <ContentPage title="Research" description="Summaries of published research — educational context only." path="/research">
      <p className="product-placeholder">Research summaries from GET /v1/content/research.</p>
    </ContentPage>
  );
}

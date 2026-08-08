import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Guides", "/guides", "In-depth educational guides on homeopathy and wellness.");

export default function Page() {
  return (
    <ContentPage title="Guides" description="In-depth educational guides on homeopathy and wellness." path="/guides">
      <p className="product-placeholder">Guides from GET /v1/content/guides.</p>
    </ContentPage>
  );
}

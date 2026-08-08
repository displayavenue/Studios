import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Frequently asked questions",
  "/faq",
  "Answers about orders, consultations, and educational content.",
);

export default function Page() {
  return (
    <ContentPage title="Frequently asked questions" description="Answers about orders, consultations, and educational content." path="/faq">
      <p className="product-placeholder">
        FAQ entries from <code>GET /v1/content/faq</code>.
      </p>
    </ContentPage>
  );
}

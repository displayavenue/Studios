import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Online consultation",
  "/consult/online",
  "Video or chat consultations from home.",
);

export default function OnlineConsultPage() {
  return (
    <ContentPage title="Online consultation" description="Video or chat consultations from home." path="/consult/online">
      <p className="product-placeholder">
        Availability and booking flow from <code>GET /v1/consult/online</code>.
      </p>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        Online consultations are for non-emergency educational guidance. Call emergency services for urgent symptoms.
      </p>
    </ContentPage>
  );
}

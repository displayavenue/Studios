import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "In-clinic consultation",
  "/consult/offline",
  "Find practitioners offering in-person visits.",
);

export default function OfflineConsultPage() {
  return (
    <ContentPage title="In-clinic consultation" description="Find practitioners offering in-person visits." path="/consult/offline">
      <p className="product-placeholder">
        Clinic listings from <code>GET /v1/consult/offline</code>.
      </p>
    </ContentPage>
  );
}

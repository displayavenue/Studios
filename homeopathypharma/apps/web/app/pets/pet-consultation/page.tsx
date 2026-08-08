import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Pet consultation",
  "/pets/pet-consultation",
  "Book veterinary guidance for your companion animals.",
);

export default function PetConsultationPage() {
  return (
    <ContentPage title="Pet consultation" path="/pets/pet-consultation">
      <p className="product-placeholder">Pet consultation booking from GET /v1/pets/consultation.</p>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        Not for emergency situations. Contact an emergency veterinary clinic for urgent pet health issues.
      </p>
    </ContentPage>
  );
}

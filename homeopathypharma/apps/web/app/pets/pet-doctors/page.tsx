import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Pet doctors",
  "/pets/pet-doctors",
  "Find veterinarians and pet-care practitioners.",
);

export default function PetDoctorsPage() {
  return (
    <ContentPage title="Pet doctors" path="/pets/pet-doctors">
      <p className="product-placeholder">Pet doctor listings from GET /v1/pets/doctors.</p>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        Pet health content is educational. Consult a licensed veterinarian for diagnosis and treatment.
      </p>
    </ContentPage>
  );
}

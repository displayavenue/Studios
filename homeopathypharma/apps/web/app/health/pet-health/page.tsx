import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";

export const metadata: Metadata = buildPageMetadata(
  "Pet health",
  "/health/pet-health",
  "Educational resources on pet wellness — not veterinary medical advice.",
);

export default function PetHealthPage() {
  return (
    <HealthEducationShell
      title="Pet health"
      description="General pet wellness education. Also see /pets/ and /shop/health-areas/pet-care/ for species hubs and product discovery. Always consult a licensed veterinarian for diagnosis and treatment."
      path="/health/pet-health"
      apiHint="Pet health hub from GET /v1/health/pet-health. Cross-links to /pets/ species hubs and pet condition guides — educational only."
    />
  );
}

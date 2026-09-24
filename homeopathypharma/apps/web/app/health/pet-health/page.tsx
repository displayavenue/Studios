import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";

export const metadata: Metadata = buildPageMetadata(
  "Pet health",
  "/health/pet-health",
  "Educational pet wellness topics — not veterinary advice.",
);

export default function PetHealthPage() {
  return (
    <HealthEducationShell
      title="Pet health"
      description="Educational topics for pet caregivers."
      path="/health/pet-health"
      body="Explore educational pet-care topics and product discovery. Use animal remedies only under qualified veterinary guidance."
      links={[
        { href: "/pets/", label: "Pet care hub" },
        { href: "/shop/health-areas/pet-care/", label: "Pet care products" },
        { href: "/pets/pet-consultation/", label: "Pet consultation" },
      ]}
    />
  );
}

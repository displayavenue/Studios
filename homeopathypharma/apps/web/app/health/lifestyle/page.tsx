import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";

export const metadata: Metadata = buildPageMetadata(
  "Lifestyle",
  "/health/lifestyle",
  "Everyday wellness education — not medical advice.",
);

export default function LifestylePage() {
  return (
    <HealthEducationShell
      title="Lifestyle"
      description="Everyday wellness education for sleep, stress, and routines."
      path="/health/lifestyle"
      body="Practical educational articles on everyday wellness habits. For personal health decisions, consult a qualified practitioner."
    />
  );
}

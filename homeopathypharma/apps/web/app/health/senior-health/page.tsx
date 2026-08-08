import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";

export const metadata: Metadata = buildPageMetadata(
  "Senior health",
  "/health/senior-health",
  "Educational resources on wellness in later life — not medical advice.",
);

export default function SeniorHealthPage() {
  return (
    <HealthEducationShell
      title="Senior health"
      description="Wellness education for older adults. Consult your healthcare provider before changing any health regimen."
      path="/health/senior-health"
      apiHint="Senior health hub from GET /v1/health/senior-health. Links to age-group content, articles, and educational product references only."
    />
  );
}

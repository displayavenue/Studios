import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";

export const metadata: Metadata = buildPageMetadata(
  "Child health",
  "/health/child-health",
  "Educational resources on children's wellness — not medical advice.",
);

export default function ChildHealthPage() {
  return (
    <HealthEducationShell
      title="Child health"
      description="Age-appropriate wellness education for children and caregivers. Always consult a paediatric provider for your child."
      path="/health/child-health"
      apiHint="Child health hub from GET /v1/health/child-health. Links to age-group content, articles, and educational references — no paediatric treatment claims."
    />
  );
}

import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";

export const metadata: Metadata = buildPageMetadata(
  "Men's health",
  "/health/mens-health",
  "Educational resources on men's wellness topics — not medical advice.",
);

export default function MensHealthPage() {
  return (
    <HealthEducationShell
      title="Men's health"
      description="Life-stage and gender-specific wellness education for men. Consult a qualified provider for personal health decisions."
      path="/health/mens-health"
      apiHint="Men's health hub from GET /v1/health/mens-health. Links to gender-health articles, age-group content, and educational product references only."
    />
  );
}

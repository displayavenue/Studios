import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";

export const metadata: Metadata = buildPageMetadata(
  "Women's health",
  "/health/womens-health",
  "Educational resources on women's wellness topics — not medical advice.",
);

export default function WomensHealthPage() {
  return (
    <HealthEducationShell
      title="Women's health"
      description="Life-stage and gender-specific wellness education for women. Consult a qualified provider for personal health decisions."
      path="/health/womens-health"
      apiHint="Women's health hub from GET /v1/health/womens-health. Links to gender-health articles, age-group content, and educational product references only."
    />
  );
}

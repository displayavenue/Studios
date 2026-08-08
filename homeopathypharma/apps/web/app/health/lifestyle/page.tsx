import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";

export const metadata: Metadata = buildPageMetadata(
  "Lifestyle & wellness",
  "/health/lifestyle",
  "Sleep, nutrition, stress, and daily habits — educational only.",
);

export default function LifestylePage() {
  return (
    <HealthEducationShell
      title="Lifestyle & wellness"
      description="Educational articles on daily habits that support general wellness."
      path="/health/lifestyle"
      apiHint="Lifestyle articles from GET /v1/health/lifestyle."
    />
  );
}

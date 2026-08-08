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
      description="Life-stage and gender-specific wellness education for women."
      path="/health/womens-health"
      body="Explore educational articles on women's wellness across life stages. These pages are for general learning — speak with a qualified practitioner for personal care decisions."
      links={[
        { href: "/health/gender-health/womens-wellness/", label: "Women's wellness topics" },
        { href: "/doctors/", label: "Consult a doctor" },
        { href: "/shop/", label: "Shop medicines" },
      ]}
    />
  );
}

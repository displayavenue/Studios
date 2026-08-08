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
      description="Educational wellness topics for men."
      path="/health/mens-health"
      body="Browse educational content on men's wellness. Use these guides for general understanding, then consult a qualified practitioner when you need personal advice."
      links={[
        { href: "/health/gender-health/mens-wellness/", label: "Men's wellness topics" },
        { href: "/doctors/", label: "Consult a doctor" },
        { href: "/shop/", label: "Shop medicines" },
      ]}
    />
  );
}

import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";

export const metadata: Metadata = buildPageMetadata(
  "Senior health",
  "/health/senior-health",
  "Educational resources on senior wellness — not medical advice.",
);

export default function SeniorHealthPage() {
  return (
    <HealthEducationShell
      title="Senior health"
      description="Educational wellness topics for older adults."
      path="/health/senior-health"
      body="Read educational guides related to senior wellness. These pages do not replace clinical evaluation — consult a qualified practitioner for personal care."
      links={[
        { href: "/health/age-groups/seniors/", label: "Senior topics" },
        { href: "/doctors/", label: "Consult a doctor" },
        { href: "/shop/", label: "Shop medicines" },
      ]}
    />
  );
}

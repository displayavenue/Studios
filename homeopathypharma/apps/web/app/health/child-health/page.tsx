import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";

export const metadata: Metadata = buildPageMetadata(
  "Child health",
  "/health/child-health",
  "Educational resources on child wellness — not medical advice.",
);

export default function ChildHealthPage() {
  return (
    <HealthEducationShell
      title="Child health"
      description="Educational wellness topics for children and caregivers."
      path="/health/child-health"
      body="Find caregiver-friendly educational topics about child wellness. Always seek a qualified paediatric or homeopathic practitioner for a child's personal care."
      links={[
        { href: "/health/age-groups/children/", label: "Children's topics" },
        { href: "/doctors/", label: "Consult a doctor" },
        { href: "/shop/", label: "Shop medicines" },
      ]}
    />
  );
}

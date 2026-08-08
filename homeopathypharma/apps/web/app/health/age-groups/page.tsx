import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { AGE_GROUP_SLUGS } from "@/lib/static-params";

export const metadata: Metadata = buildPageMetadata(
  "Age groups",
  "/health/age-groups",
  "Wellness topics tailored to different life stages.",
);

export default function AgeGroupsHubPage() {
  return (
    <ContentPage
      title="Age groups"
      description="Educational wellness topics organized by life stage."
      path="/health/age-groups"
    >
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-3)" }}>
        {AGE_GROUP_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/health/age-groups/${slug}/`} className="hp-link hp-focus-ring">
              {slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-8)" }}>
        For general education only. Pediatric and senior care decisions require qualified clinical guidance.
      </p>
    </ContentPage>
  );
}

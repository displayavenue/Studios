import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { GENDER_HEALTH_SLUGS } from "@/lib/static-params";

export const metadata: Metadata = buildPageMetadata(
  "Gender health",
  "/health/gender-health",
  "Educational topics related to gender-specific wellness.",
);

export default function GenderHealthHubPage() {
  return (
    <ContentPage title="Gender health" path="/health/gender-health">
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-3)" }}>
        {GENDER_HEALTH_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/health/gender-health/${slug}/`} className="hp-link hp-focus-ring">
              {slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-8)" }}>
        For general education only. Personal health decisions should involve a qualified healthcare provider.
      </p>
    </ContentPage>
  );
}

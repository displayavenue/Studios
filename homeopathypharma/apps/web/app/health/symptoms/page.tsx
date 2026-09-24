import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { SYMPTOM_SLUGS } from "@/lib/static-params";

export const metadata: Metadata = buildPageMetadata(
  "Symptoms",
  "/health/symptoms",
  "Educational overviews of common symptoms — not diagnostic tools.",
);

export default function SymptomsHubPage() {
  return (
    <ContentPage
      title="Symptoms"
      description="Educational overviews of common symptoms. Always consult a qualified provider for personal health decisions."
      path="/health/symptoms"
    >
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-3)" }}>
        {SYMPTOM_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/health/symptoms/${slug}/`} className="hp-link hp-focus-ring">
              {slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-8)" }}>
        For general education only. Not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </ContentPage>
  );
}

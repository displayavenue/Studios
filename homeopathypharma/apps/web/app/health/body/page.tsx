import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { ORGAN_SLUGS } from "@/lib/static-params";

export const metadata: Metadata = buildPageMetadata(
  "Body & organs",
  "/health/body",
  "Explore organ-focused educational content.",
);

export default function BodyHubPage() {
  return (
    <ContentPage
      title="Body & organs"
      description="Organ-focused educational articles. Canonical organ pages live under /health/organs/."
      path="/health/body"
    >
      <p style={{ marginBottom: "var(--hp-space-4)" }}>
        Browse by organ or visit the{" "}
        <Link href="/health/organs/heart/" className="hp-link hp-focus-ring">
          organs hub
        </Link>
        .
      </p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-3)" }}>
        {ORGAN_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/health/body/${slug}/`} className="hp-link hp-focus-ring">
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

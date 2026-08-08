import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { REMEDY_SLUGS } from "@/lib/static-params";

export const metadata: Metadata = buildPageMetadata(
  "Remedies",
  "/remedies",
  "Master remedy monographs — educational reference for homeopathic materia medica.",
);

export default function RemediesIndexPage() {
  return (
    <ContentPage
      title="Remedies"
      description="Browse master remedy profiles used across our catalog. Educational reference only — not prescribing guidance."
      path="/remedies"
    >
      <p style={{ marginTop: 0, maxWidth: "60ch" }}>
        Each remedy page describes source classification, common names, and general background from published
        materia medica. Commercial listings (potency, form, pack) live on product pages linked from each remedy.
      </p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-3)" }}>
        {REMEDY_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/remedies/${slug}/`} className="hp-link hp-focus-ring font-display">
              {slug.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-8)" }}>
        For general education only. Not medical advice and not a substitute for care from a licensed healthcare
        provider. We do not make unsupported treatment or cure claims.
      </p>
    </ContentPage>
  );
}

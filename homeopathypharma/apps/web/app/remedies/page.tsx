import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { remedies } from "@/lib/content/remedies";

export const metadata: Metadata = buildPageMetadata(
  "Remedies",
  "/remedies",
  "Master remedy monographs — educational reference for homeopathic materia medica.",
);

export default function RemediesIndexPage() {
  return (
    <ContentPage
      title="Remedies"
      description="Browse master remedy profiles used across our catalogue. Educational reference only — not prescribing guidance."
      path="/remedies"
    >
      <p style={{ marginTop: 0, maxWidth: "60ch" }}>
        {remedies.length} remedies with published commercial packs. Each page links to potencies, forms, and brands
        available in the shop.
      </p>
      <ul className="catalog-grid" role="list">
        {remedies.map((remedy) => (
          <li key={remedy.slug} className="catalog-tile">
            <Link href={`/remedies/${remedy.slug}/`} className="catalog-tile__link hp-focus-ring">
              <p className="catalog-tile__eyebrow">{remedy.productCount} products</p>
              <h3 className="catalog-tile__title font-display">{remedy.name}</h3>
              <p className="catalog-tile__meta">{remedy.latinName}</p>
              <p className="catalog-tile__stock">{remedy.commonForms.join(" · ")}</p>
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

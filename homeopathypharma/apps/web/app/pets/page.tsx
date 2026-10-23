import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Pet care",
  "/pets",
  "Educational resources for homeopathic pet wellness — consult a veterinarian for medical decisions.",
);

const species = [
  { slug: "dogs", label: "Dogs" },
  { slug: "cats", label: "Cats" },
  { slug: "birds", label: "Birds" },
];

export default function PetsPage() {
  return (
    <ContentPage
      title="Pet care"
      description="Species-specific educational guides and remedy considerations for companion animals."
      path="/pets"
    >
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-3)" }}>
        {species.map((s) => (
          <li key={s.slug}>
            <Link href={`/pets/${s.slug}`} className="hp-link hp-focus-ring">
              {s.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/pets/conditions/overview" className="hp-link hp-focus-ring">
            Common conditions (education)
          </Link>
        </li>
      </ul>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-8)" }}>
        Pet content is educational. Always work with a licensed veterinarian before giving any remedy to an animal.
      </p>
    </ContentPage>
  );
}

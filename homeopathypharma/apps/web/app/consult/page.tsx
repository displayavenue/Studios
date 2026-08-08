import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Consult a practitioner",
  "/consult",
  "Book online or in-clinic consultations with verified homeopathic doctors.",
);

export default function ConsultPage() {
  return (
    <ContentPage
      title="Consult a practitioner"
      description="Choose how you would like to connect with a verified homeopathic practitioner."
      path="/consult"
    >
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-4)" }}>
        <li>
          <Link href="/consult/online/" className="hp-link hp-focus-ring font-display" style={{ fontSize: "var(--hp-text-xl)" }}>
            Online consultation
          </Link>
        </li>
        <li>
          <Link href="/consult/offline/" className="hp-link hp-focus-ring font-display" style={{ fontSize: "var(--hp-text-xl)" }}>
            In-clinic consultation
          </Link>
        </li>
        <li>
          <Link href="/doctors/" className="hp-link hp-focus-ring font-display" style={{ fontSize: "var(--hp-text-xl)" }}>
            Browse doctors
          </Link>
        </li>
      </ul>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-8)" }}>
        Consultations provide general educational guidance. They do not replace in-person medical evaluation or
        emergency care.
      </p>
    </ContentPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { DoctorGrid } from "@/components/doctor-grid";
import { DOCTORS } from "@/lib/content/doctors";

export const metadata: Metadata = buildPageMetadata(
  "Consult a practitioner",
  "/consult",
  "Book online or in-clinic consultations with listed BHMS homeopathic doctors in Mumbai.",
);

export default function ConsultPage() {
  const featured = DOCTORS.filter((d) => d.acceptingPatients).slice(0, 6);

  return (
    <ContentPage
      title="Consult a practitioner"
      description="Connect with listed BHMS practitioners for online video or clinic visits. Educational guidance only."
      path="/consult"
    >
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-4)" }}>
        <li>
          <Link href="/consult/online/" className="hp-link hp-focus-ring font-display" style={{ fontSize: "var(--hp-text-xl)" }}>
            Online consultation
          </Link>
          <span style={{ display: "block", color: "var(--hp-color-text-muted)", fontSize: "var(--hp-text-sm)" }}>
            Video sessions with Mumbai-listed practitioners
          </span>
        </li>
        <li>
          <Link href="/consult/offline/" className="hp-link hp-focus-ring font-display" style={{ fontSize: "var(--hp-text-xl)" }}>
            In-clinic consultation
          </Link>
          <span style={{ display: "block", color: "var(--hp-color-text-muted)", fontSize: "var(--hp-text-sm)" }}>
            Visit clinics across Mumbai localities
          </span>
        </li>
        <li>
          <Link href="/doctors/" className="hp-link hp-focus-ring font-display" style={{ fontSize: "var(--hp-text-xl)" }}>
            Browse all {DOCTORS.length} doctors
          </Link>
        </li>
      </ul>

      <h2 className="font-display" style={{ marginTop: "var(--hp-space-10)", color: "var(--hp-color-teal-900)" }}>
        Practitioners accepting requests
      </h2>
      <DoctorGrid doctors={featured} />

      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-8)" }}>
        Consultations provide general educational guidance. They do not replace in-person medical evaluation or
        emergency care. Verification badges appear only after admin credential review.
      </p>
    </ContentPage>
  );
}

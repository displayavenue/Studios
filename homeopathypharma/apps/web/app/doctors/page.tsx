import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { DoctorGrid } from "@/components/doctor-grid";
import { DOCTORS } from "@/lib/content/doctors";

export const metadata: Metadata = buildPageMetadata(
  "Find a doctor",
  "/doctors",
  "Browse 100 BHMS homeopathic practitioners listed across Mumbai for online and clinic consultations.",
);

export default function DoctorsPage() {
  return (
    <ContentPage
      title="Find a doctor"
      description="Browse BHMS practitioners listed in Mumbai for online video and clinic consultations. Profiles are for discovery and booking requests — verification badges are issued only after admin review."
      path="/doctors"
    >
      <p style={{ marginTop: 0, maxWidth: "62ch" }}>
        {DOCTORS.length} practitioners currently listed in Mumbai across localities from Andheri to Navi Mumbai.
        Fees and formats are shown on each profile. Educational guidance only — not a substitute for emergency care.
      </p>
      <p style={{ marginTop: "var(--hp-space-4)" }}>
        <Link href="/doctors/city/mumbai/" className="hp-link hp-focus-ring">
          View Mumbai directory →
        </Link>
        {" · "}
        <Link href="/consult/" className="hp-link hp-focus-ring">
          Consultation options
        </Link>
      </p>
      <DoctorGrid doctors={DOCTORS} />
    </ContentPage>
  );
}

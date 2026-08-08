import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { DoctorGrid } from "@/components/doctor-grid";
import { DOCTORS } from "@/lib/content/doctors";

export const metadata: Metadata = buildPageMetadata(
  "In-clinic consultation",
  "/consult/offline",
  "Book clinic visits with listed BHMS practitioners across Mumbai localities.",
);

export default function OfflineConsultPage() {
  const clinic = DOCTORS.filter((d) => d.formats.some((f) => f.toLowerCase().includes("clinic"))).slice(0, 24);

  return (
    <ContentPage
      title="In-clinic consultation"
      description="Clinic visits with Mumbai-listed BHMS practitioners. Addresses appear on each profile."
      path="/consult/offline"
    >
      <p style={{ maxWidth: "60ch" }}>
        Choose a locality that works for you, then request a visit. Clinic addresses and fees are listed on each
        profile.
      </p>
      <p>
        <Link href="/doctors/city/mumbai/" className="hp-link">
          Full Mumbai directory →
        </Link>
      </p>
      <DoctorGrid doctors={clinic} />
    </ContentPage>
  );
}

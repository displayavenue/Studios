import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { DoctorGrid } from "@/components/doctor-grid";
import { DOCTORS } from "@/lib/content/doctors";

export const metadata: Metadata = buildPageMetadata(
  "Online consultation",
  "/consult/online",
  "Book online video consultations with listed BHMS practitioners in Mumbai.",
);

export default function OnlineConsultPage() {
  const online = DOCTORS.filter((d) => d.formats.some((f) => f.toLowerCase().includes("online"))).slice(0, 24);

  return (
    <ContentPage
      title="Online consultation"
      description="Video consultations with Mumbai-listed BHMS practitioners. Request a slot from any profile."
      path="/consult/online"
    >
      <p style={{ maxWidth: "60ch" }}>
        {online.length}+ practitioners list online video among their formats. Open a profile to review fees,
        languages, and request a consultation.
      </p>
      <p>
        <Link href="/doctors/city/mumbai/" className="hp-link">
          Full Mumbai directory →
        </Link>
      </p>
      <DoctorGrid doctors={online} />
    </ContentPage>
  );
}

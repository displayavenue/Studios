import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { DoctorGrid } from "@/components/doctor-grid";
import { listDoctorsByCity } from "@/lib/content/doctors";
import { DOCTOR_CITY_SLUGS, toCityParams } from "@/lib/static-params";

const cityLabels: Record<string, string> = {
  mumbai: "Mumbai",
  delhi: "Delhi",
  bengaluru: "Bengaluru",
};

export function generateStaticParams() {
  return toCityParams(DOCTOR_CITY_SLUGS);
}

interface DoctorsByCityPageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: DoctorsByCityPageProps): Promise<Metadata> {
  const { city } = await params;
  const label = cityLabels[city] ?? city.charAt(0).toUpperCase() + city.slice(1);
  return buildPageMetadata(
    `Doctors in ${label}`,
    `/doctors/city/${city}`,
    `BHMS homeopathic practitioners listed in ${label} for online and clinic consultations.`,
  );
}

export default async function DoctorsByCityPage({ params }: DoctorsByCityPageProps) {
  const { city } = await params;
  const label = cityLabels[city] ?? city.charAt(0).toUpperCase() + city.slice(1);
  const doctors = listDoctorsByCity(label);

  return (
    <ContentPage
      title={`Doctors in ${label}`}
      description={
        doctors.length > 0
          ? `${doctors.length} BHMS practitioners currently listed in ${label}.`
          : `Practitioner listings for ${label} are expanding. Browse Mumbai for available profiles today.`
      }
      path={`/doctors/city/${city}`}
    >
      {doctors.length === 0 ? (
        <p style={{ maxWidth: "60ch" }}>
          We have not published {label} profiles yet. Start with the{" "}
          <Link href="/doctors/city/mumbai/" className="hp-link">
            Mumbai directory
          </Link>{" "}
          ({listDoctorsByCity("Mumbai").length} listed) or{" "}
          <Link href="/doctors/" className="hp-link">
            view all doctors
          </Link>
          .
        </p>
      ) : (
        <>
          <p style={{ marginTop: 0, maxWidth: "62ch" }}>
            Filter by locality on each profile card. Online video and clinic visit formats are available depending
            on the practitioner. Listing is not the same as a verified badge.
          </p>
          <DoctorGrid doctors={doctors} />
        </>
      )}
    </ContentPage>
  );
}

import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { DOCTOR_CITY_SLUGS, toCityParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toCityParams(DOCTOR_CITY_SLUGS);
}

interface DoctorsByCityPageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({ params }: DoctorsByCityPageProps): Promise<Metadata> {
  const { city } = await params;
  const label = city.charAt(0).toUpperCase() + city.slice(1);
  return buildPageMetadata(`Doctors in ${label}`, `/doctors/city/${city}`);
}

export default async function DoctorsByCityPage({ params }: DoctorsByCityPageProps) {
  const { city } = await params;
  const label = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <ContentPage title={`Doctors in ${label}`} path={`/doctors/city/${city}`}>
      <p className="product-placeholder">
        Practitioner listings for {label} from <code>GET /v1/doctors?city={city}</code>.
      </p>
    </ContentPage>
  );
}

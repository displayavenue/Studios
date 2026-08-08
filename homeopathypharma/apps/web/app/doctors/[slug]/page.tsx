import type { Metadata } from "next";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { getDoctor } from "@/lib/api";

interface DoctorProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DoctorProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctor(slug);
  return buildPageMetadata(doctor?.name ?? "Doctor profile", `/doctors/${slug}`);
}

export default async function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  const { slug } = await params;
  const doctor = await getDoctor(slug);

  return (
    <ContentPage title={doctor?.name ?? "Doctor profile"} path={`/doctors/${slug}`}>
      <div className="product-placeholder" style={{ marginBottom: "var(--hp-space-6)" }}>
        Profile, credentials, languages, and availability from <code>GET /v1/doctors/{slug}</code>.
      </div>
      <Button variant="accent">Request consultation</Button>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        Consultations provide general educational guidance. They do not replace in-person medical evaluation or
        emergency care.
      </p>
    </ContentPage>
  );
}

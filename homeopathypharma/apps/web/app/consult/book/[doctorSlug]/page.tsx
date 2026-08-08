import type { Metadata } from "next";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { DOCTOR_SLUGS, toDoctorSlugParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toDoctorSlugParams(DOCTOR_SLUGS);
}

interface BookConsultPageProps {
  params: Promise<{ doctorSlug: string }>;
}

export async function generateMetadata({ params }: BookConsultPageProps): Promise<Metadata> {
  const { doctorSlug } = await params;
  return buildPageMetadata("Book consultation", `/consult/book/${doctorSlug}`);
}

export default async function BookConsultPage({ params }: BookConsultPageProps) {
  const { doctorSlug } = await params;

  return (
    <ContentPage title="Book consultation" path={`/consult/book/${doctorSlug}`}>
      <p className="product-placeholder" style={{ marginBottom: "var(--hp-space-6)" }}>
        Slots and booking for doctor <code>{doctorSlug}</code> from <code>GET /v1/consult/book/{doctorSlug}</code>.
      </p>
      <Button variant="accent">Continue to booking</Button>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        Consultations provide general educational guidance. They do not replace in-person medical evaluation or
        emergency care.
      </p>
    </ContentPage>
  );
}

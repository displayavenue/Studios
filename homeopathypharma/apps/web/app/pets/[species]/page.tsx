import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { PET_SPECIES_SLUGS, toSpeciesParams } from "@/lib/static-params";


export function generateStaticParams() {
  return toSpeciesParams(PET_SPECIES_SLUGS);
}

interface PetSpeciesPageProps {
  params: Promise<{ species: string }>;
}

export async function generateMetadata({ params }: PetSpeciesPageProps): Promise<Metadata> {
  const { species } = await params;
  const label = species.charAt(0).toUpperCase() + species.slice(1);
  return buildPageMetadata(`${label} care`, `/pets/${species}`);
}

export default async function PetSpeciesPage({ params }: PetSpeciesPageProps) {
  const { species } = await params;
  const label = species.charAt(0).toUpperCase() + species.slice(1);

  return (
    <ContentPage title={`${label} care`} path={`/pets/${species}`}>
      <p style={{ maxWidth: "60ch" }}>
        Educational care topics and product discovery for {label.toLowerCase()}. Always follow qualified veterinary
        guidance for animal health decisions.
      </p>
    </ContentPage>
  );
}

import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

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
      <div className="product-placeholder">
        Species hub content from <code>GET /v1/pets/{species}</code>.
      </div>
    </ContentPage>
  );
}

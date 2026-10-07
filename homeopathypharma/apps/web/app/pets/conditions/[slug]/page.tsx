import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { PET_CONDITION_SLUGS, toParams } from "@/lib/static-params";


export function generateStaticParams() {
  return toParams(PET_CONDITION_SLUGS);
}

interface PetConditionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PetConditionPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata("Pet condition (education)", `/pets/conditions/${slug}`);
}

export default async function PetConditionPage({ params }: PetConditionPageProps) {
  const { slug } = await params;

  return (
    <ContentPage title={slug.replace(/-/g, " ")} path={`/pets/conditions/${slug}`}>
      <p style={{ maxWidth: "60ch" }}>
        Educational notes related to {slug.replace(/-/g, " ")}. Not veterinary advice and not a substitute for
        professional animal care.
      </p>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        Not veterinary medical advice. Contact your veterinarian for diagnosis and treatment.
      </p>
    </ContentPage>
  );
}

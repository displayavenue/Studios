import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

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
      <div className="product-placeholder">
        Pet condition education from <code>GET /v1/pets/conditions/{slug}</code>.
      </div>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        Not veterinary medical advice. Contact your veterinarian for diagnosis and treatment.
      </p>
    </ContentPage>
  );
}

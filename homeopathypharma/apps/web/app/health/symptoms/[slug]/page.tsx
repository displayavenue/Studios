import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";
import { SYMPTOM_SLUGS, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(SYMPTOM_SLUGS);
}

interface SymptomPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SymptomPageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");
  return buildPageMetadata(title, `/health/symptoms/${slug}`, "Educational symptom overview.");
}

export default async function SymptomPage({ params }: SymptomPageProps) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");

  return (
    <HealthEducationShell
      title={title}
      description="Educational overview — not a diagnostic tool."
      path={`/health/symptoms/${slug}`}
      body={`General educational notes related to ${title}. This is not a diagnosis tool and not a substitute for professional care.`}
    />
  );
}

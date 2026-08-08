import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";
import { GENDER_HEALTH_SLUGS, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(GENDER_HEALTH_SLUGS);
}

interface GenderHealthPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GenderHealthPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata(slug.replace(/-/g, " "), `/health/gender-health/${slug}`);
}

export default async function GenderHealthPage({ params }: GenderHealthPageProps) {
  const { slug } = await params;

  return (
    <HealthEducationShell
      title={slug.replace(/-/g, " ")}
      path={`/health/gender-health/${slug}`}
      apiHint={`Gender health content from GET /v1/health/gender-health/${slug}.`}
    />
  );
}

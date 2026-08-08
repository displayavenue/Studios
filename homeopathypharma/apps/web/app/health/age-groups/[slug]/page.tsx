import type { Metadata } from "next";
import { buildPageMetadata } from "@/components/content-page";
import { HealthEducationShell } from "@/components/health-education-shell";
import { AGE_GROUP_SLUGS, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(AGE_GROUP_SLUGS);
}

interface AgeGroupPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AgeGroupPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildPageMetadata(slug.replace(/-/g, " "), `/health/age-groups/${slug}`);
}

export default async function AgeGroupPage({ params }: AgeGroupPageProps) {
  const { slug } = await params;

  return (
    <HealthEducationShell
      title={slug.replace(/-/g, " ")}
      path={`/health/age-groups/${slug}`}
      apiHint={`Age-group content from GET /v1/health/age-groups/${slug}.`}
    />
  );
}

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
  const label = slug.replace(/-/g, " ");

  return (
    <HealthEducationShell
      title={label}
      path={`/health/age-groups/${slug}`}
      body={`Educational topics for ${label}. Use this as general context, then consult a qualified practitioner for personal care.`}
    />
  );
}

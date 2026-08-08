import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { BUNDLE_SLUGS, toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(BUNDLE_SLUGS);
}

interface BundlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BundlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");
  return buildPageMetadata(title, `/bundles/${slug}`, `Curated bundle: ${title}.`);
}

export default async function BundleDetailPage({ params }: BundlePageProps) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");

  return (
    <ContentPage title={title} description="Curated product bundle with included SKUs and pricing." path={`/bundles/${slug}`}>
      <div className="product-placeholder">
        Bundle detail from <code>GET /v1/bundles/{slug}</code>. Lists component variants, bundle price, and
        availability.
      </div>
      <p style={{ marginTop: "var(--hp-space-6)" }}>
        <Link href="/bundles/" className="hp-link hp-focus-ring">
          ← All bundles
        </Link>
      </p>
    </ContentPage>
  );
}

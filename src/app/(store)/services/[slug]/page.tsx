import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BirthDetailsForm } from "@/components/site/birth-details-form";
import { PageHero, SectionShell } from "@/components/site/page-chrome";
import { ProductDetailSections } from "@/components/site/product-detail-sections";
import { PRICING } from "@/config/site";
import { formatINR, toNumber } from "@/lib/utils";
import { SamplePreview } from "@/components/site/sample-preview";
import { StickyPayBar } from "@/components/site/sticky-pay-bar";
import { ServiceCard } from "@/components/site/service-card";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return { title: "Service not found" };
    return {
      title: product.seoTitle || product.name,
      description: product.seoDescription || product.shortDescription,
    };
  } catch {
    return { title: "Service" };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  let product = null;
  let related: Array<{
    id: string;
    slug: string;
    name: string;
    shortDescription: string | null;
    price: unknown;
    category: { name: string; slug: string } | null;
  }> = [];

  try {
    product = await prisma.product.findFirst({
      where: { slug, status: "PUBLISHED", isActive: true },
      include: { category: true },
    });
    if (product?.categoryId) {
      related = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          status: "PUBLISHED",
          isActive: true,
          isMembership: false,
          NOT: { id: product.id },
        },
        take: 3,
        orderBy: { sortOrder: "asc" },
        include: { category: true },
      });
    }
  } catch {
    notFound();
  }

  if (!product) notFound();

  const price = toNumber(product.price) || PRICING.reportPrice;
  const description = product.description || product.shortDescription || "";

  return (
    <div className="pb-24 md:pb-0">
      <PageHero
        eyebrow={product.category?.name || "Astrology Report"}
        title={product.name}
        subtitle={product.shortDescription || undefined}
      >
        <div className="flex flex-wrap items-center gap-2">
          <p className="inline-flex items-center rounded-full bg-[var(--jk-gold)] px-4 py-1.5 text-sm font-bold text-[var(--jk-navy)]">
            {formatINR(price)}
          </p>
          <Link
            href="/membership"
            className="inline-flex items-center rounded-full border border-white/30 px-3 py-1.5 text-xs text-white/90"
          >
            Member benefits available
          </Link>
        </div>
      </PageHero>

      <SectionShell muted>
        <nav className="mb-6 text-sm text-[var(--jk-muted)]">
          <Link href="/services" className="hover:text-[var(--jk-gold-dark)]">
            Services
          </Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={`/services?category=${product.category.slug}`}
                className="hover:text-[var(--jk-gold-dark)]"
              >
                {product.category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <ProductDetailSections
              description={description}
              whatsIncluded={product.whatsIncluded}
              faqs={product.faqs}
              deliveryNote={product.deliveryNote}
            />
            <SamplePreview productName={product.name} productSlug={product.slug} />
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <BirthDetailsForm productSlug={product.slug} productName={product.name} price={price} />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="font-display text-2xl font-semibold text-[var(--jk-ink)]">
              Related in {product.category?.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--jk-muted)]">
              Different focus — not duplicates of this report.
            </p>
            <div className="service-grid mt-6">
              {related.map((p) => (
                <ServiceCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </SectionShell>

      <StickyPayBar price={price} />
    </div>
  );
}

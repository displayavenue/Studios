import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BirthDetailsForm } from "@/components/site/birth-details-form";
import { PageHero, SectionShell, Surface } from "@/components/site/page-chrome";
import { PRICING } from "@/config/site";
import { formatINR, toNumber } from "@/lib/utils";

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
  try {
    product = await prisma.product.findFirst({
      where: { slug, status: "PUBLISHED", isActive: true },
      include: { category: true },
    });
  } catch {
    notFound();
  }

  if (!product) notFound();

  const price = toNumber(product.price) || PRICING.reportPrice;
  const included = Array.isArray(product.whatsIncluded)
    ? (product.whatsIncluded as string[])
    : ["Digital PDF report", "Dashboard access", "Interpretive guidance with clear disclaimers"];

  return (
    <div>
      <PageHero
        eyebrow={product.category?.name || "Astrology Report"}
        title={product.name}
        subtitle={product.shortDescription || undefined}
      >
        <p className="inline-flex items-center rounded-full bg-[var(--jk-gold)] px-4 py-1.5 text-sm font-bold text-[var(--jk-navy)]">
          {formatINR(price)}
        </p>
      </PageHero>

      <SectionShell muted>
        <nav className="mb-6 text-sm text-[var(--jk-muted)]">
          <Link href="/services" className="hover:text-[var(--jk-gold-dark)]">Services</Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/services?category=${product.category.slug}`} className="hover:text-[var(--jk-gold-dark)]">
                {product.category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Surface>
              <h2 className="font-display text-2xl font-semibold">About this report</h2>
              <p className="mt-3 text-sm leading-relaxed text-[var(--jk-muted)]">
                {product.description || product.shortDescription}
              </p>
              {product.deliveryNote && (
                <p className="mt-4 text-sm text-[var(--jk-ink)]">{product.deliveryNote}</p>
              )}
            </Surface>

            <Surface>
              <h2 className="font-display text-xl font-semibold">What&apos;s included</h2>
              <ul className="mt-4 space-y-3">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-[var(--jk-ink)]">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--jk-gold-dark)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </Surface>

            <Surface className="border-[var(--jk-gold)]/30 bg-[var(--jk-gold)]/5">
              <p className="text-sm leading-relaxed text-[var(--jk-muted)]">
                Astrology readings are interpretive and intended for personal reflection and entertainment.
                They should not be treated as certainty or professional advice.
              </p>
            </Surface>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <BirthDetailsForm productSlug={product.slug} productName={product.name} price={price} />
          </div>
        </div>
      </SectionShell>
    </div>
  );
}

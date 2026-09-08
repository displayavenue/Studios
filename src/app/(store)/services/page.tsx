import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServiceCard } from "@/components/site/service-card";
import { PageHero, SectionShell } from "@/components/site/page-chrome";
import { PRICING } from "@/config/site";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ServicesPage({ searchParams }: Props) {
  const { category: categorySlug } = await searchParams;

  let categories: Array<{ id: string; name: string; slug: string }> = [];
  let products: Array<{
    id: string;
    slug: string;
    name: string;
    shortDescription: string | null;
    price: unknown;
    category: { name: string; slug: string } | null;
  }> = [];

  try {
    [categories, products] = await Promise.all([
      prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
      prisma.product.findMany({
        where: {
          status: "PUBLISHED",
          isActive: true,
          isMembership: false,
          ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        },
        orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
        include: { category: true },
      }),
    ]);
  } catch {
    // DB unavailable — empty catalogue
  }

  return (
    <div>
      <PageHero
        eyebrow="Astrology Services"
        title="Explore all reports"
        subtitle={`Every individual report is ${formatINR(PRICING.reportPrice)}. Unique products by category — no overlapping duplicates.`}
      />

      <SectionShell muted>
        <div className="-mt-2 flex flex-wrap gap-2">
          <Link
            href="/services"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              !categorySlug
                ? "bg-[var(--jk-navy)] text-white"
                : "border border-[var(--jk-line)] bg-white text-[var(--jk-ink)] hover:border-[var(--jk-gold)]"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/services?category=${c.slug}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                categorySlug === c.slug
                  ? "bg-[var(--jk-navy)] text-white"
                  : "border border-[var(--jk-line)] bg-white text-[var(--jk-ink)] hover:border-[var(--jk-gold)]"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>

        <div className="service-grid mt-8">
          {products.length ? (
            products.map((p) => <ServiceCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-[var(--jk-line)] bg-white p-10 text-center">
              <p className="text-sm text-[var(--jk-muted)]">
                No services found{categorySlug ? " in this category" : ""}. Seed the database or try another filter.
              </p>
            </div>
          )}
        </div>
      </SectionShell>
    </div>
  );
}

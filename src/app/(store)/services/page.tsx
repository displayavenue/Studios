import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ServiceCard } from "@/components/site/service-card";
import { PRICING } from "@/config/site";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ServicesPage({ searchParams }: Props) {
  const { category: categorySlug } = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: {
        status: "PUBLISHED",
        isActive: true,
        isMembership: false,
        ...(categorySlug ? { category: { slug: categorySlug } } : {}),
      },
      orderBy: { sortOrder: "asc" },
      include: { category: true },
    }),
  ]);

  return (
    <div className="container-jk py-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">Astrology Services</h1>
        <p className="mt-3 text-[var(--jk-muted)]">
          Choose a report for {formatINR(PRICING.reportPrice)}. Each includes personalized interpretive content based on your birth details.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/services"
          className={`rounded-full px-4 py-1.5 text-sm ${!categorySlug ? "bg-[var(--jk-navy)] text-white" : "border border-[var(--jk-line)] bg-white"}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/services?category=${c.slug}`}
            className={`rounded-full px-4 py-1.5 text-sm ${categorySlug === c.slug ? "bg-[var(--jk-navy)] text-white" : "border border-[var(--jk-line)] bg-white"}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="service-grid mt-10">
        {products.length ? (
          products.map((p) => <ServiceCard key={p.id} product={p} />)
        ) : (
          <p className="text-sm text-[var(--jk-muted)]">No services found in this category.</p>
        )}
      </div>
    </div>
  );
}

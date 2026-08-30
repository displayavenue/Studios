import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/config/site";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [trending, bestSellers, newest, categories, highContribution] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED", visibleOnStore: true, trending: true },
      take: 8,
      include: { images: { where: { isPrimary: true }, take: 1 }, reviews: { where: { moderationStatus: "APPROVED" }, select: { rating: true } } },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", visibleOnStore: true, bestSeller: true },
      take: 8,
      include: { images: { where: { isPrimary: true }, take: 1 }, reviews: { where: { moderationStatus: "APPROVED" }, select: { rating: true } } },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", visibleOnStore: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { images: { where: { isPrimary: true }, take: 1 }, reviews: { where: { moderationStatus: "APPROVED" }, select: { rating: true } } },
    }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", visibleOnStore: true },
      orderBy: { contributionBeforeAds: "desc" },
      take: 4,
      include: { images: { where: { isPrimary: true }, take: 1 }, reviews: { where: { moderationStatus: "APPROVED" }, select: { rating: true } } },
    }),
  ]);

  return { trending, bestSellers, newest, categories, highContribution };
}

export default async function HomePage() {
  const data = await getHomeData();
  const heroImage =
    data.trending[0]?.primaryImageUrl ||
    data.trending[0]?.images[0]?.url ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600";

  return (
    <div className="grain">
      {/* Hero — full-bleed, brand-first */}
      <section className="relative min-h-[88vh] overflow-hidden">
        <Image
          src={heroImage}
          alt="VELORA curated products"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(28,25,21,0.72)] via-[rgba(28,25,21,0.45)] to-transparent" />
        <div className="container-velora relative flex min-h-[88vh] flex-col justify-end pb-16 pt-28 text-white md:justify-center md:pb-0">
          <p className="font-display text-5xl tracking-[0.18em] md:text-7xl">{BRAND.name}</p>
          <p className="mt-2 text-sm uppercase tracking-[0.28em] text-[#d9cbb6]">{BRAND.tagline}</p>
          <h1 className="mt-8 max-w-xl font-display text-3xl leading-tight md:text-5xl">
            Discover products that make life better.
          </h1>
          <p className="mt-4 max-w-md text-base text-[#e8dfd2] md:text-lg">
            Curated everyday products, smart finds and useful innovations delivered to your door.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="accent">
              <Link href="/shop?sort=trending">Shop Trending Products</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
              <Link href="/shop">Explore All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-velora py-16">
        <SectionHead title="Trending Products" href="/shop?sort=trending" />
        <ProductGrid products={data.trending} />
      </section>

      <section className="border-y border-[var(--velora-line)] bg-[rgba(255,252,247,0.5)] py-16">
        <div className="container-velora">
          <SectionHead title="Best Sellers" href="/shop?sort=best_selling" />
          <ProductGrid products={data.bestSellers} />
        </div>
      </section>

      <section className="container-velora py-16">
        <SectionHead title="Shop by Category" href="/categories" />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {data.categories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="group relative overflow-hidden rounded-lg bg-[var(--velora-sand)]/35 p-6 transition hover:bg-[var(--velora-sand)]/55"
            >
              <span className="font-display text-xl">{c.name}</span>
              <span className="mt-2 block text-xs text-[var(--velora-muted)] group-hover:text-[var(--velora-accent)]">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-velora py-16">
        <SectionHead title="Problem Solvers" href="/shop" subtitle="Practical products for everyday friction." />
        <ProductGrid products={data.highContribution} />
      </section>

      <section className="container-velora py-16">
        <SectionHead title="New Arrivals" href="/shop?sort=newest" />
        <ProductGrid products={data.newest} />
      </section>

      <section className="border-y border-[var(--velora-line)] py-20">
        <div className="container-velora max-w-3xl text-center">
          <h2 className="font-display text-3xl md:text-4xl">Why VELORA</h2>
          <p className="mt-4 text-[var(--velora-muted)]">
            We curate useful products, price for healthy contribution, and ship through verified logistics partners.
            Reviews come only from verified purchases — never fabricated social proof.
          </p>
          <div className="mt-10 grid gap-6 text-left md:grid-cols-3">
            {[
              ["Curated catalog", "Quality scoring before publish — not a dump of random SKUs."],
              ["Transparent pricing", "Landed cost and contribution informed — no fake discounts."],
              ["India-ready checkout", "Razorpay + COD where eligible, Shiprocket logistics ready."],
            ].map(([t, d]) => (
              <div key={t}>
                <h3 className="font-display text-xl">{t}</h3>
                <p className="mt-2 text-sm text-[var(--velora-muted)]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-velora py-16">
        <h2 className="font-display text-3xl">FAQ</h2>
        <div className="mt-6 divide-y divide-[var(--velora-line)]">
          {[
            ["Do you guarantee delivery times?", "We only show estimates supported by the shipping provider. Dates are not invented."],
            ["Are reviews real?", "Yes. Only customers who purchased a product can leave a review."],
            ["What payment methods are supported?", "Razorpay (UPI/cards/netbanking) and configurable COD where PIN-code eligible."],
          ].map(([q, a]) => (
            <details key={q} className="py-4">
              <summary className="cursor-pointer font-medium">{q}</summary>
              <p className="mt-2 text-sm text-[var(--velora-muted)]">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHead({
  title,
  href,
  subtitle,
}: {
  title: string;
  href: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm text-[var(--velora-muted)]">{subtitle}</p>}
      </div>
      <Link href={href} className="text-sm text-[var(--velora-accent)] hover:underline">
        View all
      </Link>
    </div>
  );
}

function ProductGrid({
  products,
}: {
  products: React.ComponentProps<typeof ProductCard>["product"][];
}) {
  if (!products.length) {
    return (
      <p className="mt-8 text-sm text-[var(--velora-muted)]">
        No products to show yet. Connect a supplier and publish approved products.
      </p>
    );
  }
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

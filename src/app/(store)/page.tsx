import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/config/site";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [trending, bestSellers, newest, categories, highContribution] = await Promise.all([
    prisma.product.findMany({
      where: { status: "PUBLISHED", visibleOnStore: true, trending: true },
      take: 12,
      include: { images: { where: { isPrimary: true }, take: 1 }, reviews: { where: { moderationStatus: "APPROVED" }, select: { rating: true } } },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", visibleOnStore: true, bestSeller: true },
      take: 12,
      include: { images: { where: { isPrimary: true }, take: 1 }, reviews: { where: { moderationStatus: "APPROVED" }, select: { rating: true } } },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", visibleOnStore: true },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { images: { where: { isPrimary: true }, take: 1 }, reviews: { where: { moderationStatus: "APPROVED" }, select: { rating: true } } },
    }),
    prisma.category.findMany({
      where: { isActive: true, parentId: null },
      orderBy: { sortOrder: "asc" },
      take: 12,
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED", visibleOnStore: true },
      orderBy: { contributionBeforeAds: "desc" },
      take: 6,
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
    <div>
      {/* Full-width hero banner */}
      <section className="relative w-full">
        <div className="relative aspect-[21/9] min-h-[220px] w-full overflow-hidden sm:min-h-[280px] lg:min-h-[360px]">
          <Image
            src={heroImage}
            alt="VELORA curated products"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
          <div className="container-velora absolute inset-0 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--velora-cta)] sm:text-sm">
              {BRAND.tagline}
            </p>
            <h1 className="mt-2 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Discover products that make life better
            </h1>
            <p className="mt-3 max-w-xl text-sm text-gray-200 sm:text-base">
              Curated everyday products, smart finds and useful innovations delivered to your door.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button asChild size="lg" className="bg-[var(--velora-cta)] text-[var(--velora-ink)] hover:bg-[var(--velora-cta-hover)]">
                <Link href="/shop?sort=trending">Shop Trending</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/50 bg-white/10 text-white hover:bg-white/20">
                <Link href="/shop">Explore All Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category strip — full width */}
      <section className="container-velora py-4">
        <div className="store-section">
          <SectionHead title="Shop by Category" href="/categories" compact />
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12">
            {data.categories.map((c) => (
              <Link
                key={c.id}
                href={`/categories/${c.slug}`}
                className="rounded border border-[var(--velora-line)] bg-[var(--velora-sand)] px-2 py-3 text-center text-xs font-medium transition hover:border-[var(--velora-accent)] hover:text-[var(--velora-accent)] sm:text-sm"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-velora pb-4">
        <div className="store-section">
          <SectionHead title="Trending Products" href="/shop?sort=trending" />
          <ProductGrid products={data.trending} />
        </div>
      </section>

      <section className="container-velora pb-4">
        <div className="store-section">
          <SectionHead title="Best Sellers" href="/shop?sort=best_selling" />
          <ProductGrid products={data.bestSellers} />
        </div>
      </section>

      <section className="container-velora pb-4">
        <div className="store-section">
          <SectionHead title="Problem Solvers" href="/shop" subtitle="Practical products for everyday friction." />
          <ProductGrid products={data.highContribution} />
        </div>
      </section>

      <section className="container-velora pb-4">
        <div className="store-section">
          <SectionHead title="New Arrivals" href="/shop?sort=newest" />
          <ProductGrid products={data.newest} />
        </div>
      </section>

      <section className="container-velora pb-6">
        <div className="store-section">
          <h2 className="text-xl font-bold sm:text-2xl">Why VELORA</h2>
          <p className="mt-2 text-sm text-[var(--velora-muted)]">
            We curate useful products, price for healthy contribution, and ship through verified logistics partners.
            Reviews come only from verified purchases — never fabricated social proof.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Curated catalog", "Quality scoring before publish — not a dump of random SKUs."],
              ["Transparent pricing", "Landed cost and contribution informed — no fake discounts."],
              ["India-ready checkout", "Razorpay + COD where eligible, Shiprocket logistics ready."],
            ].map(([t, d]) => (
              <div key={t} className="rounded border border-[var(--velora-line)] bg-[var(--velora-sand)] p-4">
                <h3 className="font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-[var(--velora-muted)]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-velora pb-8">
        <div className="store-section">
          <h2 className="text-xl font-bold">FAQ</h2>
          <div className="mt-4 divide-y divide-[var(--velora-line)]">
            {[
              ["Do you guarantee delivery times?", "We only show estimates supported by the shipping provider. Dates are not invented."],
              ["Are reviews real?", "Yes. Only customers who purchased a product can leave a review."],
              ["What payment methods are supported?", "Razorpay (UPI/cards/netbanking) and configurable COD where PIN-code eligible."],
            ].map(([q, a]) => (
              <details key={q} className="py-3">
                <summary className="cursor-pointer text-sm font-medium">{q}</summary>
                <p className="mt-2 text-sm text-[var(--velora-muted)]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHead({
  title,
  href,
  subtitle,
  compact,
}: {
  title: string;
  href: string;
  subtitle?: string;
  compact?: boolean;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-[var(--velora-line)] pb-2">
      <div>
        <h2 className={`font-bold ${compact ? "text-lg" : "text-xl sm:text-2xl"}`}>{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-[var(--velora-muted)]">{subtitle}</p>}
      </div>
      <Link href={href} className="shrink-0 text-sm text-[var(--velora-accent)] hover:underline">
        See all
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
      <p className="mt-4 text-sm text-[var(--velora-muted)]">
        No products to show yet. Connect a supplier and publish approved products.
      </p>
    );
  }
  return (
    <div className="product-grid-amazon mt-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

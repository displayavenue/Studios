import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatINR, toNumber } from "@/lib/utils";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { ProductCard } from "@/components/store/product-card";
import { BRAND } from "@/config/site";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: "PUBLISHED", visibleOnStore: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      videos: true,
      variants: true,
      category: true,
      reviews: {
        where: { moderationStatus: "APPROVED" },
        include: { user: { include: { profile: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.shortDescription || undefined,
    robots: product.seoIndexable ? "index,follow" : "noindex,nofollow",
    openGraph: {
      title: product.title,
      description: product.shortDescription || undefined,
      images: product.primaryImageUrl ? [product.primaryImageUrl] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const price = toNumber(product.sellingPrice);
  const compare = product.compareAtPrice ? toNumber(product.compareAtPrice) : 0;
  const savings = compare > price ? compare - price : 0;
  const avg =
    product.reviews.length > 0
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
      : null;

  const related = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      visibleOnStore: true,
      id: { not: product.id },
      OR: [
        { categoryId: product.categoryId ?? undefined },
        { eligibleForRecommendations: true },
      ],
    },
    take: 4,
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      reviews: { where: { moderationStatus: "APPROVED" }, select: { rating: true } },
    },
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.shortDescription,
    sku: product.sku,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    image: product.images.map((i) => i.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: price,
      availability:
        product.stockQuantity > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `https://${BRAND.domain}/products/${product.slug}`,
    },
  };

  return (
    <div className="container-velora py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 text-xs text-[var(--velora-muted)]" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link>
        {product.category && (
          <>
            {" / "}
            <Link href={`/categories/${product.category.slug}`}>{product.category.name}</Link>
          </>
        )}
        {" / "}
        <span>{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden bg-[var(--velora-sand)]/30">
            {(product.primaryImageUrl || product.images[0]?.url) && (
              <Image
                src={product.primaryImageUrl || product.images[0].url}
                alt={product.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((img) => (
                <div key={img.id} className="relative aspect-square overflow-hidden bg-[var(--velora-sand)]/20">
                  <Image src={img.url} alt={img.alt || product.title} fill className="object-cover" sizes="120px" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl md:text-4xl">{product.title}</h1>
          {product.brand && (
            <p className="mt-2 text-sm text-[var(--velora-muted)]">{product.brand}</p>
          )}
          {avg != null && (
            <p className="mt-2 text-sm">
              {avg.toFixed(1)} · {product.reviews.length} verified review
              {product.reviews.length === 1 ? "" : "s"}
            </p>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatINR(price)}</span>
            {savings > 0 && (
              <>
                <span className="text-lg text-[var(--velora-muted)] line-through">
                  {formatINR(compare)}
                </span>
                <span className="text-sm text-[var(--velora-accent)]">
                  Save {formatINR(savings)}
                </span>
              </>
            )}
          </div>

          <p className="mt-4 text-sm text-[var(--velora-muted)]">
            {product.stockQuantity > 0
              ? product.stockQuantity <= 5
                ? `Low stock — ${product.stockQuantity} left`
                : "In stock"
              : "Out of stock"}
          </p>

          <div className="mt-8 space-y-3">
            <AddToCartButton productId={product.id} size="lg" />
            <Link
              href={`/checkout?buy=${product.id}`}
              className="flex h-12 w-full items-center justify-center rounded-md border border-[var(--velora-ink)] text-sm font-medium"
            >
              Buy Now
            </Link>
          </div>

          {product.shortDescription && (
            <div className="mt-10">
              <h2 className="font-display text-xl">Overview</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--velora-muted)]">
                {product.shortDescription}
              </p>
            </div>
          )}

          {product.description && (
            <div className="mt-8">
              <h2 className="font-display text-xl">Description</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--velora-muted)]">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-8 space-y-2 text-sm text-[var(--velora-muted)]">
            <p>Shipping: Estimates shown at checkout based on PIN code serviceability.</p>
            <p>
              Returns: See{" "}
              <Link href="/legal/returns" className="underline">
                returns policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      {product.reviews.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl">Reviews</h2>
          <div className="mt-6 space-y-4">
            {product.reviews.map((r) => (
              <div key={r.id} className="border-b border-[var(--velora-line)] pb-4">
                <p className="text-sm font-medium">
                  {r.rating}/5 · {r.user.profile?.firstName || "Customer"}
                  {r.verifiedPurchase && (
                    <span className="ml-2 text-xs text-[var(--velora-accent)]">Verified purchase</span>
                  )}
                </p>
                {r.title && <p className="mt-1 text-sm font-medium">{r.title}</p>}
                {r.body && <p className="mt-1 text-sm text-[var(--velora-muted)]">{r.body}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-16">
        <h2 className="font-display text-2xl">Related Products</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-[var(--velora-line)] bg-[rgba(247,243,235,0.96)] p-3 md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1 font-semibold">{formatINR(price)}</div>
          <div className="w-40">
            <AddToCartButton productId={product.id} size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}

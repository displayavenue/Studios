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

function ProductBuyBox({
  product,
  price,
  compare,
  savings,
  avg,
}: {
  product: NonNullable<Awaited<ReturnType<typeof getProduct>>>;
  price: number;
  compare: number;
  savings: number;
  avg: number | null;
}) {
  return (
    <div className="store-section space-y-4 p-4 lg:sticky lg:top-36 lg:p-5">
      <div>
        <h1 className="text-xl font-normal leading-snug sm:text-2xl lg:text-2xl">{product.title}</h1>
        {product.brand && (
          <p className="mt-1 text-sm">
            Brand:{" "}
            <Link href={`/shop?q=${encodeURIComponent(product.brand)}`} className="text-[var(--velora-accent)] hover:underline">
              {product.brand}
            </Link>
          </p>
        )}
        {avg != null && (
          <p className="mt-2 text-sm">
            <span className="text-[var(--velora-accent)]">★ {avg.toFixed(1)}</span>
            {" · "}
            {product.reviews.length} verified review{product.reviews.length === 1 ? "" : "s"}
          </p>
        )}
      </div>

      <hr className="border-[var(--velora-line)]" />

      <div>
        {savings > 0 && (
          <p className="text-xs text-[#c45500]">
            -{Math.round((savings / compare) * 100)}% · Save {formatINR(savings)}
          </p>
        )}
        <div className="mt-1 flex flex-wrap items-baseline gap-2">
          <span className="text-3xl font-normal">{formatINR(price)}</span>
          {savings > 0 && (
            <span className="text-sm text-[var(--velora-muted)] line-through">
              M.R.P.: {formatINR(compare)}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-[var(--velora-muted)]">Inclusive of all taxes</p>
      </div>

      <div className="text-sm">
        {product.stockQuantity > 0 ? (
          product.stockQuantity <= 5 ? (
            <span className="font-semibold text-[#c45500]">Only {product.stockQuantity} left in stock</span>
          ) : (
            <span className="font-semibold text-[#007600]">In stock</span>
          )
        ) : (
          <span className="font-semibold text-[#c45500]">Currently unavailable</span>
        )}
      </div>

      <div className="space-y-2">
        <AddToCartButton
          productId={product.id}
          size="lg"
          className="w-full bg-[var(--velora-cta)] text-[var(--velora-ink)] hover:bg-[var(--velora-cta-hover)]"
        />
        <Link
          href={`/checkout?buy=${product.id}`}
          className="flex h-12 w-full items-center justify-center rounded-sm bg-[#ffd814] text-sm font-medium text-[var(--velora-ink)] hover:bg-[#f7ca00]"
        >
          Buy Now
        </Link>
      </div>

      <div className="space-y-2 border-t border-[var(--velora-line)] pt-4 text-xs text-[var(--velora-muted)]">
        <p>✓ Secure transaction</p>
        <p>✓ Shipping estimates at checkout based on PIN code</p>
        <p>
          ✓ Returns: See{" "}
          <Link href="/legal/returns" className="text-[var(--velora-accent)] hover:underline">
            returns policy
          </Link>
        </p>
      </div>
    </div>
  );
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
    take: 6,
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

  const mainImage = product.primaryImageUrl || product.images[0]?.url;

  return (
    <div className="pb-6 lg:pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-velora pt-2 lg:pt-4">
        <nav className="mb-2 truncate text-xs text-[var(--velora-muted)] lg:mb-3" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--velora-accent)] hover:underline">Home</Link>
          {" › "}
          <Link href="/shop" className="hover:text-[var(--velora-accent)] hover:underline">Shop</Link>
          {product.category && (
            <>
              {" › "}
              <Link href={`/categories/${product.category.slug}`} className="hover:text-[var(--velora-accent)] hover:underline">
                {product.category.name}
              </Link>
            </>
          )}
          <span className="hidden sm:inline">
            {" › "}
            <span className="text-[var(--velora-ink)]">{product.title}</span>
          </span>
        </nav>
      </div>

      {/* Mobile: edge-to-edge image */}
      <div className="bg-white lg:hidden">
        <div className="relative aspect-square w-full">
          {mainImage && (
            <Image
              src={mainImage}
              alt={product.title}
              fill
              priority
              className="object-contain p-2 sm:p-4"
              sizes="100vw"
            />
          )}
        </div>
        {product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto px-3 pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {product.images.slice(0, 6).map((img) => (
              <div
                key={img.id}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-[var(--velora-line)] bg-white"
              >
                <Image src={img.url} alt={img.alt || product.title} fill className="object-contain p-1" sizes="64px" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="container-velora">
        <div className="grid gap-4 lg:grid-cols-[72px_minmax(0,1fr)_340px] xl:grid-cols-[80px_minmax(0,1fr)_380px]">
          {/* Desktop thumbnails */}
          {product.images.length > 1 && (
            <div className="hidden flex-col gap-2 lg:flex">
              {product.images.slice(0, 6).map((img) => (
                <div
                  key={img.id}
                  className="relative h-[72px] w-[72px] overflow-hidden rounded border border-[var(--velora-line)] bg-white xl:h-20 xl:w-20"
                >
                  <Image src={img.url} alt={img.alt || product.title} fill className="object-contain p-1" sizes="80px" />
                </div>
              ))}
            </div>
          )}

          {/* Desktop main image */}
          <div className="hidden lg:block">
            <div className="store-section p-4">
              <div className="relative aspect-square w-full overflow-hidden bg-white">
                {mainImage && (
                  <Image
                    src={mainImage}
                    alt={product.title}
                    fill
                    priority
                    className="object-contain p-6"
                    sizes="(max-width:1280px) 50vw, 40vw"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Buy box — after image on mobile, right column on desktop */}
          <div className="lg:col-start-3 lg:row-span-2">
            <ProductBuyBox product={product} price={price} compare={compare} savings={savings} avg={avg} />
          </div>
          <div className={`space-y-4 ${product.images.length > 1 ? "lg:col-span-2" : "lg:col-span-1 lg:col-start-2"}`}>
            {product.shortDescription && (
              <div className="store-section">
                <h2 className="text-lg font-bold">About this item</h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--velora-muted)]">
                  {product.shortDescription}
                </p>
              </div>
            )}

            {product.description && (
              <div className="store-section">
                <h2 className="text-lg font-bold">Product description</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--velora-muted)]">
                  {product.description}
                </p>
              </div>
            )}

            <div className="store-section text-sm text-[var(--velora-muted)]">
              <h2 className="text-lg font-bold text-[var(--velora-ink)]">Shipping & returns</h2>
              <p className="mt-3">Shipping: Estimates shown at checkout based on PIN code serviceability.</p>
              <p className="mt-2">
                Returns: See{" "}
                <Link href="/legal/returns" className="text-[var(--velora-accent)] hover:underline">
                  returns policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        {product.reviews.length > 0 && (
          <section className="mt-4 lg:mt-6">
            <div className="store-section">
              <h2 className="text-xl font-bold">Customer reviews</h2>
              <div className="mt-4 space-y-4">
                {product.reviews.map((r) => (
                  <div key={r.id} className="border-b border-[var(--velora-line)] pb-4 last:border-0">
                    <p className="text-sm">
                      <span className="text-[var(--velora-accent)]">★ {r.rating}/5</span>
                      {" · "}
                      <span className="font-medium">{r.user.profile?.firstName || "Customer"}</span>
                      {r.verifiedPurchase && (
                        <span className="ml-2 text-xs text-[var(--velora-accent)]">Verified purchase</span>
                      )}
                    </p>
                    {r.title && <p className="mt-1 text-sm font-semibold">{r.title}</p>}
                    {r.body && <p className="mt-1 text-sm text-[var(--velora-muted)]">{r.body}</p>}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="mt-4 pb-4 lg:mt-6">
          <div className="store-section">
            <h2 className="text-xl font-bold">Customers also viewed</h2>
            <div className="product-grid-amazon mt-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

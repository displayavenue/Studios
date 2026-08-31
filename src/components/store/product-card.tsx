import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { formatINR, toNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/input";
import { AddToCartButton } from "@/components/store/add-to-cart-button";

export type ProductCardData = {
  id: string;
  slug: string;
  title: string;
  sellingPrice: unknown;
  compareAtPrice?: unknown;
  primaryImageUrl?: string | null;
  bestSeller?: boolean;
  trending?: boolean;
  newProduct?: boolean;
  stockQuantity?: number;
  images?: Array<{ url: string }>;
  reviews?: Array<{ rating: number }>;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const price = toNumber(product.sellingPrice);
  const compare = product.compareAtPrice ? toNumber(product.compareAtPrice) : 0;
  const savings = compare > price ? Math.round(((compare - price) / compare) * 100) : 0;
  const img = product.primaryImageUrl || product.images?.[0]?.url;
  const ratings = product.reviews || [];
  const avg =
    ratings.length > 0
      ? ratings.reduce((s, r) => s + r.rating, 0) / ratings.length
      : null;

  return (
    <article className="group flex h-full flex-col rounded border border-[var(--velora-line)] bg-white p-2 transition hover:shadow-md sm:p-3">
      <div className="relative aspect-square overflow-hidden bg-white">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {img ? (
            <Image
              src={img}
              alt={product.title}
              fill
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 16vw"
              className="object-contain p-1 transition duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[var(--velora-muted)]">
              No image
            </div>
          )}
        </Link>
        <div className="absolute left-1 top-1 flex flex-col gap-0.5">
          {product.bestSeller && <Badge className="text-[10px]">Best Seller</Badge>}
          {product.trending && !product.bestSeller && (
            <Badge className="bg-[var(--velora-accent)] text-[10px]">Trending</Badge>
          )}
          {product.newProduct && !product.bestSeller && !product.trending && (
            <Badge className="bg-[var(--velora-ink-soft)] text-[10px]">New</Badge>
          )}
          {product.stockQuantity != null &&
            product.stockQuantity > 0 &&
            product.stockQuantity <= 5 && (
              <Badge className="bg-[#c45500] text-[10px]">Low Stock</Badge>
            )}
        </div>
        <button
          className="absolute right-1 top-1 rounded-full border border-[var(--velora-line)] bg-white p-1.5 opacity-0 shadow-sm transition group-hover:opacity-100"
          aria-label="Add to wishlist"
          type="button"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex flex-1 flex-col pt-2">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 text-xs leading-snug text-[var(--velora-ink)] hover:text-[var(--velora-accent)] sm:text-sm"
        >
          {product.title}
        </Link>
        {avg != null && (
          <p className="mt-1 text-[11px] text-[var(--velora-muted)] sm:text-xs">
            ★ {avg.toFixed(1)} · {ratings.length} review{ratings.length === 1 ? "" : "s"}
          </p>
        )}
        <div className="mt-1.5 flex flex-wrap items-baseline gap-1">
          <span className="text-sm font-semibold sm:text-base">{formatINR(price)}</span>
          {savings > 0 && (
            <>
              <span className="text-xs text-[var(--velora-muted)] line-through">
                {formatINR(compare)}
              </span>
              <span className="text-[11px] text-[#c45500]">-{savings}%</span>
            </>
          )}
        </div>
        <div className="mt-auto pt-2">
          <AddToCartButton productId={product.id} size="sm" className="w-full text-xs" />
        </div>
      </div>
    </article>
  );
}

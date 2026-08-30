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
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--velora-sand)]/40">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {img ? (
            <Image
              src={img}
              alt={product.title}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[var(--velora-muted)]">
              No image
            </div>
          )}
        </Link>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.bestSeller && <Badge>Best Seller</Badge>}
          {product.trending && !product.bestSeller && (
            <Badge className="bg-[var(--velora-accent)]">Trending</Badge>
          )}
          {product.newProduct && !product.bestSeller && !product.trending && (
            <Badge className="bg-[var(--velora-ink-soft)]">New</Badge>
          )}
          {product.stockQuantity != null &&
            product.stockQuantity > 0 &&
            product.stockQuantity <= 5 && (
              <Badge className="bg-[#8a4b2e]">Low Stock</Badge>
            )}
        </div>
        <button
          className="absolute right-2 top-2 rounded-full bg-white/90 p-2 opacity-0 transition group-hover:opacity-100"
          aria-label="Add to wishlist"
          type="button"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <Link href={`/products/${product.slug}`} className="line-clamp-2 text-sm font-medium leading-snug">
          {product.title}
        </Link>
        {avg != null && (
          <p className="mt-1 text-xs text-[var(--velora-muted)]">
            {avg.toFixed(1)} · {ratings.length} review{ratings.length === 1 ? "" : "s"}
          </p>
        )}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-base font-semibold">{formatINR(price)}</span>
          {savings > 0 && (
            <>
              <span className="text-sm text-[var(--velora-muted)] line-through">
                {formatINR(compare)}
              </span>
              <span className="text-xs text-[var(--velora-accent)]">{savings}% off</span>
            </>
          )}
        </div>
        <div className="mt-3">
          <AddToCartButton productId={product.id} size="sm" />
        </div>
      </div>
    </article>
  );
}

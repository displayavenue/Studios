import Link from "next/link";
import { formatINR } from "@/lib/utils";
import { PRICING } from "@/config/site";

export type ServiceCardData = {
  id: string;
  slug: string;
  name: string;
  shortDescription?: string | null;
  price?: unknown;
  category?: { name: string; slug: string } | null;
};

export function ServiceCard({ product }: { product: ServiceCardData }) {
  const price = product.price != null ? Number(product.price) : PRICING.reportPrice;

  return (
    <Link
      href={`/services/${product.slug}`}
      className="group flex flex-col rounded-xl border border-[var(--jk-line)] bg-white p-5 transition hover:border-[var(--jk-gold)] hover:shadow-md"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--jk-navy)]/5 text-[var(--jk-gold)]">
        <span className="font-display text-xl">☉</span>
      </div>
      {product.category && (
        <p className="text-xs uppercase tracking-wider text-[var(--jk-purple)]">{product.category.name}</p>
      )}
      <h3 className="mt-1 font-display text-lg font-semibold group-hover:text-[var(--jk-midnight)]">
        {product.name}
      </h3>
      <p className="mt-2 flex-1 text-sm text-[var(--jk-muted)] line-clamp-2">
        {product.shortDescription || "Personalized interpretive report based on your birth details."}
      </p>
      <p className="mt-4 text-sm font-semibold text-[var(--jk-navy)]">
        {formatINR(price)}
        <span className="ml-1 text-xs font-normal text-[var(--jk-muted)]">per report</span>
      </p>
    </Link>
  );
}

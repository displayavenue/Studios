import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

const CATEGORY_COLORS: Record<string, string> = {
  kundali: "bg-violet-100 text-violet-600",
  marriage: "bg-pink-100 text-pink-600",
  career: "bg-blue-100 text-blue-600",
  wealth: "bg-amber-100 text-amber-700",
  dosha: "bg-orange-100 text-orange-600",
  "self-discovery": "bg-fuchsia-100 text-fuchsia-600",
  numerology: "bg-indigo-100 text-indigo-600",
  "daily-astrology": "bg-sky-100 text-sky-600",
};

export function ServiceCard({ product }: { product: ServiceCardData }) {
  const price = product.price != null ? Number(product.price) : PRICING.reportPrice;
  const color = CATEGORY_COLORS[product.category?.slug || ""] || "bg-violet-100 text-violet-600";

  return (
    <Link
      href={`/services/${product.slug}`}
      className="group flex flex-col rounded-2xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold ${color}`}>
        ✧
      </span>
      {product.category && (
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--jk-muted)]">
          {product.category.name}
        </p>
      )}
      <h3 className="mt-1 text-base font-semibold text-[var(--jk-ink)] group-hover:text-[var(--jk-midnight)]">
        {product.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--jk-muted)] line-clamp-2">
        {product.shortDescription || "Personalized interpretive report based on your birth details."}
      </p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-bold text-[var(--jk-ink)]">{formatINR(price)}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[var(--jk-ink)] transition group-hover:bg-[var(--jk-gold)]">
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

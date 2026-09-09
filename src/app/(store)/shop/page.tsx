import Link from "next/link";
import { listMallItems, MALL_CATEGORIES } from "@/content/astromall";

export const metadata = {
  title: "AstroMall",
  description: "Gemstones, yantras, and puja kits — JyotishKundali AstroMall.",
};

type Props = { searchParams: Promise<{ category?: string }> };

export default async function ShopPage({ searchParams }: Props) {
  const sp = await searchParams;
  const category = sp.category || "all";
  const items = listMallItems(category === "all" ? null : category);

  return (
    <div className="at-home min-h-screen">
      <div className="container-jk py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Shop</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Astro<span className="text-[var(--at-yellow-ink)]">Mall</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--jk-muted)]">
          Remedy-style products for reflective practice. Symbolic only — not medical, financial, or guaranteed outcomes.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/shop"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              category === "all" ? "bg-[var(--at-yellow)]" : "border border-[var(--jk-line)] bg-white"
            }`}
          >
            All
          </Link>
          {MALL_CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={`/shop?category=${c.key}`}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                category === c.key ? "bg-[var(--at-yellow)]" : "border border-[var(--jk-line)] bg-white"
              }`}
            >
              {c.title}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <Link key={item.slug} href={`/shop/${item.slug}`} className="at-card flex flex-col p-4 transition hover:-translate-y-0.5">
              <div
                className="flex h-28 items-center justify-center rounded-xl text-3xl font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${item.accent}, #1f2937)` }}
              >
                ✦
              </div>
              <p className="mt-3 text-xs uppercase tracking-wide text-[var(--jk-muted)]">{item.category}</p>
              <h2 className="mt-1 font-semibold leading-snug">{item.name}</h2>
              <p className="mt-2 flex-1 text-xs text-[var(--jk-muted)] line-clamp-2">{item.short}</p>
              <p className="mt-3 text-sm font-bold">₹{item.priceInr.toLocaleString("en-IN")}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

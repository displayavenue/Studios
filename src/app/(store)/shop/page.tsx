import Link from "next/link";
import { searchProducts } from "@/services/product/service";
import { ProductCard } from "@/components/store/product-card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const q = sp.q;
  const sort = sp.sort || "relevance";
  const page = Number(sp.page || 1);
  const categorySlug = sp.category;

  const result = await searchProducts({
    q,
    sort: sort === "trending" ? "score" : sort,
    page,
    pageSize: 24,
    categorySlug,
    storefront: true,
  });

  if (q) {
    await prisma.searchQuery.create({
      data: { query: q, resultCount: result.total },
    });
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { name: "asc" },
  });

  return (
    <div className="container-velora py-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-display text-4xl">Shop</h1>
          <p className="mt-2 text-sm text-[var(--velora-muted)]">
            {result.total} product{result.total === 1 ? "" : "s"}
            {q ? ` for “${q}”` : ""}
          </p>
        </div>
        <form className="flex flex-wrap gap-2">
          {q && <input type="hidden" name="q" value={q} />}
          <select
            name="sort"
            defaultValue={sort}
            className="h-10 rounded-md border border-[var(--velora-line)] bg-white px-3 text-sm"
            aria-label="Sort products"
          >
            <option value="relevance">Relevance</option>
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="best_selling">Best Selling</option>
            <option value="contribution">Highest Contribution</option>
          </select>
          <button className="h-10 rounded-md bg-[var(--velora-ink)] px-4 text-sm text-white">Apply</button>
        </form>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--velora-muted)]">
            Categories
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/shop" className={!categorySlug ? "text-[var(--velora-accent)]" : ""}>
                All
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  className={categorySlug === c.slug ? "text-[var(--velora-accent)]" : ""}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {!result.items.length ? (
            <div className="rounded-lg border border-[var(--velora-line)] bg-white/50 p-10 text-center">
              <h2 className="font-display text-2xl">No products found.</h2>
              <p className="mt-2 text-sm text-[var(--velora-muted)]">
                We don’t pretend the exact product exists. Try related categories or trending items.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link href="/categories" className="text-[var(--velora-accent)] underline">
                  Browse categories
                </Link>
                <Link href="/shop?sort=trending" className="text-[var(--velora-accent)] underline">
                  Trending products
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {result.items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {result.totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/shop?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}${categorySlug ? `&category=${categorySlug}` : ""}&sort=${sort}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-md text-sm ${
                    p === result.page ? "bg-[var(--velora-ink)] text-white" : "border border-[var(--velora-line)]"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

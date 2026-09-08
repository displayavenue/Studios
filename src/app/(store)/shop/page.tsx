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
    pageSize: 48,
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
    <div className="container-velora py-4">
      <div className="store-section mb-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Shop</h1>
            <p className="mt-1 text-sm text-[var(--velora-muted)]">
              {result.total} result{result.total === 1 ? "" : "s"}
              {q ? ` for “${q}”` : ""}
            </p>
          </div>
          <form className="flex flex-wrap gap-2">
            {q && <input type="hidden" name="q" value={q} />}
            <select
              name="sort"
              defaultValue={sort}
              className="h-9 rounded-sm border border-[var(--velora-line)] bg-white px-3 text-sm"
              aria-label="Sort products"
            >
              <option value="relevance">Featured</option>
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="best_selling">Best Selling</option>
              <option value="contribution">Highest Contribution</option>
            </select>
            <button className="h-9 rounded-sm bg-[var(--velora-cta)] px-4 text-sm font-medium text-[var(--velora-ink)] hover:bg-[var(--velora-cta-hover)]">
              Sort
            </button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="store-section h-fit lg:sticky lg:top-36">
          <h2 className="text-sm font-bold uppercase tracking-wide text-[var(--velora-muted)]">
            Departments
          </h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            <li>
              <Link
                href="/shop"
                className={`block rounded px-2 py-1 hover:bg-[var(--velora-sand)] ${!categorySlug ? "font-semibold text-[var(--velora-accent)]" : ""}`}
              >
                All Products
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  className={`block rounded px-2 py-1 hover:bg-[var(--velora-sand)] ${categorySlug === c.slug ? "font-semibold text-[var(--velora-accent)]" : ""}`}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          {!result.items.length ? (
            <div className="store-section p-10 text-center">
              <h2 className="text-xl font-bold">No products found</h2>
              <p className="mt-2 text-sm text-[var(--velora-muted)]">
                We don’t pretend the exact product exists. Try related categories or trending items.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
                <Link href="/categories" className="text-[var(--velora-accent)] hover:underline">
                  Browse categories
                </Link>
                <Link href="/shop?sort=trending" className="text-[var(--velora-accent)] hover:underline">
                  Trending products
                </Link>
              </div>
            </div>
          ) : (
            <div className="product-grid-amazon">
              {result.items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {result.totalPages > 1 && (
            <div className="mt-6 flex flex-wrap justify-center gap-1">
              {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/shop?page=${p}${q ? `&q=${encodeURIComponent(q)}` : ""}${categorySlug ? `&category=${categorySlug}` : ""}&sort=${sort}`}
                  className={`flex h-9 min-w-9 items-center justify-center rounded-sm px-2 text-sm ${
                    p === result.page
                      ? "bg-[var(--velora-cta)] font-semibold text-[var(--velora-ink)]"
                      : "border border-[var(--velora-line)] bg-white hover:bg-[var(--velora-sand)]"
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

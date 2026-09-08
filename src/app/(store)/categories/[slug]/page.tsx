import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { searchProducts } from "@/services/product/service";
import { ProductCard } from "@/components/store/product-card";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();
  const result = await searchProducts({
    categorySlug: slug,
    page: Number(sp.page || 1),
    pageSize: 24,
    sort: sp.sort || "relevance",
    storefront: true,
  });
  return (
    <div className="container-velora py-4">
      <div className="store-section mb-4">
        <h1 className="text-2xl font-bold sm:text-3xl">{category.name}</h1>
        <p className="mt-1 text-sm text-[var(--velora-muted)]">{result.total} products</p>
      </div>
      <div className="product-grid-amazon">
        {result.items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}

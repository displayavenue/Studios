import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true, parentId: null },
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return (
    <div className="container-velora py-12">
      <h1 className="font-display text-4xl">Categories</h1>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Link key={c.id} href={`/categories/${c.slug}`} className="rounded-lg border border-[var(--velora-line)] bg-white/50 p-6 hover:border-[var(--velora-accent)]">
            <h2 className="font-display text-2xl">{c.name}</h2>
            <p className="mt-2 text-sm text-[var(--velora-muted)]">{c._count.products} products · target ~{c.targetCount || "—"}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

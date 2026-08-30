import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatINR, toNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage({
  searchParams,
}: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const where: Record<string, unknown> = {};
  if (sp.status) where.status = sp.status;
  if (sp.q) where.OR = [
    { title: { contains: sp.q, mode: "insensitive" } },
    { sku: { contains: sp.q, mode: "insensitive" } },
  ];
  const products = await prisma.product.findMany({
    where, orderBy: { updatedAt: "desc" }, take: 50,
    include: { category: true, supplier: true },
  });
  const total = await prisma.product.count({ where });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-white">Products</h1>
          <p className="mt-1 text-sm text-[#8fa396]">{total} products · paginated (never load all 5,000+)</p>
        </div>
        <Link href="/admin/product-import" className="rounded-md bg-emerald-600 px-4 py-2 text-sm">Import</Link>
      </div>
      <form className="mt-6 flex flex-wrap gap-2">
        <input name="q" defaultValue={sp.q} placeholder="Search" className="h-10 rounded-md border border-white/10 bg-black/20 px-3 text-sm" />
        <select name="status" defaultValue={sp.status || ""} className="h-10 rounded-md border border-white/10 bg-black/20 px-3 text-sm">
          <option value="">All statuses</option>
          {["DRAFT","PENDING_REVIEW","APPROVED","PUBLISHED","UNPUBLISHED","OUT_OF_STOCK","PRICE_REVIEW","ARCHIVED"].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button className="h-10 rounded-md border border-white/15 px-4 text-sm">Filter</button>
      </form>
      <div className="mt-6 overflow-x-auto admin-panel">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-[#8fa396]">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Contribution</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Tier</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-white/5">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{p.title}</div>
                  <div className="text-xs text-[#6f7f74]">{p.supplier?.name} · {p.demo ? "DEMO" : "LIVE"}</div>
                </td>
                <td className="px-4 py-3">{p.sku}</td>
                <td className="px-4 py-3">{formatINR(toNumber(p.sellingPrice))}</td>
                <td className="px-4 py-3">{formatINR(toNumber(p.contributionBeforeAds))}</td>
                <td className="px-4 py-3">{p.productScore.toFixed(1)}</td>
                <td className="px-4 py-3">{p.stockQuantity}</td>
                <td className="px-4 py-3">{p.status}</td>
                <td className="px-4 py-3 text-xs">{p.tier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

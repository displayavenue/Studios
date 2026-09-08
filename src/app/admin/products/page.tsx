import { prisma } from "@/lib/prisma";
import { formatINR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: { category: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl text-[var(--jk-ivory)]">Products</h1>
      <div className="admin-panel overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-[var(--jk-ivory)]/60">
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Type</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="p-3">{p.name}</td>
                <td className="p-3">{p.category.name}</td>
                <td className="p-3">{formatINR(Number(p.price))}</td>
                <td className="p-3">{p.status}</td>
                <td className="p-3">{p.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

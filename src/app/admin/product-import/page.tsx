import { prisma } from "@/lib/prisma";
import { ImportControls } from "./import-controls";

export const dynamic = "force-dynamic";

export default async function ProductImportPage() {
  const suppliers = await prisma.supplier.findMany({ where: { status: "CONNECTED" } });
  const jobs = await prisma.importJob.findMany({ orderBy: { createdAt: "desc" }, take: 10, include: { supplier: true } });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-white">Product Import</h1>
        <p className="mt-2 text-sm text-[#8fa396]">
          Batched queue import — never one giant synchronous 5,000-product request. Import only from connected legitimate sources.
        </p>
      </div>
      <ImportControls suppliers={suppliers.map((s) => ({ id: s.id, name: s.name }))} />
      <div className="admin-panel p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8fa396]">Recent jobs</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs text-[#8fa396]">
              <tr>
                <th className="py-2">Supplier</th>
                <th>Status</th>
                <th>Imported</th>
                <th>Skipped</th>
                <th>Duplicates</th>
                <th>Failed</th>
                <th>Pending</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j.id} className="border-t border-white/5">
                  <td className="py-2">{j.supplier?.name || "—"}</td>
                  <td>{j.status}</td>
                  <td>{j.imported}</td>
                  <td>{j.skipped}</td>
                  <td>{j.duplicates}</td>
                  <td>{j.failed}</td>
                  <td>{j.pending}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

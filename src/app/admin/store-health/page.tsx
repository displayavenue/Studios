import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function StoreHealthPage() {
  const checks = await prisma.storeHealthCheck.findMany({ orderBy: { component: "asc" } });
  return (
    <div>
      <h1 className="font-display text-3xl text-white">Store Health</h1>
      <div className="mt-6 space-y-3">
        {checks.map((c) => (
          <div key={c.id} className="admin-panel p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">{c.component}</span>
              <span className={c.status === "HEALTHY" ? "text-emerald-400" : c.status === "WARNING" ? "text-amber-300" : "text-rose-300"}>{c.status}</span>
            </div>
            {c.problem && <p className="mt-2 text-[#c5d0c8]">Problem: {c.problem}</p>}
            {c.impact && <p className="text-[#8fa396]">Impact: {c.impact}</p>}
            {c.action && <p className="text-emerald-400/80">Action: {c.action}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

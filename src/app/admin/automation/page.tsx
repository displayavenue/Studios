import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AutomationPage() {
  const mode = await prisma.setting.findUnique({ where: { key: "automation.mode" } });
  const jobs = await prisma.automationJob.findMany({ orderBy: { createdAt: "desc" }, take: 20 });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">Automation</h1>
        <p className="mt-2 text-sm text-[#8fa396]">
          Mode: <strong>{String(mode?.value || "MANUAL")}</strong>. Default MANUAL/ASSISTED. Autopilot must never spend unlimited money.
        </p>
      </div>
      <div className="admin-panel p-5 text-sm">
        <h2 className="text-[#8fa396]">Safety limits required before autopilot marketing changes</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-[#c5d0c8]">
          <li>Daily spend cap</li>
          <li>Maximum % budget increase</li>
          <li>Maximum CAC</li>
          <li>Minimum contribution</li>
          <li>Minimum inventory / max return / max RTO</li>
        </ul>
      </div>
      <div className="admin-panel overflow-x-auto p-5">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-[#8fa396]"><tr><th className="py-2">Type</th><th>Status</th><th>Attempts</th><th>Created</th></tr></thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-white/5">
                <td className="py-2">{j.type}</td>
                <td>{j.status}</td>
                <td>{j.attempts}/{j.maxAttempts}</td>
                <td>{j.createdAt.toISOString().slice(0, 16)}</td>
              </tr>
            ))}
            {!jobs.length && <tr><td colSpan={4} className="py-4 text-[#8fa396]">No jobs yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

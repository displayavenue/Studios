import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany({ orderBy: { key: "asc" } });
  const target = await prisma.target.findFirst({ where: { isActive: true } });
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl text-white">Business Settings</h1>
      <div className="admin-panel p-5 text-sm">
        <h2 className="text-[#8fa396]">Targets</h2>
        <p className="mt-2">Daily revenue: ₹{String(target?.dailyRevenueTarget)}</p>
        <p>Daily contribution: ₹{String(target?.dailyContributionTarget)}</p>
        <p>Min/Max selling price: ₹{String(target?.minSellingPrice)} – ₹{String(target?.maxSellingPrice)}</p>
        <p>Min margin: {target?.minMarginPercent}%</p>
      </div>
      <div className="admin-panel overflow-x-auto p-5">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-[#8fa396]"><tr><th className="py-2">Key</th><th>Value</th></tr></thead>
          <tbody>
            {settings.map((s) => (
              <tr key={s.id} className="border-t border-white/5">
                <td className="py-2">{s.key}</td>
                <td className="font-mono text-xs">{JSON.stringify(s.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

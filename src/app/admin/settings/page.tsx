import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await prisma.systemSetting.findMany({ orderBy: { key: "asc" }, take: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[var(--jk-ivory)]">Settings</h1>
        <p className="mt-2 text-sm text-[var(--jk-ivory)]/60">
          SystemSetting rows. Edit marketplace content under Content & banners. Env secrets stay in Vercel.
        </p>
      </div>
      <div className="admin-panel overflow-x-auto p-4">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-[var(--jk-ivory)]/50">
            <tr>
              <th className="px-2 py-2">Key</th>
              <th className="px-2 py-2">Group</th>
              <th className="px-2 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s) => (
              <tr key={s.id} className="border-t border-white/10 align-top">
                <td className="px-2 py-2 font-mono text-xs">{s.key}</td>
                <td className="px-2 py-2 text-xs">{s.group || "—"}</td>
                <td className="px-2 py-2 font-mono text-[11px] text-[var(--jk-ivory)]/70">
                  {JSON.stringify(s.value)}
                </td>
              </tr>
            ))}
            {!settings.length && (
              <tr>
                <td colSpan={3} className="px-2 py-8 text-center text-[var(--jk-ivory)]/40">
                  No settings yet — save ticker/announcement from Content.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

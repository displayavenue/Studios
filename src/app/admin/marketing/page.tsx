import { formatINR } from "@/lib/utils";

export default function MarketingPage() {
  const channels = ["Meta", "Google Shopping", "Google Search", "Retargeting", "Organic", "Email", "Direct"];
  return (
    <div>
      <h1 className="font-display text-3xl text-white">Advertising Strategy</h1>
      <p className="mt-2 text-sm text-[#8fa396]">Rank channels by net contribution — not revenue alone. Metrics show INSUFFICIENT DATA until connected.</p>
      <div className="mt-6 overflow-x-auto admin-panel">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase text-[#8fa396]">
            <tr>
              <th className="px-4 py-3">Channel</th>
              <th className="px-4 py-3">Spend</th>
              <th className="px-4 py-3">Revenue</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">CAC</th>
              <th className="px-4 py-3">ROAS</th>
              <th className="px-4 py-3">Net contribution</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((c) => (
              <tr key={c} className="border-t border-white/5">
                <td className="px-4 py-3 text-white">{c}</td>
                <td className="px-4 py-3">{formatINR(0)}</td>
                <td className="px-4 py-3">{formatINR(0)}</td>
                <td className="px-4 py-3">0</td>
                <td className="px-4 py-3">—</td>
                <td className="px-4 py-3">—</td>
                <td className="px-4 py-3">INSUFFICIENT DATA</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";
import { useMemo, useState } from "react";
import { formatINR } from "@/lib/utils";

export default function ProfitPlannerPage() {
  const [revenueTarget, setRevenueTarget] = useState(100000);
  const [contributionTarget, setContributionTarget] = useState(10000);
  const [aov, setAov] = useState(2500);
  const [conversion, setConversion] = useState(2);

  const plan = useMemo(() => {
    const requiredOrders = aov > 0 ? Math.ceil(revenueTarget / aov) : 0;
    const requiredVisitors = conversion > 0 ? Math.ceil(requiredOrders / (conversion / 100)) : null;
    const contributionPerOrder = requiredOrders > 0 ? contributionTarget / requiredOrders : 0;
    return {
      requiredOrders,
      requiredVisitors,
      contributionPerOrder: Math.round(contributionPerOrder),
      maximumCac: Math.round(contributionPerOrder),
      targetCac: Math.round(contributionPerOrder * 0.5),
      warningCac: Math.round(contributionPerOrder * 0.75),
      note: "SIMULATION — planning helper only. Example: ₹1L / ₹2500 AOV = 40 orders. ₹300 contrib/order = ₹12k; ₹150 = ₹6k.",
    };
  }, [revenueTarget, contributionTarget, aov, conversion]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">Profit Planner</h1>
        <p className="mt-2 text-sm text-amber-300/90">{plan.note}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["Revenue target", revenueTarget, setRevenueTarget],
          ["Contribution target", contributionTarget, setContributionTarget],
          ["AOV", aov, setAov],
          ["Conversion %", conversion, setConversion],
        ].map(([label, value, set]) => (
          <label key={label as string} className="admin-panel block p-4 text-sm">
            <span className="text-[#8fa396]">{label as string}</span>
            <input type="number" value={value as number} onChange={(e) => (set as (n: number) => void)(Number(e.target.value))}
              className="mt-2 h-10 w-full rounded-md border border-white/10 bg-black/20 px-3" />
          </label>
        ))}
      </div>
      <div className="admin-panel grid gap-3 p-5 text-sm sm:grid-cols-2">
        <div>Required orders: <strong>{plan.requiredOrders}</strong></div>
        <div>Required visitors: <strong>{plan.requiredVisitors ?? "INSUFFICIENT DATA"}</strong></div>
        <div>Contribution / order: <strong>{formatINR(plan.contributionPerOrder)}</strong></div>
        <div>Target CAC: <strong>{formatINR(plan.targetCac)}</strong></div>
        <div>Warning CAC: <strong>{formatINR(plan.warningCac)}</strong></div>
        <div>Maximum CAC: <strong>{formatINR(plan.maximumCac)}</strong></div>
      </div>
    </div>
  );
}

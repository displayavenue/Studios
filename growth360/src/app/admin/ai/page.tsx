"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";

export default function AdminAiPage() {
  const [data, setData] = useState<{
    successfulRequests: number;
    failedRequests: number;
    tokensUsed: number;
    estimatedCostUsd: number;
    recent: Array<Record<string, unknown>>;
  } | null>(null);
  useEffect(() => {
    fetch("/api/admin/ai-usage").then((r) => r.json()).then((j) => j.ok && setData(j.data));
  }, []);
  return (
    <AdminShell>
      <h1 className="display" style={{ color: "var(--navy)" }}>AI Usage</h1>
      {!data ? <p>Loading...</p> : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "0.6rem" }}>
            <Metric label="Successful" value={data.successfulRequests} />
            <Metric label="Failed" value={data.failedRequests} />
            <Metric label="Tokens" value={data.tokensUsed} />
            <Metric label="Est. Cost USD" value={data.estimatedCostUsd.toFixed(4)} />
          </div>
          <h2>Recent requests</h2>
          {data.recent.slice(0, 30).map((r) => (
            <div key={String(r.id)} className="panel" style={{ padding: "0.7rem", marginBottom: "0.45rem" }}>
              {String(r.useCase)} · {String(r.status)} · {String(r.model)} · ${Number(r.estimatedCostUsd || 0).toFixed(5)}
            </div>
          ))}
        </>
      )}
    </AdminShell>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="panel" style={{ padding: "0.8rem" }}>
      <div style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{label}</div>
      <div style={{ fontWeight: 800, color: "var(--navy)" }}>{value}</div>
    </div>
  );
}

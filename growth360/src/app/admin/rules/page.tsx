"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/AdminShell";

export default function AdminRulesPage() {
  const [data, setData] = useState<{ strategy: Array<Record<string, unknown>>; planTemplates: Array<Record<string, unknown>> } | null>(null);
  useEffect(() => {
    fetch("/api/admin/rules").then((r) => r.json()).then((j) => j.ok && setData(j.data));
  }, []);
  return (
    <AdminShell>
      <h1 className="display" style={{ color: "var(--navy)" }}>Strategy Rules</h1>
      {!data ? <p>Loading...</p> : (
        <>
          {data.strategy.map((r) => (
            <div key={String(r.id)} className="panel" style={{ padding: "0.8rem", marginBottom: "0.5rem" }}>
              <strong>{String(r.name)}</strong>
              <div style={{ color: "var(--muted)" }}>Channels: {(r.channels as string[]).join(", ")}</div>
            </div>
          ))}
          <h2>90-day templates</h2>
          {data.planTemplates.map((t) => (
            <div key={String(t.id)} className="panel" style={{ padding: "0.8rem", marginBottom: "0.5rem" }}>
              {String(t.name)}
            </div>
          ))}
        </>
      )}
    </AdminShell>
  );
}

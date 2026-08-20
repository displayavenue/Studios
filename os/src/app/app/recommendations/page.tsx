"use client";

import { useEffect, useState } from "react";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, LoadingBlock, ModuleNotReady } from "@/components/ModuleState";

type Rec = {
  id: string;
  title: string;
  rationale: string;
  status: string;
  type: string;
};

export default function RecommendationsPage() {
  const [rows, setRows] = useState<Rec[] | null>(null);
  const [error, setError] = useState<{ notReady?: boolean; message: string } | null>(null);

  async function load() {
    const res = await apiFetch<Rec[]>("/api/recommendations?status=pending");
    if (!res.ok) {
      setError({ notReady: res.notReady, message: res.error });
      return;
    }
    setError(null);
    setRows(asArray<Rec>(res.data));
  }

  useEffect(() => {
    load();
  }, []);

  if (error?.notReady) return <main className="container" style={{ padding: "1.25rem 0" }}><ModuleNotReady moduleName="Recommendations" /></main>;
  if (error) return <main className="container" style={{ padding: "1.25rem 0" }}><EmptyState title="Could not load recommendations" detail={error.message} /></main>;
  if (!rows) return <LoadingBlock />;

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ color: "var(--navy)" }}>AI Recommendations</h1>
      <p style={{ color: "var(--muted)" }}>Human approval required. AI never auto-changes budgets in V1.</p>
      {rows.length === 0 ? (
        <EmptyState title="No pending recommendations" detail="Recommendations appear after performance analysis creates them." />
      ) : (
        <div style={{ display: "grid", gap: ".75rem" }}>
          {rows.map((r) => (
            <div key={r.id} className="panel" style={{ padding: "1rem" }}>
              <strong>{r.title}</strong>
              <div style={{ color: "var(--muted)", margin: ".35rem 0" }}>{r.rationale}</div>
              <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                <button className="btn btn-primary" type="button" onClick={async () => {
                  await apiFetch(`/api/recommendations/${r.id}/decide`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision: "approve" }) });
                  await load();
                }}>Approve</button>
                <button className="btn btn-secondary" type="button" onClick={async () => {
                  await apiFetch(`/api/recommendations/${r.id}/decide`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decision: "reject" }) });
                  await load();
                }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, ModuleNotReady } from "@/components/ModuleState";

type Approval = {
  id: string;
  title: string;
  type?: string;
  status?: string;
};

export default function PortalApprovalsPage() {
  const [items, setItems] = useState<Approval[] | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await apiFetch<Approval[] | { approvals: Approval[] }>("/api/portal/approvals");
      if (!res.ok) {
        if (res.notReady) {
          const fallback = await apiFetch<Approval[] | { approvals: Approval[] }>("/api/approvals");
          if (fallback.ok) {
            setItems(Array.isArray(fallback.data) ? fallback.data : asArray<Approval>(fallback.data.approvals));
            return;
          }
          setNotReady(true);
        } else setError(res.error || "Failed to load approvals");
        setItems([]);
        return;
      }
      setItems(Array.isArray(res.data) ? res.data : asArray<Approval>(res.data.approvals));
    })();
  }, []);

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Approvals</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Review creative and optimization requests.</p>

      {notReady && <ModuleNotReady moduleName="Portal approvals" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {!notReady && items && items.length === 0 && !error && (
        <EmptyState title="No approvals pending" detail="Nothing needs your decision right now." />
      )}
      {!notReady && items && items.length > 0 && (
        <section className="panel" style={{ padding: "1.1rem" }}>
          {items.map((a) => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: ".7rem", minHeight: 44 }}>
              <div>
                <div style={{ fontWeight: 800 }}>{a.title}</div>
                <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>{a.type || "approval"}</div>
              </div>
              <div style={{ fontWeight: 700 }}>{a.status || "pending"}</div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

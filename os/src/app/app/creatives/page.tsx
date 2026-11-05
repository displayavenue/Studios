"use client";

import { useEffect, useState } from "react";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, LoadingBlock, ModuleNotReady } from "@/components/ModuleState";

type Creative = {
  id: string;
  name: string;
  status: string;
  type: string;
};

export default function CreativesPage() {
  const [rows, setRows] = useState<Creative[] | null>(null);
  const [error, setError] = useState<{ notReady?: boolean; message: string } | null>(null);
  const [name, setName] = useState("");
  const [orgId, setOrgId] = useState("");

  async function load() {
    const res = await apiFetch<Creative[]>("/api/creatives");
    if (!res.ok) {
      setError({ notReady: res.notReady, message: res.error });
      return;
    }
    setError(null);
    setRows(asArray<Creative>(res.data));
  }

  useEffect(() => {
    load();
    apiFetch<{ memberships: { organizationId: string }[] }>("/api/auth/me").then((me) => {
      if (me.ok && me.data.memberships?.[0]) setOrgId(me.data.memberships[0].organizationId);
    });
  }, []);

  if (error?.notReady) return <main className="container" style={{ padding: "1.25rem 0" }}><ModuleNotReady moduleName="Creatives" /></main>;
  if (error) return <main className="container" style={{ padding: "1.25rem 0" }}><EmptyState title="Could not load creatives" detail={error.message} /></main>;
  if (!rows) return <LoadingBlock />;

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ color: "var(--navy)" }}>Creatives</h1>
      <div className="panel" style={{ padding: "1rem", marginBottom: "1rem", display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
        <input className="input" placeholder="Creative name" value={name} onChange={(e) => setName(e.target.value)} style={{ flex: 1 }} />
        <button className="btn btn-primary" type="button" onClick={async () => {
          if (!orgId || !name) return;
          await apiFetch("/api/creatives", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ organizationId: orgId, name }) });
          setName("");
          await load();
        }}>Create draft</button>
      </div>
      {rows.length === 0 ? (
        <EmptyState title="No creatives yet" detail="Create a draft creative to start the approval workflow." />
      ) : (
        <div style={{ display: "grid", gap: ".6rem" }}>
          {rows.map((c) => (
            <div key={c.id} className="panel" style={{ padding: ".9rem 1rem", display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <strong>{c.name}</strong>
                <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>{c.type} · {c.status}</div>
              </div>
              {c.status === "draft" && (
                <button className="btn btn-secondary" type="button" onClick={async () => {
                  await apiFetch(`/api/creatives/${c.id}/submit`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
                  await load();
                }}>Submit for approval</button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

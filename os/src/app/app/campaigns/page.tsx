"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, ModuleNotReady } from "@/components/ModuleState";

type Campaign = {
  id: string;
  name: string;
  status?: string;
  objective?: string | null;
  platform?: string | null;
  dailyBudgetInr?: number | null;
  healthScore?: number | null;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[] | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", objective: "", platform: "meta", dailyBudgetInr: "" });

  async function load() {
    const res = await apiFetch<Campaign[] | { campaigns: Campaign[] }>("/api/campaigns");
    if (!res.ok) {
      if (res.notReady) setNotReady(true);
      else setError(res.error || "Failed to load campaigns");
      setCampaigns([]);
      return;
    }
    setNotReady(false);
    setCampaigns(Array.isArray(res.data) ? res.data : asArray<Campaign>(res.data.campaigns));
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");
    const res = await apiFetch<Campaign>("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        objective: form.objective || undefined,
        platform: form.platform,
        dailyBudgetInr: form.dailyBudgetInr ? Number(form.dailyBudgetInr) : undefined,
        status: "draft",
      }),
    });
    setSaving(false);
    if (!res.ok) {
      if (res.notReady) setNotReady(true);
      setError(res.error || "Could not create campaign");
      return;
    }
    setMsg("Draft campaign created.");
    setForm({ name: "", objective: "", platform: "meta", dailyBudgetInr: "" });
    await load();
  }

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Campaigns</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Draft and manage paid campaigns.</p>

      {notReady && <ModuleNotReady moduleName="Campaigns" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {msg && <p style={{ color: "var(--ok)", fontWeight: 700 }}>{msg}</p>}

      {!notReady && (
        <>
          <form className="panel" onSubmit={onCreate} style={{ padding: "1.1rem", marginBottom: "1rem", display: "grid", gap: ".75rem" }}>
            <h2 className="display" style={{ margin: 0, color: "var(--navy)", fontSize: "1.2rem" }}>Create draft campaign</h2>
            <label style={{ display: "grid", gap: ".35rem" }}>
              <span style={{ fontWeight: 600, fontSize: ".9rem" }}>Name</span>
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Q3 Lead Gen" />
            </label>
            <label style={{ display: "grid", gap: ".35rem" }}>
              <span style={{ fontWeight: 600, fontSize: ".9rem" }}>Objective</span>
              <input className="input" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} placeholder="Leads, traffic, awareness…" />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: ".75rem" }}>
              <label style={{ display: "grid", gap: ".35rem" }}>
                <span style={{ fontWeight: 600, fontSize: ".9rem" }}>Platform</span>
                <select className="input" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                  <option value="meta">Meta</option>
                  <option value="google">Google</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: ".35rem" }}>
                <span style={{ fontWeight: 600, fontSize: ".9rem" }}>Daily budget (₹)</span>
                <input className="input" inputMode="numeric" value={form.dailyBudgetInr} onChange={(e) => setForm({ ...form, dailyBudgetInr: e.target.value })} placeholder="Optional" />
              </label>
            </div>
            <button className="btn btn-primary" disabled={saving || !form.name.trim()} style={{ justifySelf: "start", minHeight: 44 }}>
              {saving ? "Saving…" : "Create draft"}
            </button>
          </form>

          {campaigns && campaigns.length === 0 ? (
            <EmptyState title="No campaigns yet" detail="Create a draft above once the campaigns API is live." />
          ) : (
            <section className="panel" style={{ padding: "1.1rem" }}>
              <h2 className="display" style={{ marginTop: 0, color: "var(--navy)", fontSize: "1.2rem" }}>All campaigns</h2>
              <div style={{ display: "grid", gap: ".55rem" }}>
                {(campaigns || []).map((c) => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: ".7rem" }}>
                    <div>
                      <div style={{ fontWeight: 800 }}>{c.name}</div>
                      <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
                        {[c.platform, c.objective].filter(Boolean).join(" · ") || "—"}
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>{c.status || "draft"}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}

"use client";

import { FormEvent, useEffect, useState } from "react";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, ModuleNotReady } from "@/components/ModuleState";

type Org = {
  id: string;
  name: string;
  slug: string;
  type?: string;
  status?: string;
  industry?: string | null;
  location?: string | null;
};

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Org[] | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", type: "PROSPECT", industry: "", location: "" });

  async function load() {
    const res = await apiFetch<Org[] | { organizations: Org[] }>("/api/admin/organizations");
    if (!res.ok) {
      if (res.notReady) setNotReady(true);
      else setError(res.error || "Failed to load organizations");
      setOrgs([]);
      return;
    }
    setOrgs(Array.isArray(res.data) ? res.data : asArray<Org>(res.data.organizations));
  }

  useEffect(() => {
    load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");
    const res = await apiFetch<Org>("/api/admin/organizations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        type: form.type,
        industry: form.industry || undefined,
        location: form.location || undefined,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      if (res.notReady) setNotReady(true);
      setError(res.error || "Could not create organization");
      return;
    }
    setMsg("Organization created.");
    setForm({ name: "", slug: "", type: "PROSPECT", industry: "", location: "" });
    await load();
  }

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Organizations</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Tenant workspaces for DisplayAvenue and clients.</p>

      {notReady && <ModuleNotReady moduleName="Organizations" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {msg && <p style={{ color: "var(--ok)", fontWeight: 700 }}>{msg}</p>}

      {!notReady && (
        <>
          <form className="panel" onSubmit={onCreate} style={{ padding: "1.1rem", marginBottom: "1rem", display: "grid", gap: ".75rem" }}>
            <h2 className="display" style={{ margin: 0, color: "var(--navy)", fontSize: "1.2rem" }}>Add organization</h2>
            <label style={{ display: "grid", gap: ".35rem" }}>
              <span style={{ fontWeight: 600, fontSize: ".9rem" }}>Name</span>
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label style={{ display: "grid", gap: ".35rem" }}>
              <span style={{ fontWeight: 600, fontSize: ".9rem" }}>Slug</span>
              <input className="input" required pattern="[a-z0-9-]+" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="acme-india" />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: ".75rem" }}>
              <label style={{ display: "grid", gap: ".35rem" }}>
                <span style={{ fontWeight: 600, fontSize: ".9rem" }}>Type</span>
                <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="PROSPECT">Prospect</option>
                  <option value="CLIENT">Client</option>
                  <option value="INTERNAL">Internal</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: ".35rem" }}>
                <span style={{ fontWeight: 600, fontSize: ".9rem" }}>Industry</span>
                <input className="input" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
              </label>
              <label style={{ display: "grid", gap: ".35rem" }}>
                <span style={{ fontWeight: 600, fontSize: ".9rem" }}>Location</span>
                <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </label>
            </div>
            <button className="btn btn-primary" disabled={saving} style={{ justifySelf: "start", minHeight: 44 }}>
              {saving ? "Saving…" : "Create organization"}
            </button>
          </form>

          {orgs && orgs.length === 0 ? (
            <EmptyState title="No organizations yet" />
          ) : (
            <section className="panel" style={{ padding: "1.1rem" }}>
              {(orgs || []).map((o) => (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: ".7rem" }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{o.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
                      {o.slug} · {[o.industry, o.location].filter(Boolean).join(" · ") || "—"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700 }}>{o.type || "—"}</div>
                    <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>{o.status || "—"}</div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}

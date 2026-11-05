"use client";

import { useEffect, useState } from "react";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, LoadingBlock, ModuleNotReady } from "@/components/ModuleState";
import { formatInrAmount } from "@/lib/quotations/format";

type CatalogService = {
  id: string;
  name: string;
  description?: string | null;
  defaultPriceInr?: number;
  gstPercent?: number;
  billingType?: string;
  isActive?: boolean;
  category?: { name?: string } | string | null;
  categoryName?: string | null;
};

const EMPTY = {
  name: "",
  description: "",
  defaultPriceInr: 0,
  gstPercent: 18,
  billingType: "one_time",
  categoryName: "",
};

export default function QuoteServicesPage() {
  const [services, setServices] = useState<CatalogService[] | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await apiFetch<{ services: CatalogService[] } | CatalogService[]>("/api/quote-services");
    if (!res.ok && res.notReady) {
      setNotReady(true);
      setServices([]);
      return;
    }
    if (!res.ok) {
      setError(res.error || "Failed to load services");
      setServices([]);
      return;
    }
    setServices(Array.isArray(res.data) ? res.data : asArray(res.data.services));
  }

  useEffect(() => {
    load();
  }, []);

  async function createService(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await apiFetch<CatalogService>("/api/quote-services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description || undefined,
        defaultPriceInr: Number(form.defaultPriceInr) || 0,
        gstPercent: Number(form.gstPercent) || 18,
        billingType: form.billingType,
        categoryName: form.categoryName || undefined,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error || "Could not create service");
      return;
    }
    setForm(EMPTY);
    await load();
  }

  if (services === null) return <LoadingBlock label="Loading services…" />;

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Quote services</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Catalog used when building quotations.</p>

      {notReady && <ModuleNotReady moduleName="Quote services" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {!notReady && (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <form className="panel" style={{ padding: "1.1rem", display: "grid", gap: ".75rem", height: "fit-content" }} onSubmit={createService}>
            <h2 className="display" style={{ margin: 0, fontSize: "1.1rem", color: "var(--navy)" }}>Add service</h2>
            <label style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
              Name *
              <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
              Category
              <input className="input" value={form.categoryName} onChange={(e) => setForm({ ...form, categoryName: e.target.value })} />
            </label>
            <label style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
              Description
              <textarea className="input" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ minHeight: 88 }} />
            </label>
            <label style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
              Default price (₹)
              <input className="input" type="number" min={0} step="any" value={form.defaultPriceInr} onChange={(e) => setForm({ ...form, defaultPriceInr: Number(e.target.value) })} />
            </label>
            <label style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
              GST %
              <input className="input" type="number" min={0} step="any" value={form.gstPercent} onChange={(e) => setForm({ ...form, gstPercent: Number(e.target.value) })} />
            </label>
            <label style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
              Billing type
              <select className="input" value={form.billingType} onChange={(e) => setForm({ ...form, billingType: e.target.value })}>
                <option value="one_time">One-time</option>
                <option value="recurring">Recurring</option>
              </select>
            </label>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Create service"}
            </button>
          </form>

          <section className="panel" style={{ padding: "1.1rem" }}>
            <h2 className="display" style={{ marginTop: 0, fontSize: "1.1rem", color: "var(--navy)" }}>Catalog</h2>
            {services.length === 0 && <EmptyState title="No services yet" detail="Add catalog items to speed up quoting." />}
            {services.map((s) => {
              const category =
                typeof s.category === "string" ? s.category : s.category?.name || s.categoryName || "";
              return (
                <div key={s.id} style={{ borderTop: "1px solid var(--line)", padding: ".8rem 0", display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 800 }}>{s.name}</div>
                    <div style={{ color: "var(--muted)", fontSize: ".88rem" }}>
                      {[category, s.billingType, `GST ${s.gstPercent ?? 18}%`].filter(Boolean).join(" · ")}
                    </div>
                    {s.description && <div style={{ color: "var(--muted)", fontSize: ".88rem", marginTop: ".25rem" }}>{s.description}</div>}
                  </div>
                  <div style={{ fontWeight: 800 }}>{formatInrAmount(s.defaultPriceInr)}</div>
                </div>
              );
            })}
          </section>
        </div>
      )}
    </main>
  );
}

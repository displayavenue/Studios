"use client";

import { useEffect, useState } from "react";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, LoadingBlock, ModuleNotReady } from "@/components/ModuleState";

type QuoteClient = {
  id: string;
  clientCode?: string;
  companyName: string;
  contactPerson?: string | null;
  email?: string | null;
  mobile?: string | null;
  state?: string | null;
  gstin?: string | null;
  createdAt?: string;
};

const EMPTY = {
  companyName: "",
  contactPerson: "",
  email: "",
  mobile: "",
  whatsapp: "",
  state: "Maharashtra",
  gstin: "",
  city: "",
  address: "",
};

export default function QuoteClientsPage() {
  const [clients, setClients] = useState<QuoteClient[] | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await apiFetch<{ clients: QuoteClient[] } | QuoteClient[]>("/api/quote-clients");
    if (!res.ok && res.notReady) {
      setNotReady(true);
      setClients([]);
      return;
    }
    if (!res.ok) {
      setError(res.error || "Failed to load clients");
      setClients([]);
      return;
    }
    setClients(Array.isArray(res.data) ? res.data : asArray(res.data.clients));
  }

  useEffect(() => {
    load();
  }, []);

  async function createClient(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await apiFetch<QuoteClient>("/api/quote-clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error || "Could not create client");
      return;
    }
    setForm(EMPTY);
    await load();
  }

  if (clients === null) return <LoadingBlock label="Loading clients…" />;

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Quote clients</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Companies you prepare quotations for.</p>

      {notReady && <ModuleNotReady moduleName="Quote clients" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {!notReady && (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <form className="panel" style={{ padding: "1.1rem", display: "grid", gap: ".75rem", height: "fit-content" }} onSubmit={createClient}>
            <h2 className="display" style={{ margin: 0, fontSize: "1.1rem", color: "var(--navy)" }}>Add client</h2>
            {(
              [
                ["companyName", "Company name *", true],
                ["contactPerson", "Contact person", false],
                ["email", "Email", false],
                ["mobile", "Mobile", false],
                ["whatsapp", "WhatsApp", false],
                ["gstin", "GSTIN", false],
                ["state", "State", false],
                ["city", "City", false],
              ] as const
            ).map(([key, label, required]) => (
              <label key={key} style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
                {label}
                <input
                  className="input"
                  required={required}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                />
              </label>
            ))}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Create client"}
            </button>
          </form>

          <section className="panel" style={{ padding: "1.1rem" }}>
            <h2 className="display" style={{ marginTop: 0, fontSize: "1.1rem", color: "var(--navy)" }}>Clients</h2>
            {clients.length === 0 && <EmptyState title="No clients yet" detail="Add a company to start quoting." />}
            {clients.map((c) => (
              <div key={c.id} style={{ borderTop: "1px solid var(--line)", padding: ".8rem 0" }}>
                <div style={{ fontWeight: 800 }}>{c.companyName}</div>
                <div style={{ color: "var(--muted)", fontSize: ".88rem" }}>
                  {[c.clientCode, c.contactPerson, c.email, c.mobile, c.state].filter(Boolean).join(" · ") || "—"}
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </main>
  );
}

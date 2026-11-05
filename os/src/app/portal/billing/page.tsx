"use client";

import { useEffect, useState } from "react";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, ModuleNotReady } from "@/components/ModuleState";

type Invoice = {
  id: string;
  number?: string;
  amountInr?: number;
  status?: string;
  dueAt?: string | null;
};

export default function PortalBillingPage() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await apiFetch<{ invoices?: Invoice[] } | Invoice[]>("/api/billing/invoices");
      if (!res.ok) {
        if (res.notReady) setNotReady(true);
        else setError(res.error || "Failed to load billing");
        setInvoices([]);
        return;
      }
      setInvoices(Array.isArray(res.data) ? res.data : asArray<Invoice>(res.data.invoices));
    })();
  }, []);

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Billing</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Invoices for your account.</p>

      {notReady && <ModuleNotReady moduleName="Portal billing" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {!notReady && invoices && invoices.length === 0 && !error && (
        <EmptyState title="No invoices yet" detail="Retainers and media invoices will appear when issued." />
      )}
      {!notReady && invoices && invoices.length > 0 && (
        <section className="panel" style={{ padding: "1.1rem" }}>
          {invoices.map((inv) => (
            <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: ".7rem" }}>
              <div>
                <div style={{ fontWeight: 800 }}>{inv.number || inv.id}</div>
                <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
                  {inv.dueAt ? `Due ${new Date(inv.dueAt).toLocaleDateString("en-IN")}` : "No due date"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>
                  {typeof inv.amountInr === "number" ? `₹${inv.amountInr.toLocaleString("en-IN")}` : "—"}
                </div>
                <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>{inv.status || "—"}</div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

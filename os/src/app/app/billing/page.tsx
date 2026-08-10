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

type Payment = {
  id: string;
  amountInr?: number;
  purpose?: string;
  status?: string;
  createdAt?: string;
};

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const res = await apiFetch<{ invoices?: Invoice[]; payments?: Payment[] } | Invoice[]>("/api/billing");
      if (!res.ok) {
        if (res.notReady) setNotReady(true);
        else setError(res.error || "Failed to load billing");
        setInvoices([]);
        return;
      }
      if (Array.isArray(res.data)) {
        setInvoices(res.data);
        setPayments([]);
      } else {
        setInvoices(asArray<Invoice>(res.data.invoices));
        setPayments(asArray<Payment>(res.data.payments));
      }
    })();
  }, []);

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Billing</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Invoices and payments from the billing API.</p>

      {notReady && <ModuleNotReady moduleName="Billing" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {!notReady && invoices && invoices.length === 0 && payments.length === 0 && !error && (
        <EmptyState title="No invoices yet" detail="Client invoices and strategy-call payments will appear here." />
      )}

      {!notReady && invoices && invoices.length > 0 && (
        <section className="panel" style={{ padding: "1.1rem", marginBottom: "1rem" }}>
          <h2 className="display" style={{ marginTop: 0, color: "var(--navy)", fontSize: "1.2rem" }}>Invoices</h2>
          {invoices.map((inv) => (
            <div key={inv.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: ".7rem" }}>
              <div>
                <div style={{ fontWeight: 800 }}>{inv.number || inv.id}</div>
                <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>{inv.dueAt ? `Due ${new Date(inv.dueAt).toLocaleDateString("en-IN")}` : "No due date"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>
                  {typeof inv.amountInr === "number" ? `₹${inv.amountInr.toLocaleString("en-IN")}` : "—"}
                </div>
                <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>{inv.status || "draft"}</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {!notReady && payments.length > 0 && (
        <section className="panel" style={{ padding: "1.1rem" }}>
          <h2 className="display" style={{ marginTop: 0, color: "var(--navy)", fontSize: "1.2rem" }}>Payments</h2>
          {payments.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: ".7rem" }}>
              <div>
                <div style={{ fontWeight: 800 }}>{p.purpose || "Payment"}</div>
                <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>{p.createdAt ? new Date(p.createdAt).toLocaleString("en-IN") : "—"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800 }}>
                  {typeof p.amountInr === "number" ? `₹${p.amountInr.toLocaleString("en-IN")}` : "—"}
                </div>
                <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>{p.status || "—"}</div>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

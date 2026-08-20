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

type Summary = {
  payments?: {
    paidInr?: number;
    paidCount?: number;
    pendingInr?: number;
    pendingCount?: number;
  };
  invoices?: {
    totalCount?: number;
    totalAmountInr?: number;
  };
};

export default function BillingPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [invoices, setInvoices] = useState<Invoice[] | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const sum = await apiFetch<Summary>("/api/billing/summary");
      const inv = await apiFetch<{ invoices: Invoice[] } | Invoice[]>("/api/billing/invoices");

      if ((!sum.ok && sum.notReady) && (!inv.ok && inv.notReady)) {
        setNotReady(true);
        setInvoices([]);
        return;
      }
      if (!sum.ok && !inv.ok) {
        setError(sum.error || inv.error || "Failed to load billing");
        setInvoices([]);
        return;
      }
      if (sum.ok) setSummary(sum.data);
      if (inv.ok) {
        setInvoices(Array.isArray(inv.data) ? inv.data : asArray<Invoice>(inv.data.invoices));
      } else {
        setInvoices([]);
      }
    })();
  }, []);

  const invoiceCount = invoices?.length ?? 0;
  const hasSummaryNumbers =
    summary &&
    ((summary.payments?.paidCount || 0) > 0 ||
      (summary.payments?.pendingCount || 0) > 0 ||
      (summary.invoices?.totalCount || 0) > 0);

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Billing</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Invoices and payments from the billing API.</p>

      {notReady && <ModuleNotReady moduleName="Billing" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {!notReady && summary && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: ".75rem", marginBottom: "1.25rem" }}>
          <Stat label="Paid" value={`₹${Math.round(summary.payments?.paidInr || 0).toLocaleString("en-IN")}`} sub={`${summary.payments?.paidCount || 0} payments`} />
          <Stat label="Pending" value={`₹${Math.round(summary.payments?.pendingInr || 0).toLocaleString("en-IN")}`} sub={`${summary.payments?.pendingCount || 0} payments`} />
          <Stat label="Invoices" value={String(summary.invoices?.totalCount || 0)} sub={`₹${Math.round(summary.invoices?.totalAmountInr || 0).toLocaleString("en-IN")}`} />
        </div>
      )}

      {!notReady && invoices && invoiceCount === 0 && !hasSummaryNumbers && !error && (
        <EmptyState title="No invoices yet" detail="Client invoices and strategy-call payments will appear here." />
      )}

      {!notReady && invoices && invoiceCount > 0 && (
        <section className="panel" style={{ padding: "1.1rem" }}>
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
    </main>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="panel" style={{ padding: "1rem" }}>
      <div style={{ color: "var(--muted)", fontSize: ".82rem" }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--navy)" }}>{value}</div>
      {sub && <div style={{ color: "var(--muted)", fontSize: ".8rem" }}>{sub}</div>}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, LoadingBlock, ModuleNotReady } from "@/components/ModuleState";
import { StatusBadge, formatInrFromPaise } from "@/lib/quotations/format";

type Dashboard = {
  metrics?: {
    totalQuoteValuePaise?: number;
    totalQuoteCount?: number;
    acceptedValuePaise?: number;
    acceptedCount?: number;
    pendingPaymentPaise?: number;
    pendingPaymentCount?: number;
    collectedPaise?: number;
    collectedCount?: number;
    outstandingPaise?: number;
    conversionRate?: number;
  };
  totalQuoteValuePaise?: number;
  total?: number;
  draft?: number;
  sent?: number;
  viewed?: number;
  accepted?: number;
  paid?: number;
  partiallyPaid?: number;
  expired?: number;
  grandTotalPaise?: number;
  paidPaise?: number;
  advanceDuePaise?: number;
  counts?: Record<string, number>;
};

type QuotationRow = {
  id: string;
  quotationNumber?: string;
  status?: string;
  paymentStatus?: string;
  grandTotalPaise?: number;
  advancePaise?: number;
  paidPaise?: number;
  validUntil?: string;
  quotationDate?: string;
  createdAt?: string;
  client?: { companyName?: string; contactPerson?: string | null };
  clientName?: string;
};

export default function QuotationsPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [rows, setRows] = useState<QuotationRow[] | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const [dash, list] = await Promise.all([
        apiFetch<Dashboard>("/api/quotations/dashboard"),
        apiFetch<{ quotations: QuotationRow[] } | QuotationRow[]>("/api/quotations"),
      ]);

      if ((!dash.ok && dash.notReady) && (!list.ok && list.notReady)) {
        setNotReady(true);
        setRows([]);
        return;
      }
      if (!dash.ok && !list.ok) {
        setError(dash.error || list.error || "Failed to load quotations");
        setRows([]);
        return;
      }
      if (dash.ok) setDashboard(dash.data);
      if (list.ok) {
        setRows(Array.isArray(list.data) ? list.data : asArray<QuotationRow>(list.data.quotations));
      } else {
        setRows([]);
      }
    })();
  }, []);

  if (rows === null) return <LoadingBlock label="Loading quotations…" />;

  const counts = dashboard?.counts || {};
  const metrics = dashboard?.metrics;
  const total = metrics?.totalQuoteCount ?? dashboard?.total ?? counts.total ?? rows.length;
  const accepted = metrics?.acceptedCount ?? dashboard?.accepted ?? counts.ACCEPTED ?? 0;
  const collected = metrics?.collectedPaise ?? dashboard?.paidPaise ?? 0;
  const pending = metrics?.pendingPaymentPaise ?? dashboard?.advanceDuePaise ?? 0;
  const pipelineValue =
    metrics?.totalQuoteValuePaise ??
    dashboard?.grandTotalPaise ??
    rows.reduce((s, r) => s + (r.grandTotalPaise || 0), 0);
  const draft = dashboard?.draft ?? counts.DRAFT ?? rows.filter((r) => r.status === "DRAFT").length;
  const sent =
    dashboard?.sent ??
    counts.SENT ??
    rows.filter((r) => ["SENT", "VIEWED"].includes(r.status || "")).length;

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <div>
          <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Quotations</h1>
          <p style={{ margin: 0, color: "var(--muted)" }}>Create, send, and track client quotations.</p>
        </div>
        <Link href="/app/quotations/create" className="btn btn-primary" style={{ padding: ".7rem 1.15rem" }}>
          New quotation
        </Link>
      </div>

      {notReady && <ModuleNotReady moduleName="Quotations" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {!notReady && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: ".75rem", marginBottom: "1.25rem" }}>
          <Metric label="Total quotes" value={String(total)} />
          <Metric label="Draft" value={String(draft)} />
          <Metric label="Sent / Viewed" value={String(sent)} />
          <Metric label="Accepted" value={String(accepted)} />
          <Metric label="Pipeline value" value={formatInrFromPaise(pipelineValue)} />
          <Metric label="Collected" value={formatInrFromPaise(collected)} />
          <Metric label="Pending payment" value={formatInrFromPaise(pending)} />
        </div>
      )}

      {!notReady && rows.length === 0 && !error && (
        <EmptyState title="No quotations yet" detail="Create your first quotation to send a secure client link." />
      )}

      {!notReady && rows.length > 0 && (
        <section className="panel" style={{ padding: "1.1rem", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
            <thead>
              <tr style={{ textAlign: "left", color: "var(--muted)", fontSize: ".82rem" }}>
                <th style={{ padding: ".55rem .4rem" }}>Number</th>
                <th style={{ padding: ".55rem .4rem" }}>Client</th>
                <th style={{ padding: ".55rem .4rem" }}>Status</th>
                <th style={{ padding: ".55rem .4rem" }}>Payment</th>
                <th style={{ padding: ".55rem .4rem" }}>Total</th>
                <th style={{ padding: ".55rem .4rem" }}>Valid until</th>
                <th style={{ padding: ".55rem .4rem" }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((q) => (
                <tr key={q.id} style={{ borderTop: "1px solid var(--line)" }}>
                  <td style={{ padding: ".75rem .4rem", fontWeight: 800 }}>{q.quotationNumber || q.id.slice(0, 8)}</td>
                  <td style={{ padding: ".75rem .4rem" }}>
                    {q.client?.companyName || q.clientName || "—"}
                  </td>
                  <td style={{ padding: ".75rem .4rem" }}><StatusBadge status={q.status} /></td>
                  <td style={{ padding: ".75rem .4rem" }}><StatusBadge status={q.paymentStatus} /></td>
                  <td style={{ padding: ".75rem .4rem", fontWeight: 700 }}>{formatInrFromPaise(q.grandTotalPaise)}</td>
                  <td style={{ padding: ".75rem .4rem", color: "var(--muted)", fontSize: ".9rem" }}>
                    {q.validUntil ? new Date(q.validUntil).toLocaleDateString("en-IN") : "—"}
                  </td>
                  <td style={{ padding: ".75rem .4rem", textAlign: "right" }}>
                    <Link href={`/app/quotations/${q.id}`} className="btn btn-secondary" style={{ padding: ".45rem .85rem", minHeight: 36, fontSize: ".85rem" }}>
                      Open
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel" style={{ padding: "1rem" }}>
      <div style={{ color: "var(--muted)", fontSize: ".82rem" }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "var(--navy)" }}>{value}</div>
    </div>
  );
}

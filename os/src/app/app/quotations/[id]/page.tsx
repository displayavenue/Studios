"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, LoadingBlock, ModuleNotReady } from "@/components/ModuleState";
import { StatusBadge, formatInrFromPaise } from "@/lib/quotations/format";

type QuoteDetail = {
  id: string;
  quotationNumber?: string;
  secureToken?: string;
  status?: string;
  paymentStatus?: string;
  notes?: string | null;
  internalNotes?: string | null;
  termsSnapshot?: string | null;
  validUntil?: string;
  quotationDate?: string;
  advancePercent?: number;
  grandTotalPaise?: number;
  advancePaise?: number;
  balancePaise?: number;
  paidPaise?: number;
  taxablePaise?: number;
  cgstPaise?: number;
  sgstPaise?: number;
  igstPaise?: number;
  totalGstPaise?: number;
  gstMode?: string;
  publicUrl?: string;
  publicPath?: string;
  client?: {
    companyName?: string;
    contactPerson?: string | null;
    email?: string | null;
    mobile?: string | null;
    whatsapp?: string | null;
  };
  items?: Array<{
    id: string;
    serviceName: string;
    description?: string | null;
    quantity: number;
    unitPricePaise: number;
    discountPercent?: number;
    gstPercent?: number;
    totalPaise: number;
  }>;
  events?: Array<{
    id: string;
    type: string;
    message?: string | null;
    createdAt: string;
  }>;
};

export default function QuotationDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [quote, setQuote] = useState<QuoteDetail | null>(null);
  const [notReady, setNotReady] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const [editingNote, setEditingNote] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    const res = await apiFetch<QuoteDetail>(`/api/quotations/${id}`);
    if (!res.ok && res.notReady) {
      setNotReady(true);
      setQuote(null);
      return;
    }
    if (!res.ok) {
      setError(res.error || "Failed to load quotation");
      setQuote(null);
      return;
    }
    setQuote(res.data);
    setNoteDraft(res.data.notes || "");
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  function publicLink() {
    if (!quote) return "";
    if (quote.publicUrl) return quote.publicUrl;
    if (quote.publicPath && typeof window !== "undefined") return `${window.location.origin}${quote.publicPath}`;
    if (quote.quotationNumber && quote.secureToken && typeof window !== "undefined") {
      return `${window.location.origin}/q/${encodeURIComponent(quote.quotationNumber)}/${quote.secureToken}`;
    }
    return "";
  }

  async function sendQuote() {
    if (!quote) return;
    setBusy("send");
    setError("");
    const res = await apiFetch<{
      quotation?: QuoteDetail;
      publicUrl?: string;
      publicPath?: string;
    } & QuoteDetail>(`/api/quotations/${quote.id}/send`, { method: "POST" });
    setBusy("");
    if (!res.ok) {
      setError(res.error || "Failed to send");
      return;
    }
    const next = res.data.quotation ? { ...quote, ...res.data.quotation } : res.data.id ? res.data : quote;
    setQuote({
      ...next,
      publicUrl: res.data.publicUrl || next.publicUrl,
      publicPath: res.data.publicPath || next.publicPath,
    });
    await load();
  }

  async function copyLink() {
    const link = publicLink();
    if (!link) {
      setError("Secure link not available yet");
      return;
    }
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Could not copy link");
    }
  }

  function whatsappShare() {
    const link = publicLink();
    const phone = quote?.client?.whatsapp || quote?.client?.mobile || "";
    const text = encodeURIComponent(
      `Hello${quote?.client?.contactPerson ? ` ${quote.client.contactPerson}` : ""},\n\nPlease find your DisplayAvenue quotation ${quote?.quotationNumber || ""}.\n\nTotal: ${formatInrFromPaise(quote?.grandTotalPaise)}\nAdvance: ${formatInrFromPaise(quote?.advancePaise)}\n\nReview & accept:\n${link}`,
    );
    const digits = phone.replace(/\D/g, "");
    window.open(digits ? `https://wa.me/${digits}?text=${text}` : `https://wa.me/?text=${text}`, "_blank");
  }

  async function saveNote() {
    if (!quote) return;
    setBusy("note");
    setError("");
    const res = await apiFetch<QuoteDetail>(`/api/quotations/${quote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: noteDraft }),
    });
    setBusy("");
    if (!res.ok) {
      setError(res.error || "Failed to save note");
      return;
    }
    setQuote({ ...quote, ...res.data, events: quote.events });
    setEditingNote(false);
  }

  if (notReady) {
    return (
      <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
        <ModuleNotReady moduleName="Quotations" />
      </main>
    );
  }

  if (!quote && !error) return <LoadingBlock label="Loading quotation…" />;

  if (!quote) {
    return (
      <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
        <EmptyState title="Quotation not found" detail={error || "This quotation could not be loaded."} />
        <Link href="/app/quotations" className="btn btn-secondary" style={{ marginTop: "1rem", display: "inline-flex" }}>
          Back to list
        </Link>
      </main>
    );
  }

  const events = asArray<NonNullable<QuoteDetail["events"]>[number]>(quote.events);
  const items = asArray<NonNullable<QuoteDetail["items"]>[number]>(quote.items);

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <Link href="/app/quotations" style={{ color: "var(--muted)", fontWeight: 600, fontSize: ".9rem" }}>
        ← Quotations
      </Link>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", margin: ".5rem 0 1.25rem" }}>
        <div>
          <h1 className="display" style={{ margin: 0, color: "var(--navy)" }}>{quote.quotationNumber || "Quotation"}</h1>
          <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginTop: ".55rem" }}>
            <StatusBadge status={quote.status} />
            <StatusBadge status={quote.paymentStatus} />
          </div>
          <p style={{ margin: ".55rem 0 0", color: "var(--muted)" }}>
            {quote.client?.companyName || "Client"}
            {quote.validUntil ? ` · Valid until ${new Date(quote.validUntil).toLocaleDateString("en-IN")}` : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", alignItems: "flex-start" }}>
          <button type="button" className="btn btn-primary" style={{ padding: ".65rem 1.05rem" }} disabled={busy === "send"} onClick={sendQuote}>
            {busy === "send" ? "Sending…" : "Send"}
          </button>
          <button type="button" className="btn btn-secondary" style={{ padding: ".65rem 1.05rem" }} onClick={copyLink}>
            {copied ? "Copied" : "Copy link"}
          </button>
          <button type="button" className="btn btn-secondary" style={{ padding: ".65rem 1.05rem" }} onClick={whatsappShare}>
            WhatsApp
          </button>
        </div>
      </div>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <section className="panel" style={{ padding: "1.1rem" }}>
            <h2 className="display" style={{ marginTop: 0, fontSize: "1.15rem", color: "var(--navy)" }}>Line items</h2>
            {items.length === 0 && <p style={{ color: "var(--muted)", margin: 0 }}>No items</p>}
            {items.map((item) => (
              <div key={item.id} style={{ borderTop: "1px solid var(--line)", padding: ".75rem 0", display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{item.serviceName}</div>
                  <div style={{ color: "var(--muted)", fontSize: ".88rem" }}>
                    Qty {item.quantity} · GST {item.gstPercent ?? 0}%
                    {item.discountPercent ? ` · Disc ${item.discountPercent}%` : ""}
                  </div>
                </div>
                <div style={{ fontWeight: 800 }}>{formatInrFromPaise(item.totalPaise)}</div>
              </div>
            ))}
          </section>

          <section className="panel" style={{ padding: "1.1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center" }}>
              <h2 className="display" style={{ margin: 0, fontSize: "1.15rem", color: "var(--navy)" }}>Client note</h2>
              {!editingNote ? (
                <button type="button" className="btn btn-secondary" style={{ padding: ".4rem .8rem", minHeight: 34 }} onClick={() => setEditingNote(true)}>
                  Edit note
                </button>
              ) : (
                <button type="button" className="btn btn-primary" style={{ padding: ".4rem .8rem", minHeight: 34 }} disabled={busy === "note"} onClick={saveNote}>
                  {busy === "note" ? "Saving…" : "Save"}
                </button>
              )}
            </div>
            {editingNote ? (
              <textarea className="input" rows={4} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)} style={{ marginTop: ".75rem", minHeight: 100 }} />
            ) : (
              <p style={{ margin: ".75rem 0 0", color: quote.notes ? "var(--ink)" : "var(--muted)", whiteSpace: "pre-wrap" }}>
                {quote.notes || "No client note"}
              </p>
            )}
          </section>

          <section className="panel" style={{ padding: "1.1rem" }}>
            <h2 className="display" style={{ marginTop: 0, fontSize: "1.15rem", color: "var(--navy)" }}>Timeline</h2>
            {events.length === 0 && <p style={{ color: "var(--muted)", margin: 0 }}>No events yet</p>}
            {events.map((ev) => (
              <div key={ev.id} style={{ borderTop: "1px solid var(--line)", padding: ".7rem 0" }}>
                <div style={{ fontWeight: 800 }}>{ev.type}</div>
                {ev.message && <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>{ev.message}</div>}
                <div style={{ color: "var(--muted)", fontSize: ".8rem", marginTop: ".2rem" }}>
                  {new Date(ev.createdAt).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </section>
        </div>

        <aside className="panel" style={{ padding: "1.1rem", height: "fit-content" }}>
          <h2 className="display" style={{ marginTop: 0, fontSize: "1.15rem", color: "var(--navy)" }}>Totals</h2>
          <SummaryRow label="Taxable" value={formatInrFromPaise(quote.taxablePaise)} />
          {(quote.gstMode === "CGST_SGST" || (!quote.gstMode && (quote.cgstPaise || quote.sgstPaise))) && (
            <>
              <SummaryRow label="CGST" value={formatInrFromPaise(quote.cgstPaise)} />
              <SummaryRow label="SGST" value={formatInrFromPaise(quote.sgstPaise)} />
            </>
          )}
          {(quote.gstMode === "IGST" || (!!quote.igstPaise && quote.gstMode !== "CGST_SGST")) && (
            <SummaryRow label="IGST" value={formatInrFromPaise(quote.igstPaise)} />
          )}
          <SummaryRow label="Grand total" value={formatInrFromPaise(quote.grandTotalPaise)} bold />
          <SummaryRow label={`Advance (${quote.advancePercent ?? 60}%)`} value={formatInrFromPaise(quote.advancePaise)} bold />
          <SummaryRow label="Balance" value={formatInrFromPaise(quote.balancePaise)} />
          <SummaryRow label="Paid" value={formatInrFromPaise(quote.paidPaise)} />
        </aside>
      </div>
    </main>
  );
}

function SummaryRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: ".75rem", padding: ".45rem 0", borderTop: "1px solid var(--line)", fontWeight: bold ? 800 : 600 }}>
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <span style={{ color: "var(--navy)" }}>{value}</span>
    </div>
  );
}

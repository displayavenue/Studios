"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch, asArray } from "@/lib/clientApi";
import { formatInrFromPaise } from "@/lib/quotations/format";
import "../../quotations.css";

type PublicItem = {
  id?: string;
  serviceName: string;
  description?: string | null;
  category?: string | null;
  quantity: number;
  unitPricePaise?: number;
  discountPercent?: number;
  gstPercent?: number;
  taxablePaise?: number;
  gstPaise?: number;
  totalPaise: number;
};

type PublicQuote = {
  id?: string;
  quotationNumber?: string;
  status?: string;
  paymentStatus?: string;
  quotationDate?: string;
  validUntil?: string;
  notes?: string | null;
  termsSnapshot?: string | null;
  advancePercent?: number;
  gstMode?: string;
  taxablePaise?: number;
  cgstPaise?: number;
  sgstPaise?: number;
  igstPaise?: number;
  totalGstPaise?: number;
  grandTotalPaise?: number;
  advancePaise?: number;
  balancePaise?: number;
  paidPaise?: number;
  payNowPaise?: number;
  whyChooseEnabled?: boolean;
  showTrust?: boolean;
  whyChooseItems?: string[] | null;
  trustItems?: string[] | null;
  company?: {
    legalName?: string;
    brandName?: string;
    gstin?: string;
    phone?: string;
    website?: string | null;
    state?: string;
    whyChooseItems?: string[] | null;
    trustItems?: string[] | null;
  };
  client?: {
    companyName?: string;
    contactPerson?: string | null;
    email?: string | null;
    mobile?: string | null;
    gstin?: string | null;
    state?: string | null;
  };
  items?: PublicItem[];
  receiptNumber?: string | null;
  invoiceNumber?: string | null;
};

type PayOrder = {
  paymentId: string;
  orderId: string;
  amountInr: number;
  amountPaise: number;
  currency: string;
  keyId: string;
  mock?: boolean;
  quotationNumber?: string;
  clientName?: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
};

type VerifyResult = {
  receipt?: { receiptNumber?: string };
  invoice?: { invoiceNumber?: string };
  receiptNumber?: string;
  invoiceNumber?: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function unwrapQuote(data: unknown): PublicQuote {
  if (!data || typeof data !== "object") return {};
  const obj = data as Record<string, unknown>;
  if (obj.quotation && typeof obj.quotation === "object") {
    const q = obj.quotation as PublicQuote;
    return {
      ...q,
      company: (obj.company as PublicQuote["company"]) || q.company,
      client: (obj.client as PublicQuote["client"]) || q.client,
      items: (obj.items as PublicItem[]) || q.items,
      whyChooseItems: (obj.whyChooseItems as string[]) || q.whyChooseItems,
      trustItems: (obj.trustItems as string[]) || q.trustItems,
      payNowPaise: (obj.payNowPaise as number) ?? q.payNowPaise,
    };
  }
  return obj as PublicQuote;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PublicQuotationClient() {
  const params = useParams<{ number: string; token: string }>();
  const number = decodeURIComponent(params?.number || "");
  const token = params?.token || "";

  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<{ receiptNumber?: string; invoiceNumber?: string } | null>(null);

  const basePath = `/api/quotations/public/${encodeURIComponent(number)}/${encodeURIComponent(token)}`;

  const load = useCallback(async () => {
    if (!number || !token) return;
    setLoading(true);
    const res = await apiFetch<unknown>(basePath);
    if (!res.ok) {
      setError(res.error || "This quotation link is invalid or unavailable.");
      setQuote(null);
      setLoading(false);
      return;
    }
    setQuote(unwrapQuote(res.data));
    setError("");
    setLoading(false);
  }, [basePath, number, token]);

  useEffect(() => {
    load();
  }, [load]);

  const items = asArray<PublicItem>(quote?.items);
  const brand = quote?.company?.brandName || "DisplayAvenue";
  const legal = quote?.company?.legalName || "Mediashouter";
  const gstin = quote?.company?.gstin || "27ALJPY9454C1ZJ";
  const payNow = quote?.payNowPaise ?? Math.max(0, (quote?.advancePaise || 0) - (quote?.paidPaise || 0));
  const whyItems = asArray<string>(
    quote?.whyChooseItems || quote?.company?.whyChooseItems || [
      "Strategy-focused execution",
      "Transparent scope",
      "Professional reporting",
      "Dedicated support",
      "Technology-driven marketing",
    ],
  );
  const trustItems = asArray<string>(
    quote?.trustItems || quote?.company?.trustItems || [
      "GST Registered Business",
      "Secure Online Payment",
      "Transparent Pricing",
      "Defined Scope",
      "Professional Documentation",
    ],
  );
  const showWhy = quote?.whyChooseEnabled !== false;
  const showTrust = quote?.showTrust !== false;
  const alreadyPaid = ["PAID", "PARTIALLY_PAID"].includes(String(quote?.status || "")) || (quote?.paidPaise || 0) > 0;
  const canPay = !["CANCELLED", "REJECTED", "EXPIRED"].includes(String(quote?.status || "")) && payNow > 0;

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, [quote?.id]);

  async function verifyPayment(order: PayOrder, paymentId: string, signature: string) {
    const res = await apiFetch<VerifyResult>("/api/quotations/payments/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature,
      }),
    });
    if (!res.ok) throw new Error(res.error || "Payment verification failed");
    return {
      receiptNumber: res.data.receipt?.receiptNumber || res.data.receiptNumber,
      invoiceNumber: res.data.invoice?.invoiceNumber || res.data.invoiceNumber,
    };
  }

  async function acceptAndPay() {
    if (!agreed || !canPay || busy) return;
    setBusy(true);
    setError("");
    try {
      const accept = await apiFetch(`${basePath}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agreed: true as const,
          name: quote?.client?.contactPerson || quote?.client?.companyName || "Client",
          email: quote?.client?.email || undefined,
        }),
      });
      if (!accept.ok && accept.status !== 409) {
        throw new Error(accept.error || "Could not accept quotation");
      }

      const pay = await apiFetch<PayOrder>(`${basePath}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: "advance",
          agreed: true,
          name: quote?.client?.contactPerson || quote?.client?.companyName || "Client",
          email: quote?.client?.email || undefined,
        }),
      });
      if (!pay.ok) throw new Error(pay.error || "Could not start payment");
      const order = pay.data;

      if (order.mock || order.orderId.startsWith("order_mock_")) {
        const result = await verifyPayment(order, `pay_mock_${Date.now()}`, "mock");
        setSuccess(result);
        await load();
        setBusy(false);
        return;
      }

      const ready = await loadRazorpayScript();
      if (!ready || !window.Razorpay) {
        throw new Error("Razorpay checkout could not be loaded");
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amountPaise,
        currency: order.currency || "INR",
        name: brand,
        description: `Quotation ${order.quotationNumber || quote?.quotationNumber || ""}`,
        order_id: order.orderId,
        prefill: {
          name: order.clientName || quote?.client?.companyName || "",
          email: order.clientEmail || quote?.client?.email || "",
          contact: order.clientPhone || quote?.client?.mobile || "",
        },
        theme: { color: "#1f6feb" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const result = await verifyPayment(
              order,
              response.razorpay_payment_id,
              response.razorpay_signature,
            );
            setSuccess(result);
            await load();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Payment verification failed");
            window.location.href = "/payment/failed";
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setBusy(false);
    }
  }

  function whatsappShare() {
    const link = shareUrl || (typeof window !== "undefined" ? window.location.href : "");
    const text = encodeURIComponent(
      `DisplayAvenue quotation ${quote?.quotationNumber || ""}\nTotal: ${formatInrFromPaise(quote?.grandTotalPaise)}\nAdvance: ${formatInrFromPaise(payNow)}\n\n${link}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  if (loading) {
    return (
      <div className="quote-public">
        <div className="qp-wrap" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".65rem", color: "var(--muted)", fontWeight: 600 }}>
            <span className="pulse-dot" />
            Loading quotation…
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="quote-public">
        <div className="qp-wrap">
          <div className="qp-card" style={{ textAlign: "center", padding: "2rem 1.25rem" }}>
            <h1 className="qp-brand" style={{ fontSize: "1.5rem" }}>Link unavailable</h1>
            <p style={{ color: "var(--muted)" }}>{error || "This quotation could not be found."}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quote-public">
      <div className="qp-wrap fade-up">
        <header className="qp-card" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
            <div>
              <p className="qp-brand">{brand}</p>
              <p className="qp-legal">{legal} · GSTIN {gstin}</p>
              {quote.company?.phone && (
                <p className="qp-legal" style={{ marginTop: ".15rem" }}>
                  {quote.company.phone}
                  {quote.company.website ? ` · ${quote.company.website}` : ""}
                </p>
              )}
            </div>
            <div className="qp-no-print" style={{ display: "flex", gap: ".45rem", flexWrap: "wrap" }}>
              <button type="button" className="btn btn-secondary" style={{ padding: ".55rem .9rem" }} onClick={() => window.print()}>
                Download
              </button>
              <button type="button" className="btn btn-secondary" style={{ padding: ".55rem .9rem" }} onClick={whatsappShare}>
                WhatsApp
              </button>
            </div>
          </div>
        </header>

        {(success || alreadyPaid) && (
          <section className="qp-card" style={{ marginBottom: "1rem", borderColor: "rgba(15,122,78,.25)", background: "linear-gradient(180deg,#f3fbf7,#fff)" }}>
            <h2 className="display" style={{ margin: "0 0 .35rem", color: "var(--ok)", fontSize: "1.25rem" }}>
              {success ? "Payment successful" : "Quotation accepted"}
            </h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Thank you. Your quotation has been recorded
              {success?.receiptNumber ? ` · Receipt ${success.receiptNumber}` : ""}
              {success?.invoiceNumber ? ` · Invoice ${success.invoiceNumber}` : ""}
              {quote.receiptNumber && !success?.receiptNumber ? ` · Receipt ${quote.receiptNumber}` : ""}
              {quote.invoiceNumber && !success?.invoiceNumber ? ` · Invoice ${quote.invoiceNumber}` : ""}.
            </p>
          </section>
        )}

        <section className="qp-card" style={{ marginBottom: "1rem" }}>
          <div style={{ display: "grid", gap: ".75rem", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))" }}>
            <Meta label="Quotation" value={quote.quotationNumber || "—"} />
            <Meta label="Date" value={quote.quotationDate ? new Date(quote.quotationDate).toLocaleDateString("en-IN") : "—"} />
            <Meta label="Valid until" value={quote.validUntil ? new Date(quote.validUntil).toLocaleDateString("en-IN") : "—"} />
            <Meta label="Status" value={quote.status || "—"} />
          </div>
          <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--line)" }}>
            <div style={{ color: "var(--muted)", fontSize: ".82rem", fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" }}>
              Prepared for
            </div>
            <div style={{ fontWeight: 800, color: "var(--navy)", fontSize: "1.1rem", marginTop: ".2rem" }}>
              {quote.client?.companyName || "Client"}
            </div>
            <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
              {[quote.client?.contactPerson, quote.client?.email, quote.client?.mobile, quote.client?.gstin]
                .filter(Boolean)
                .join(" · ") || "—"}
            </div>
          </div>
          {quote.notes && (
            <p style={{ margin: "1rem 0 0", color: "var(--ink)", whiteSpace: "pre-wrap" }}>{quote.notes}</p>
          )}
        </section>

        <section className="qp-card" style={{ marginBottom: "1rem" }}>
          <h2 className="display" style={{ marginTop: 0, marginBottom: "0.85rem", color: "var(--navy)", fontSize: "1.25rem" }}>
            Services
          </h2>

          <div className="qp-mobile-only">
            {items.map((item, idx) => (
              <article key={item.id || idx} className="qp-service-card">
                <div style={{ fontWeight: 800, color: "var(--navy)" }}>{item.serviceName}</div>
                {item.description && <p style={{ margin: ".35rem 0", color: "var(--muted)", fontSize: ".9rem" }}>{item.description}</p>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".45rem", marginTop: ".55rem", fontSize: ".9rem" }}>
                  <span style={{ color: "var(--muted)" }}>Qty {item.quantity}</span>
                  <span style={{ color: "var(--muted)", textAlign: "right" }}>GST {item.gstPercent ?? 0}%</span>
                  <span style={{ color: "var(--muted)" }}>
                    Rate {formatInrFromPaise(item.unitPricePaise)}
                  </span>
                  <span style={{ fontWeight: 800, textAlign: "right", color: "var(--navy)" }}>
                    {formatInrFromPaise(item.totalPaise)}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="qp-desktop-only">
            <table className="qp-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Qty</th>
                  <th>Rate</th>
                  <th>GST</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{item.serviceName}</div>
                      {item.description && <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>{item.description}</div>}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatInrFromPaise(item.unitPricePaise)}</td>
                    <td>{item.gstPercent ?? 0}%</td>
                    <td style={{ fontWeight: 800 }}>{formatInrFromPaise(item.totalPaise)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="qp-card" style={{ marginBottom: "1rem" }}>
          <h2 className="display" style={{ marginTop: 0, marginBottom: ".75rem", color: "var(--navy)", fontSize: "1.25rem" }}>
            Price summary
          </h2>
          <Summary label="Taxable amount" value={formatInrFromPaise(quote.taxablePaise)} />
          {(quote.gstMode === "CGST_SGST" || ((quote.cgstPaise || 0) > 0 || (quote.sgstPaise || 0) > 0)) && (
            <>
              <Summary label="CGST" value={formatInrFromPaise(quote.cgstPaise)} />
              <Summary label="SGST" value={formatInrFromPaise(quote.sgstPaise)} />
            </>
          )}
          {(quote.gstMode === "IGST" || (quote.igstPaise || 0) > 0) && (
            <Summary label="IGST" value={formatInrFromPaise(quote.igstPaise)} />
          )}
          <Summary label="Grand total" value={formatInrFromPaise(quote.grandTotalPaise)} emphasize />
        </section>

        <section className="qp-card" style={{ marginBottom: "1rem" }}>
          <h2 className="display" style={{ marginTop: 0, marginBottom: ".75rem", color: "var(--navy)", fontSize: "1.25rem" }}>
            Payment summary
          </h2>
          <Summary label="Total" value={formatInrFromPaise(quote.grandTotalPaise)} />
          <Summary label={`Pay now (${quote.advancePercent ?? 60}%)`} value={formatInrFromPaise(payNow)} emphasize />
          <Summary label="Balance" value={formatInrFromPaise(quote.balancePaise)} />
        </section>

        {showWhy && whyItems.length > 0 && (
          <section className="qp-card" style={{ marginBottom: "1rem" }}>
            <h2 className="display" style={{ marginTop: 0, marginBottom: ".75rem", color: "var(--navy)", fontSize: "1.25rem" }}>
              Why choose {brand}
            </h2>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "grid", gap: ".45rem" }}>
              {whyItems.map((item) => (
                <li key={item} style={{ color: "var(--ink)" }}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {showTrust && trustItems.length > 0 && (
          <section className="qp-card" style={{ marginBottom: "1rem" }}>
            <h2 className="display" style={{ marginTop: 0, marginBottom: ".75rem", color: "var(--navy)", fontSize: "1.25rem" }}>
              Trust & assurance
            </h2>
            <div style={{ display: "grid", gap: ".55rem", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
              {trustItems.map((item) => (
                <div key={item} style={{ padding: ".75rem .85rem", borderRadius: 14, background: "var(--blue-soft)", color: "var(--navy)", fontWeight: 700, fontSize: ".92rem" }}>
                  {item}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="qp-card" style={{ marginBottom: "1rem" }}>
          <h2 className="display" style={{ marginTop: 0, marginBottom: ".75rem", color: "var(--navy)", fontSize: "1.25rem" }}>
            Terms
          </h2>
          <div style={{ whiteSpace: "pre-wrap", color: "var(--ink)", fontSize: ".92rem", lineHeight: 1.55 }}>
            {quote.termsSnapshot || "Standard DisplayAvenue quotation terms apply."}
          </div>
        </section>

        {canPay && !success && (
          <section className="qp-card qp-no-print" style={{ marginBottom: "1rem" }}>
            <label style={{ display: "flex", gap: ".7rem", alignItems: "flex-start", fontWeight: 600, marginBottom: "1rem" }}>
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: ".25rem", width: 18, height: 18 }} />
              <span>I have reviewed this quotation and agree to the terms and payment schedule.</span>
            </label>
            {error && <p style={{ color: "var(--danger)", marginTop: 0 }}>{error}</p>}
            <button
              type="button"
              className="btn btn-primary"
              disabled={!agreed || busy}
              onClick={acceptAndPay}
              style={{ width: "100%", maxWidth: 420 }}
            >
              {busy ? "Processing…" : `Accept & Pay ${formatInrFromPaise(payNow)}`}
            </button>
          </section>
        )}

        <footer style={{ textAlign: "center", color: "var(--muted)", fontSize: ".85rem", padding: "0.5rem 0 1rem" }}>
          {brand} · {legal} · Secure quotation
        </footer>
      </div>

      {canPay && !success && (
        <div className="qp-sticky qp-no-print">
          <div className="qp-sticky-inner">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: ".75rem", color: "var(--muted)", fontWeight: 700 }}>Pay now</div>
              <div style={{ fontWeight: 800, color: "var(--navy)" }}>{formatInrFromPaise(payNow)}</div>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!agreed || busy}
              onClick={acceptAndPay}
              style={{ padding: ".75rem 1.1rem", whiteSpace: "nowrap" }}
            >
              {busy ? "…" : "Accept & Pay"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ color: "var(--muted)", fontSize: ".78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>
      <div style={{ fontWeight: 800, color: "var(--navy)", marginTop: ".15rem" }}>{value}</div>
    </div>
  );
}

function Summary({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        padding: ".55rem 0",
        borderTop: "1px solid var(--line)",
        fontWeight: emphasize ? 800 : 600,
        fontSize: emphasize ? "1.05rem" : ".95rem",
      }}
    >
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <span style={{ color: "var(--navy)" }}>{value}</span>
    </div>
  );
}

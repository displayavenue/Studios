"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiFetch, asArray } from "@/lib/clientApi";
import { EmptyState, LoadingBlock, ModuleNotReady } from "@/components/ModuleState";

type Competitor = {
  id: string;
  name: string;
  city?: string | null;
  scores?: {
    overallScore?: number | null;
    digitalScore?: number | null;
    marketingScore?: number | null;
    seoScore?: number | null;
    socialScore?: number | null;
  } | null;
};

type ReportPayload = {
  free: {
    publicId: string;
    assessmentId: string;
    company?: string | null;
    growthScore?: number | null;
    biggestOpportunity?: string | null;
    recommendedChannels?: string[];
    competitors?: Competitor[];
    contactName?: string | null;
  };
  full: {
    analysis?: {
      executiveSummary?: string;
      businessOpportunity?: string;
      keyChallenges?: string[];
      keyOpportunities?: string[];
      strategicPriorities?: string[];
      channelExplanations?: { channel: string; explanation: string; role: string; priority: string; guidance: string }[];
      competitorSummary?: {
        competitiveSummary?: string;
        opportunities?: string[];
      };
      coldCallScript?: {
        opening?: string;
        discoveryQuestions?: string[];
        meetingBooking?: string;
      };
      planNarrative?: { overview?: string };
    };
    pricing?: {
      adSpendInr?: number;
      managementFeeInr?: number;
      setupFeeInr?: number;
      gstInr?: number;
      totalInvestmentInr?: number;
      managementFeePct?: number;
    };
    roi?: { scenarios?: { name: string; leads: number; customers: number; revenueInr: number; roiMultiple: number }[] };
    plan90Day?: {
      phase1?: { title: string; days: string; tasks: string[] };
      phase2?: { title: string; days: string; tasks: string[] };
      phase3?: { title: string; days: string; tasks: string[] };
    };
  } | null;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay() {
  return new Promise<void>((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay failed to load"));
    document.body.appendChild(script);
  });
}

export default function Growth360ReportPage() {
  const params = useParams<{ publicId: string }>();
  const [data, setData] = useState<ReportPayload | null>(null);
  const [error, setError] = useState("");
  const [notReady, setNotReady] = useState(false);
  const [bookingMsg, setBookingMsg] = useState("");
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", preferredAt: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const id = params.publicId;
      let res = await apiFetch<ReportPayload>(`/api/growth360/report/${id}`);
      if (!res.ok && res.notReady) {
        res = await apiFetch<ReportPayload>(`/api/growth360/results/${id}`);
      }
      if (!res.ok && res.notReady) {
        res = await apiFetch<ReportPayload>(`/api/growth360/${id}`);
      }
      if (cancelled) return;
      if (!res.ok) {
        if (res.notReady) setNotReady(true);
        else setError(res.error || "Not found");
        return;
      }
      const payload = res.data;
      if (!payload.full && payload.free?.assessmentId) {
        await apiFetch("/api/growth360/unlock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ assessmentId: payload.free.assessmentId, unlock: true }),
        });
        const again = await apiFetch<ReportPayload>(`/api/growth360/report/${id}`);
        if (!cancelled && again.ok) {
          setData(again.data);
          return;
        }
      }
      setData(payload);
      if (payload.free?.contactName) {
        setForm((f) => ({ ...f, name: payload.free.contactName || f.name }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.publicId]);

  async function startPayment() {
    if (!data?.free?.assessmentId) return;
    setPaying(true);
    setBookingMsg("");
    try {
      const createRes = await apiFetch<{
        paymentId: string;
        orderId: string;
        amountPaise: number;
        keyId: string;
        mock?: boolean;
      }>("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: data.free.assessmentId,
          name: form.name,
          email: form.email,
          whatsapp: form.whatsapp,
        }),
      });
      if (!createRes.ok) {
        if (createRes.notReady) throw new Error("Module API not ready");
        throw new Error(createRes.error || "Payment create failed");
      }
      const order = createRes.data;

      async function book(paymentId: string) {
        const bookRes = await apiFetch<{ message?: string }>("/api/payments/book", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentId: data!.free.assessmentId,
            paymentId,
            name: form.name,
            email: form.email,
            whatsapp: form.whatsapp,
            preferredAt: form.preferredAt ? new Date(form.preferredAt).toISOString() : undefined,
          }),
        });
        if (!bookRes.ok) {
          if (bookRes.notReady) throw new Error("Module API not ready");
          throw new Error(bookRes.error || "Booking failed");
        }
        setBookingMsg(bookRes.data.message || "Strategy call reserved.");
      }

      if (order.mock) {
        const verifyRes = await apiFetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId: order.paymentId,
            razorpay_order_id: order.orderId,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: "mock",
          }),
        });
        if (!verifyRes.ok) throw new Error(verifyRes.error || "Verify failed");
        await book(order.paymentId);
        return;
      }

      await loadRazorpay();
      const rzp = new window.Razorpay!({
        key: order.keyId,
        amount: order.amountPaise,
        currency: "INR",
        name: "DisplayAvenue Growth360",
        description: "₹99 Strategy Call",
        order_id: order.orderId,
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await apiFetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, paymentId: order.paymentId }),
          });
          if (!verifyRes.ok) {
            setBookingMsg("Payment verification failed. Please contact support.");
            return;
          }
          try {
            await book(order.paymentId);
          } catch (e) {
            setBookingMsg(e instanceof Error ? e.message : "Booking failed");
          }
        },
      });
      rzp.open();
    } catch (e) {
      setBookingMsg(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  if (notReady) {
    return (
      <main className="container" style={{ padding: "2.5rem 0" }}>
        <ModuleNotReady moduleName="Growth360 report" />
      </main>
    );
  }
  if (error) {
    return (
      <main className="container" style={{ padding: "2.5rem 0" }}>
        <EmptyState title={error} />
      </main>
    );
  }
  if (!data) return <LoadingBlock label="Loading report…" />;

  const { free, full } = data;
  const competitors = asArray<Competitor>(free.competitors);
  const pricing = full?.pricing;
  const analysis = full?.analysis;

  return (
    <main className="container" style={{ padding: "1.25rem 0 4rem" }}>
      <div className="display" style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "1rem" }}>
        DisplayAvenue Growth360 Report
      </div>

      {!full ? (
        <EmptyState
          title="Full report not unlocked yet"
          detail="Free results are ready. Unlock analysis will appear here once the report API returns full data."
        />
      ) : (
        <>
          {analysis?.executiveSummary && <Section title="Executive Summary" body={analysis.executiveSummary} />}
          <Section
            title="Growth Score"
            body={`Overall score: ${typeof free.growthScore === "number" ? free.growthScore : "—"}. Opportunity: ${free.biggestOpportunity || "—"}`}
          />
          {analysis?.businessOpportunity && <Section title="Business Opportunity" body={analysis.businessOpportunity} />}

          <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
            <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>Competitive Landscape</h2>
            {analysis?.competitorSummary?.competitiveSummary && <p>{analysis.competitorSummary.competitiveSummary}</p>}
            {competitors.length === 0 ? (
              <p style={{ margin: 0, color: "var(--muted)" }}>No competitors matched yet.</p>
            ) : (
              <div style={{ display: "grid", gap: "0.6rem" }}>
                {competitors.map((c) => (
                  <div key={c.id} style={{ borderTop: "1px solid var(--line)", paddingTop: "0.6rem" }}>
                    <strong>{c.name}</strong> · {c.city || "—"}
                    <div style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
                      Overall {c.scores?.overallScore ?? "—"} · Digital {c.scores?.digitalScore ?? "—"} · Marketing {c.scores?.marketingScore ?? "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {asArray(analysis?.channelExplanations).length > 0 && (
            <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
              <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>Marketing Strategy</h2>
              {analysis!.channelExplanations!.map((ch) => (
                <div key={ch.channel} style={{ marginBottom: "0.8rem" }}>
                  <strong>{ch.channel}</strong> · {ch.role} · {ch.priority}
                  <div>{ch.explanation}</div>
                  <div style={{ color: "var(--muted)" }}>{ch.guidance}</div>
                </div>
              ))}
            </section>
          )}

          {pricing && (
            <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
              <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>Budget &amp; Management Fee</h2>
              {typeof pricing.adSpendInr === "number" && <p>Ad Spend: ₹{pricing.adSpendInr.toLocaleString("en-IN")}</p>}
              {typeof pricing.managementFeeInr === "number" && (
                <p>
                  Management Fee{typeof pricing.managementFeePct === "number" ? ` (${Math.round(pricing.managementFeePct * 100)}%)` : ""}: ₹
                  {pricing.managementFeeInr.toLocaleString("en-IN")}
                </p>
              )}
              {typeof pricing.setupFeeInr === "number" && <p>Setup Fee: ₹{pricing.setupFeeInr.toLocaleString("en-IN")}</p>}
              {typeof pricing.gstInr === "number" && <p>GST: ₹{pricing.gstInr.toLocaleString("en-IN")}</p>}
              {typeof pricing.totalInvestmentInr === "number" && (
                <p style={{ fontWeight: 800 }}>Total Investment: ₹{pricing.totalInvestmentInr.toLocaleString("en-IN")}</p>
              )}
            </section>
          )}

          {asArray(full.roi?.scenarios).length > 0 && (
            <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
              <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>ROI Scenarios</h2>
              {full.roi!.scenarios!.map((s) => (
                <p key={s.name}>
                  {s.name}: {s.leads} leads · {s.customers} customers · ₹{s.revenueInr.toLocaleString("en-IN")} · {s.roiMultiple}x
                </p>
              ))}
            </section>
          )}

          {full.plan90Day && (
            <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
              <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>90-Day Growth Plan</h2>
              {analysis?.planNarrative?.overview && <p>{analysis.planNarrative.overview}</p>}
              {[full.plan90Day.phase1, full.plan90Day.phase2, full.plan90Day.phase3].filter(Boolean).map((phase) => (
                <div key={phase!.days} style={{ marginTop: "0.8rem" }}>
                  <strong>{phase!.title} · {phase!.days}</strong>
                  <ul>{asArray<string>(phase!.tasks).map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              ))}
            </section>
          )}
        </>
      )}

      <section className="panel" style={{ padding: "1.4rem", marginTop: "1rem", background: "linear-gradient(145deg,#071833,#123968)", color: "white" }}>
        <h2 className="display" style={{ marginTop: 0 }}>Book a 30-Minute Growth Strategy Call</h2>
        <p style={{ fontSize: "1.4rem", fontWeight: 800, marginTop: 0 }}>₹99 only</p>
        <div style={{ display: "grid", gap: "0.6rem", marginTop: "1rem" }}>
          <input className="input" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" placeholder="WhatsApp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          <input className="input" type="datetime-local" value={form.preferredAt} onChange={(e) => setForm({ ...form, preferredAt: e.target.value })} />
        </div>
        <button
          className="btn"
          style={{ marginTop: "1rem", background: "white", color: "var(--navy)", fontWeight: 800, width: "100%", minHeight: 44 }}
          onClick={startPayment}
          disabled={paying || !form.name || !form.email || form.whatsapp.length < 10 || !data.free?.assessmentId}
        >
          {paying ? "Processing…" : "RESERVE MY ₹99 STRATEGY CALL →"}
        </button>
        {bookingMsg && <p style={{ marginTop: "0.8rem" }}>{bookingMsg}</p>}
      </section>
    </main>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
      <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>{title}</h2>
      <p style={{ marginBottom: 0 }}>{body}</p>
    </section>
  );
}

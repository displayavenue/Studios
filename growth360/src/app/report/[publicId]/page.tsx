"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type FullData = {
  free: {
    publicId: string;
    assessmentId: string;
    company: string | null;
    growthScore: number;
    biggestOpportunity: string;
    recommendedChannels: string[];
    competitors: { id: string; name: string; city?: string; scores?: { overallScore: number; digitalScore: number; marketingScore: number; seoScore: number; socialScore: number } | null }[];
    contactName?: string;
  };
  full: {
    analysis: {
      executiveSummary: string;
      businessOpportunity: string;
      keyChallenges: string[];
      keyOpportunities: string[];
      strategicPriorities: string[];
      channelExplanations: { channel: string; explanation: string; role: string; priority: string; guidance: string }[];
      competitorSummary: {
        competitiveSummary: string;
        competitiveAdvantages: string[];
        competitiveWeaknesses: string[];
        opportunities: string[];
        recommendedActions: string[];
      };
      coldCallScript: {
        opening: string;
        discoveryQuestions: string[];
        qualificationQuestions: string[];
        objectionHandling: { objection: string; response: string }[];
        meetingBooking: string;
      };
      planNarrative: { overview: string; phase1Narrative: string; phase2Narrative: string; phase3Narrative: string };
      source: string;
    };
    pricing: {
      adSpendInr: number;
      managementFeeInr: number;
      setupFeeInr: number;
      gstInr: number;
      totalInvestmentInr: number;
      managementFeePct: number;
    };
    roi: { scenarios: { name: string; leads: number; customers: number; revenueInr: number; roiMultiple: number }[] };
    plan90Day: {
      phase1: { title: string; days: string; tasks: string[] };
      phase2: { title: string; days: string; tasks: string[] };
      phase3: { title: string; days: string; tasks: string[] };
    };
  } | null;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function ReportPage() {
  const params = useParams<{ publicId: string }>();
  const [data, setData] = useState<FullData | null>(null);
  const [error, setError] = useState("");
  const [bookingMsg, setBookingMsg] = useState("");
  const [paying, setPaying] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "", preferredAt: "" });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/analysis/${params.publicId}`);
        const json = await res.json();
        if (cancelled) return;
        if (!json.ok) {
          setError(json.error || "Not found");
          return;
        }
        if (!json.data.full) {
          await fetch("/api/report/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ assessmentId: json.data.free.assessmentId, unlock: true }),
          });
          const res2 = await fetch(`/api/analysis/${params.publicId}`);
          const json2 = await res2.json();
          if (!cancelled) setData(json2.data);
        } else {
          setData(json.data);
        }
      } catch {
        if (!cancelled) setError("Failed to load report");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.publicId]);

  async function startPayment() {
    if (!data) return;
    setPaying(true);
    setBookingMsg("");
    try {
      const createRes = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: data.free.assessmentId,
          name: form.name || "Guest",
          email: form.email || "guest@example.com",
          whatsapp: form.whatsapp || "9999999999",
        }),
      });
      const createJson = await createRes.json();
      if (!createJson.ok) throw new Error(createJson.error || "Payment create failed");

      const order = createJson.data;

      if (order.mock) {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentId: order.paymentId,
            razorpay_order_id: order.orderId,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: "mock",
          }),
        });
        const verifyJson = await verifyRes.json();
        if (!verifyJson.ok) throw new Error(verifyJson.error || "Verify failed");

        const bookRes = await fetch("/api/booking/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assessmentId: data.free.assessmentId,
            paymentId: order.paymentId,
            name: form.name,
            email: form.email,
            whatsapp: form.whatsapp,
            preferredAt: form.preferredAt ? new Date(form.preferredAt).toISOString() : undefined,
          }),
        });
        const bookJson = await bookRes.json();
        if (!bookJson.ok) throw new Error(bookJson.error || "Booking failed");
        setBookingMsg(bookJson.data.message);
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
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, paymentId: order.paymentId }),
          });
          const verifyJson = await verifyRes.json();
          if (!verifyJson.ok) {
            setBookingMsg("Payment verification failed. Please contact support.");
            return;
          }
          const bookRes = await fetch("/api/booking/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              assessmentId: data.free.assessmentId,
              paymentId: order.paymentId,
              name: form.name,
              email: form.email,
              whatsapp: form.whatsapp,
              preferredAt: form.preferredAt ? new Date(form.preferredAt).toISOString() : undefined,
            }),
          });
          const bookJson = await bookRes.json();
          setBookingMsg(bookJson.ok ? bookJson.data.message : bookJson.error);
        },
      });
      rzp.open();
    } catch (e) {
      setBookingMsg(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setPaying(false);
    }
  }

  if (error) return <main className="container" style={{ padding: "2rem 0" }}><p>{error}</p></main>;
  if (!data?.full) {
    return (
      <main className="container" style={{ minHeight: "50vh", display: "grid", placeItems: "center" }}>
        <div className="pulse-dot" />
      </main>
    );
  }

  const { free, full } = data;
  const p = full.pricing;

  return (
    <main className="container" style={{ padding: "1.25rem 0 4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div className="display" style={{ fontWeight: 700, color: "var(--navy)" }}>DisplayAvenue Growth360 Report</div>
        <a className="btn btn-secondary" href={`/api/report/${free.publicId}/pdf`}>
          Download PDF
        </a>
      </div>

      <Section title="Executive Summary" body={full.analysis.executiveSummary} />
      <Section title="Growth Score" body={`Overall score: ${free.growthScore}. Opportunity: ${free.biggestOpportunity}`} />
      <Section title="Business Opportunity" body={full.analysis.businessOpportunity} />

      <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>Competitive Landscape</h2>
        <p>{full.analysis.competitorSummary.competitiveSummary}</p>
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {free.competitors.map((c) => (
            <div key={c.id} style={{ borderTop: "1px solid var(--line)", paddingTop: "0.6rem" }}>
              <strong>{c.name}</strong> · {c.city || "—"}
              <div style={{ color: "var(--muted)", fontSize: "0.92rem" }}>
                Overall {c.scores?.overallScore} · Digital {c.scores?.digitalScore} · Marketing {c.scores?.marketingScore} · SEO {c.scores?.seoScore} · Social {c.scores?.socialScore}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Factual database data</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "1rem" }}><strong>AI interpretation:</strong> {(full.analysis.competitorSummary.opportunities || []).join(" · ")}</p>
      </section>

      <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>Marketing Strategy</h2>
        {full.analysis.channelExplanations?.map((ch) => (
          <div key={ch.channel} style={{ marginBottom: "0.8rem" }}>
            <strong>{ch.channel}</strong> · {ch.role} · {ch.priority}
            <div>{ch.explanation}</div>
            <div style={{ color: "var(--muted)" }}>{ch.guidance}</div>
          </div>
        ))}
      </section>

      <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>Budget & DisplayAvenue Management Fee</h2>
        <p>Ad Spend: ₹{p.adSpendInr.toLocaleString("en-IN")}</p>
        <p>Management Fee ({Math.round(p.managementFeePct * 100)}%): ₹{p.managementFeeInr.toLocaleString("en-IN")}</p>
        <p>Setup Fee: ₹{p.setupFeeInr.toLocaleString("en-IN")}</p>
        <p>GST: ₹{p.gstInr.toLocaleString("en-IN")}</p>
        <p style={{ fontWeight: 800 }}>Total Investment: ₹{p.totalInvestmentInr.toLocaleString("en-IN")}</p>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>Numbers from rule engine — AI does not change them.</p>
      </section>

      <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>ROI Scenarios</h2>
        {full.roi.scenarios.map((s) => (
          <p key={s.name}>
            {s.name}: {s.leads} leads · {s.customers} customers · ₹{s.revenueInr.toLocaleString("en-IN")} · {s.roiMultiple}x
          </p>
        ))}
      </section>

      <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>Cold Calling Strategy</h2>
        <p>{full.analysis.coldCallScript.opening}</p>
        <p><strong>Discovery</strong></p>
        <ul>{full.analysis.coldCallScript.discoveryQuestions.map((q) => <li key={q}>{q}</li>)}</ul>
        <p><strong>Meeting</strong>: {full.analysis.coldCallScript.meetingBooking}</p>
      </section>

      <section className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
        <h2 className="display" style={{ marginTop: 0, color: "var(--navy)" }}>90-Day Growth Plan</h2>
        <p>{full.analysis.planNarrative.overview}</p>
        {[full.plan90Day.phase1, full.plan90Day.phase2, full.plan90Day.phase3].map((phase) => (
          <div key={phase.days} style={{ marginTop: "0.8rem" }}>
            <strong>{phase.title} · {phase.days}</strong>
            <ul>{phase.tasks.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        ))}
      </section>

      <section className="panel" style={{ padding: "1.4rem", background: "linear-gradient(145deg,#071833,#123968)", color: "white" }}>
        <h2 className="display" style={{ marginTop: 0 }}>💡 Your Business Has an Opportunity. Let&apos;s Find It.</h2>
        <p>You&apos;ve seen the strategy. Now let&apos;s discuss how to execute it.</p>
        <h3 style={{ marginBottom: "0.35rem" }}>Book a 30-Minute Growth Strategy Call</h3>
        <p style={{ fontSize: "1.4rem", fontWeight: 800, marginTop: 0 }}>₹99 only</p>
        <ul>
          <li>Personalized growth discussion</li>
          <li>Review your competitive position</li>
          <li>Review your marketing strategy</li>
          <li>Discuss investment & ROI</li>
          <li>Get answers specific to your business</li>
        </ul>
        <div style={{ display: "grid", gap: "0.6rem", marginTop: "1rem" }}>
          <input className="option" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="option" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="option" placeholder="WhatsApp" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} />
          <input className="option" type="datetime-local" value={form.preferredAt} onChange={(e) => setForm({ ...form, preferredAt: e.target.value })} />
        </div>
        <button
          className="btn"
          style={{ marginTop: "1rem", background: "white", color: "var(--navy)", fontWeight: 800, width: "100%" }}
          onClick={startPayment}
          disabled={paying || !form.name || !form.email || form.whatsapp.length < 10}
        >
          {paying ? "Processing..." : "RESERVE MY ₹99 STRATEGY CALL →"}
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

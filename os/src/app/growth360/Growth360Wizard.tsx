"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ASSESSMENT_QUESTIONS } from "@/lib/growth360/questions";
import { apiFetch } from "@/lib/clientApi";
import { ModuleNotReady } from "@/components/ModuleState";

type MeUser = { id: string; email: string; name: string };

export default function Growth360Wizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<MeUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [multi, setMulti] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notReady, setNotReady] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [googleReady, setGoogleReady] = useState(true);
  const [bookingFeeInr, setBookingFeeInr] = useState(99);

  const totalSteps = ASSESSMENT_QUESTIONS.length;
  const question = ASSESSMENT_QUESTIONS[step];
  const progress = Math.round(((step + 1) / Math.max(totalSteps, 1)) * 100);
  const googleError = searchParams.get("google_error");

  useEffect(() => {
    (async () => {
      const me = await apiFetch<{ user: MeUser }>("/api/auth/me");
      if (me.ok) setUser(me.data.user);
      setAuthChecked(true);
      if (googleError) setError(`Google sign-in failed: ${googleError}`);
    })();
  }, [googleError]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const res = await apiFetch<{ id: string; publicId: string }>("/api/growth360/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setAssessmentId(res.data.id);
        setPublicId(res.data.publicId);
        return;
      }
      if (res.notReady) setNotReady(true);
      else setError(res.error || "Could not start assessment");
    })();
  }, [user]);

  useEffect(() => {
    (async () => {
      const status = await apiFetch<{ googleConfigured?: boolean; bookingFeeInr?: number }>("/api/auth/google/status");
      if (status.ok) {
        setGoogleReady(Boolean(status.data.googleConfigured));
        if (typeof status.data.bookingFeeInr === "number") setBookingFeeInr(status.data.bookingFeeInr);
      }
    })();
  }, []);

  const canContinue = useMemo(() => {
    if (!question) return false;
    if (question.type === "multi") return multi.length > 0;
    const val = answers[question.key];
    if (question.type === "text") return String(val || "").trim().length > 1;
    return val != null && val !== "";
  }, [answers, multi, question]);

  async function saveAnswers(patch: Record<string, unknown>) {
    if (!assessmentId) return;
    const res = await apiFetch("/api/growth360/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assessmentId, answers: patch, merge: true }),
    });
    if (!res.ok && res.notReady) setNotReady(true);
    if (!res.ok && !res.notReady) throw new Error(res.error || "Failed to save answer");
  }

  async function finishAssessment(finalAnswers?: Record<string, unknown>) {
    if (!assessmentId || !user) return;
    setAnalyzing(true);
    setError("");
    const res = await apiFetch<{ publicId: string }>("/api/growth360/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assessmentId,
        name: user.name,
        email: user.email,
        company: (finalAnswers || answers).company,
      }),
    });
    if (!res.ok) {
      if (res.notReady) setNotReady(true);
      throw new Error(res.error || "Failed to complete assessment");
    }
    const pid = res.data.publicId || publicId;
    if (pid && assessmentId) {
      try {
        sessionStorage.setItem(`g360:${pid}`, assessmentId);
      } catch {
        /* ignore */
      }
    }
    router.push(`/growth360/results/${pid}`);
  }

  async function onSelect(value: string) {
    if (!question) return;
    if (question.type === "multi") {
      setMulti((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
      return;
    }
    const nextAnswers = { ...answers, [question.key]: value };
    setAnswers(nextAnswers);
    setLoading(true);
    setError("");
    try {
      await saveAnswers({ [question.key]: value });
      if (step >= ASSESSMENT_QUESTIONS.length - 1) {
        await finishAssessment(nextAnswers);
        return;
      }
      setStep((s) => s + 1);
    } catch (e) {
      setAnalyzing(false);
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  async function onNext() {
    if (!question) return;
    setLoading(true);
    setError("");
    try {
      const value = question.type === "multi" ? multi : answers[question.key];
      const patch = { [question.key]: value };
      const nextAnswers = { ...answers, ...patch };
      setAnswers(nextAnswers);
      await saveAnswers(patch);
      if (step >= ASSESSMENT_QUESTIONS.length - 1) {
        await finishAssessment(nextAnswers);
        return;
      }
      setStep((s) => s + 1);
      setMulti([]);
    } catch (e) {
      setAnalyzing(false);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (notReady) {
    return (
      <main className="container" style={{ padding: "2.5rem 0" }}>
        <ModuleNotReady moduleName="Growth360" />
        <p style={{ marginTop: "1rem" }}>
          <Link href="/">← Back home</Link>
        </p>
      </main>
    );
  }

  if (!authChecked) {
    return (
      <main className="container" style={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <p style={{ color: "var(--muted)" }}>Checking sign-in…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="container" style={{ padding: "1.25rem 0 3rem", minHeight: "100vh" }}>
        <div className="display" style={{ fontWeight: 700, color: "var(--navy)", marginBottom: "1rem" }}>
          DisplayAvenue Growth360
        </div>
        <div className="panel fade-up" style={{ padding: "1.6rem", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <h1 className="display" style={{ margin: "0 0 0.5rem", fontSize: "1.85rem", color: "var(--navy)" }}>
            Sign in to start
          </h1>
          <p style={{ margin: "0 0 1.4rem", color: "var(--muted)" }}>
            Continue with Google — no forms to fill. Your Growth360 score unlocks after a ₹99 strategy call.
          </p>
          {!googleReady && (
            <p style={{ color: "var(--danger)", marginBottom: "1rem" }}>
              Google sign-in is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.
            </p>
          )}
          <a
            className="btn btn-primary"
            href="/api/auth/google?returnTo=/growth360"
            style={{
              width: "100%",
              minHeight: 48,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              textDecoration: "none",
              pointerEvents: googleReady ? "auto" : "none",
              opacity: googleReady ? 1 : 0.55,
            }}
          >
            <span aria-hidden style={{ fontWeight: 800 }}>G</span>
            Continue with Google
          </a>
          <p style={{ margin: "1rem 0 0", fontSize: ".9rem", color: "var(--muted)" }}>
            Full report unlocks with Razorpay · ₹{bookingFeeInr}
          </p>
          {error && <p style={{ color: "var(--danger)", marginBottom: 0 }}>{error}</p>}
        </div>
      </main>
    );
  }

  if (analyzing) {
    return (
      <main className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <div className="panel fade-up" style={{ padding: "2rem", width: "min(420px, 100%)", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            <span className="pulse-dot" />
            <span className="pulse-dot" style={{ animationDelay: "0.2s" }} />
            <span className="pulse-dot" style={{ animationDelay: "0.4s" }} />
          </div>
          <h2 className="display" style={{ margin: "0 0 0.5rem", color: "var(--navy)" }}>
            Analyzing your growth position
          </h2>
          <p style={{ margin: 0, color: "var(--muted)" }}>Scoring · competitors · strategy · ROI</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", gap: "1rem", flexWrap: "wrap" }}>
        <div className="display" style={{ fontWeight: 700, color: "var(--navy)" }}>DisplayAvenue Growth360</div>
        <div style={{ fontWeight: 600, color: "var(--muted)", fontSize: ".9rem" }}>
          {user.name} · {progress}%
        </div>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: "rgba(7,24,51,0.08)", overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, var(--navy), var(--blue))", transition: "width 0.3s ease" }} />
      </div>

      <div className="panel fade-up" style={{ padding: "1.4rem", maxWidth: 640, margin: "0 auto" }}>
        {question ? (
          <>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{question.icon}</div>
            <h1 className="display" style={{ margin: "0 0 0.4rem", fontSize: "1.75rem", color: "var(--navy)" }}>
              {question.title}
            </h1>
            <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>{question.explanation}</p>

            {question.type === "text" ? (
              <input
                className="input"
                placeholder={question.placeholder}
                value={String(answers[question.key] || "")}
                onChange={(e) => setAnswers((a) => ({ ...a, [question.key]: e.target.value }))}
              />
            ) : (
              <div style={{ display: "grid", gap: "0.7rem" }}>
                {question.options?.map((opt) => {
                  const active =
                    question.type === "multi"
                      ? multi.includes(opt.value)
                      : answers[question.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`option ${active ? "active" : ""}`}
                      onClick={() => onSelect(opt.value)}
                      disabled={loading || !assessmentId}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {(question.type === "text" || question.type === "multi") && (
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "1.1rem" }}
                disabled={!canContinue || loading || !assessmentId}
                onClick={onNext}
              >
                {step >= ASSESSMENT_QUESTIONS.length - 1 ? "See My Growth Score →" : "Continue →"}
              </button>
            )}
          </>
        ) : null}
        {error && <p style={{ color: "var(--danger)", marginBottom: 0 }}>{error}</p>}
      </div>
    </main>
  );
}

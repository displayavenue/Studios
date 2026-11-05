"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ASSESSMENT_QUESTIONS, CONTACT_FIELDS } from "@/lib/questions";

type StartResponse = { ok: boolean; data: { id: string; publicId: string } };

export default function AssessPage() {
  const router = useRouter();
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [multi, setMulti] = useState<string[]>([]);
  const [contact, setContact] = useState({ contactName: "", contactWhatsapp: "", contactEmail: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const totalSteps = ASSESSMENT_QUESTIONS.length + 1;
  const isContact = step >= ASSESSMENT_QUESTIONS.length;
  const question = ASSESSMENT_QUESTIONS[step];
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/assessment/start", { method: "POST" });
      const json = (await res.json()) as StartResponse;
      if (json.ok) setAssessmentId(json.data.id);
    })().catch(() => setError("Could not start assessment"));
  }, []);

  const canContinue = useMemo(() => {
    if (isContact) {
      return contact.contactName.length > 1 && contact.contactEmail.includes("@") && contact.contactWhatsapp.length >= 10;
    }
    if (!question) return false;
    if (question.type === "multi") return multi.length > 0;
    const val = answers[question.key];
    if (question.type === "text") return String(val || "").trim().length > 1;
    return val != null && val !== "";
  }, [answers, contact, isContact, multi, question]);

  async function saveAnswer(key: string, value: unknown, nextStep: number) {
    if (!assessmentId) return;
    await fetch("/api/assessment/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assessmentId, questionKey: key, answerValue: value, step: nextStep }),
    });
  }

  async function onSelect(value: string) {
    if (!question) return;
    if (question.type === "multi") {
      setMulti((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
      return;
    }
    setAnswers((a) => ({ ...a, [question.key]: value }));
    setLoading(true);
    try {
      await saveAnswer(question.key, value, step + 1);
      setStep((s) => s + 1);
    } finally {
      setLoading(false);
    }
  }

  async function onNext() {
    if (!question && !isContact) return;
    setLoading(true);
    setError("");
    try {
      if (!isContact && question) {
        const value = question.type === "multi" ? multi : answers[question.key];
        await saveAnswer(question.key, value, step + 1);
        setStep((s) => s + 1);
        return;
      }
      setAnalyzing(true);
      const res = await fetch("/api/assessment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId,
          ...contact,
          company: answers.company,
        }),
      });
      const json = await res.json();
      if (!json.ok) throw new Error(json.error || "Failed");
      router.push(`/results/${json.data.publicId}`);
    } catch (e) {
      setAnalyzing(false);
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div className="display" style={{ fontWeight: 700, color: "var(--navy)" }}>
          DisplayAvenue Growth360
        </div>
        <div style={{ fontWeight: 700, color: "var(--muted)" }}>{progress}%</div>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: "rgba(7,24,51,0.08)", overflow: "hidden", marginBottom: "1.5rem" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, var(--navy), var(--blue))", transition: "width 0.3s ease" }} />
      </div>

      <div className="panel fade-up" style={{ padding: "1.4rem", maxWidth: 640, margin: "0 auto" }}>
        {!isContact && question ? (
          <>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{question.icon}</div>
            <h1 className="display" style={{ margin: "0 0 0.4rem", fontSize: "1.75rem", color: "var(--navy)" }}>
              {question.title}
            </h1>
            <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>{question.explanation}</p>

            {question.type === "text" ? (
              <input
                className="option"
                style={{ fontWeight: 500 }}
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
                      disabled={loading}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}

            {(question.type === "text" || question.type === "multi") && (
              <button className="btn btn-primary" style={{ width: "100%", marginTop: "1.1rem" }} disabled={!canContinue || loading} onClick={onNext}>
                Continue →
              </button>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📬</div>
            <h1 className="display" style={{ margin: "0 0 0.4rem", fontSize: "1.75rem", color: "var(--navy)" }}>
              Where should we send your results?
            </h1>
            <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>
              So we can personalize your Growth360 report — no spam.
            </p>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {CONTACT_FIELDS.map((f) => (
                <input
                  key={f.key}
                  className="option"
                  style={{ fontWeight: 500 }}
                  placeholder={f.placeholder}
                  value={contact[f.key]}
                  onChange={(e) => setContact((c) => ({ ...c, [f.key]: e.target.value }))}
                />
              ))}
            </div>
            <button className="btn btn-primary" style={{ width: "100%", marginTop: "1.1rem" }} disabled={!canContinue || loading} onClick={onNext}>
              See My Growth Score →
            </button>
          </>
        )}
        {error && <p style={{ color: "#b42318", marginTop: "0.8rem" }}>{error}</p>}
      </div>
    </main>
  );
}

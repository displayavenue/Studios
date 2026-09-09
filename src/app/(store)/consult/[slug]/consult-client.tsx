"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { getAstrologer, MARKETPLACE_DISCLAIMER } from "@/content/marketplace-astrologers";
import { FREE_CONSULT_MINUTES } from "@/config/wallet";

export default function ConsultSessionPage() {
  const params = useParams<{ slug: string }>();
  const search = useSearchParams();
  const mode = search.get("mode") === "call" ? "call" : "chat";
  const a = useMemo(() => getAstrologer(String(params.slug)), [params.slug]);
  const [messages, setMessages] = useState<Array<{ role: "user" | "astro"; text: string }>>([
    {
      role: "astro",
      text: "Namaste — this is a demo consultation room. Share what you’d like to reflect on (career, love, family). Guidance is interpretive entertainment only.",
    },
  ]);
  const [input, setInput] = useState("");
  const [calling, setCalling] = useState(mode === "call");
  const [minutes, setMinutes] = useState(1);
  const [walletNote, setWalletNote] = useState<string | null>(null);

  // Tick session minutes for demo billing preview
  useEffect(() => {
    if (mode === "call" && calling) return;
    const t = setInterval(() => setMinutes((m) => m + 1), 60_000);
    return () => clearInterval(t);
  }, [mode, calling]);

  async function maybeCharge() {
    if (!a) return;
    const res = await fetch("/api/wallet/charge-consult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expertSlug: a.slug, minutes }),
    });
    const data = await res.json();
    if (res.status === 401) {
      setWalletNote("Login + wallet required after free minutes. /wallet");
      return;
    }
    if (res.status === 402) {
      setWalletNote(data.message || "Insufficient balance — recharge wallet.");
      return;
    }
    if (res.ok && data.charged > 0) {
      setWalletNote(`Charged ₹${data.charged}. Balance ₹${data.balanceInr}.`);
    }
  }

  if (!a) {
    return (
      <div className="container-jk py-16 text-center">
        <h1 className="text-2xl font-bold">Expert not found</h1>
        <Link href="/chat-with-astrologer" className="mt-4 inline-block text-[var(--at-yellow-ink)]">
          Back to listing
        </Link>
      </div>
    );
  }

  function send() {
    if (!input.trim()) return;
    const q = input.trim();
    setInput("");
    setMessages((m) => [
      ...m,
      { role: "user", text: q },
      {
        role: "astro",
        text: `(Demo reply from ${a!.name}) Thanks for sharing. In a live session we’d open your chart themes around “${q.slice(0, 80)}”. For deeper work, try Free Kundli or a PDF report.`,
      },
    ]);
    void maybeCharge();
  }

  return (
    <div className="at-home min-h-[70vh]">
      <div className="container-jk max-w-3xl py-8">
        <div className="at-card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-[var(--jk-line)] bg-white px-4 py-3">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: a.accent }}
              >
                {a.initials}
              </div>
              <div>
                <p className="font-semibold">{a.name}</p>
                <p className="text-xs text-emerald-600">
                  {a.online ? "online" : "offline"} · ₹{a.pricePerMinInr}/min · {mode} · ~{minutes}m
                  {minutes <= FREE_CONSULT_MINUTES ? " (free intro)" : ""}
                </p>
              </div>
            </div>
            <Link href={mode === "call" ? "/talk-to-astrologer" : "/chat-with-astrologer"} className="text-sm font-medium text-[var(--jk-muted)]">
              End
            </Link>
          </div>

          {mode === "call" && calling ? (
            <div className="flex flex-col items-center justify-center gap-4 bg-[var(--jk-ink)] px-6 py-16 text-white">
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold"
                style={{ background: a.accent }}
              >
                {a.initials}
              </div>
              <p className="text-lg font-semibold">Calling {a.name}…</p>
              <p className="max-w-sm text-center text-sm text-white/65">
                Demo call UI only — telephony is not connected. Switch to chat or continue with reports.
              </p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setCalling(false)} className="at-cta h-11 px-5 text-sm text-[var(--jk-ink)]">
                  Open chat instead
                </button>
                <Link href="/talk-to-astrologer" className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 text-sm">
                  Cancel
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="max-h-[28rem] space-y-3 overflow-y-auto bg-[var(--at-cream)] px-4 py-4">
                {messages.map((m, i) => (
                  <p
                    key={i}
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                      m.role === "user"
                        ? "ml-auto bg-[var(--at-yellow)]/50 text-[var(--jk-ink)]"
                        : "bg-white text-[var(--jk-ink)] shadow-sm"
                    }`}
                  >
                    {m.text}
                  </p>
                ))}
              </div>
              <div className="flex gap-2 border-t border-[var(--jk-line)] bg-white p-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Type a message…"
                  className="h-11 flex-1 rounded-full border border-[var(--jk-line)] px-4 text-sm outline-none focus:border-[var(--at-yellow)]"
                />
                <button type="button" onClick={send} className="at-cta h-11 px-5 text-sm">
                  Send
                </button>
              </div>
            </>
          )}
        </div>
        <p className="mt-4 text-xs text-[var(--jk-muted)]">{MARKETPLACE_DISCLAIMER}</p>
        {walletNote && <p className="mt-2 text-sm text-[var(--at-yellow-ink)]">{walletNote}</p>}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <Link href="/wallet" className="font-semibold text-[var(--at-yellow-ink)]">
            Wallet →
          </Link>
          <Link href="/free-kundli" className="font-semibold text-[var(--at-yellow-ink)]">
            Free Kundli →
          </Link>
          <Link href="/services" className="font-semibold text-[var(--at-yellow-ink)]">
            PDF reports →
          </Link>
        </div>
      </div>
    </div>
  );
}

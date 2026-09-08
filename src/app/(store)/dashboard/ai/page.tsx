"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHero, SectionShell, Surface, GoldCtaLink } from "@/components/site/page-chrome";

type Msg = { role: "user" | "assistant"; content: string };

export default function AiPage() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content: "Ask a reflective question about your chart. Guidance is interpretive and for entertainment only.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [unlockError, setUnlockError] = useState<string | null>(null);

  async function send() {
    if (!input.trim() || pending) return;
    const question = input.trim();
    setInput("");
    setPending(true);
    setUnlockError(null);
    setMessages((m) => [...m, { role: "user", content: question }]);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login?next=/dashboard/ai";
        return;
      }
      if (res.status === 403) {
        setUnlockError(data.message || "Unlock required");
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Buy a report or membership to continue chatting." },
        ]);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Chat failed");
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: e instanceof Error ? e.message : "Something went wrong" },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <PageHero
        eyebrow="Ask anything"
        title="AI astrology chat"
        subtitle="Conversational guidance grounded in your chart context."
      />
      <SectionShell muted>
        <Surface className="mx-auto max-w-2xl">
          <div className="max-h-[28rem] space-y-3 overflow-y-auto rounded-2xl bg-[#f8f9fb] p-4">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`rounded-2xl px-3 py-2 text-sm ${
                  m.role === "user" ? "ml-8 bg-[var(--jk-navy)] text-white" : "mr-8 bg-white text-[var(--jk-ink)]"
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>
          {unlockError && (
            <div className="mt-4 flex flex-wrap gap-3">
              <GoldCtaLink href="/membership">Get membership</GoldCtaLink>
              <Link href="/services" className="inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold">
                Buy a report
              </Link>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="What should I reflect on this week?"
              className="h-11 flex-1 rounded-full border border-[var(--jk-line)] bg-white px-4 text-sm outline-none focus:border-[var(--jk-gold)]"
            />
            <button type="button" onClick={send} disabled={pending} className="gold-btn h-11 px-5 text-sm disabled:opacity-60">
              {pending ? "…" : "Send"}
            </button>
          </div>
        </Surface>
      </SectionShell>
    </div>
  );
}

"use client";
import { useState, useTransition } from "react";

export default function AiAssistantPage() {
  const [q, setQ] = useState("What is today's contribution?");
  const [answer, setAnswer] = useState<Record<string, unknown> | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">VELORA AI</h1>
        <p className="mt-2 text-sm text-[#8fa396]">Answers use actual database data. Never invents missing metrics.</p>
      </div>
      <div className="admin-panel p-5">
        <textarea value={q} onChange={(e) => setQ(e.target.value)} className="min-h-24 w-full rounded-md border border-white/10 bg-black/20 p-3 text-sm" />
        <button
          disabled={pending}
          className="mt-3 rounded-md bg-emerald-700 px-4 py-2 text-sm"
          onClick={() => start(async () => {
            const res = await fetch("/api/admin/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q }) });
            setAnswer(await res.json());
          })}
        >
          {pending ? "Thinking…" : "Ask"}
        </button>
      </div>
      {answer && (
        <div className="admin-panel space-y-3 p-5 text-sm">
          <div><span className="text-[#8fa396]">OBSERVATION</span><p className="mt-1 text-white">{String(answer.observation)}</p></div>
          <div><span className="text-[#8fa396]">DATA</span><pre className="mt-1 overflow-auto text-xs text-[#c5d0c8]">{JSON.stringify(answer.data, null, 2)}</pre></div>
          <div><span className="text-[#8fa396]">RECOMMENDATION</span><p className="mt-1">{String(answer.recommendation)}</p></div>
          <div><span className="text-[#8fa396]">EXPECTED IMPACT</span><p className="mt-1">{String(answer.expectedImpact)}</p></div>
          <div><span className="text-[#8fa396]">RISK</span><p className="mt-1">{String(answer.risk)}</p></div>
          <div><span className="text-[#8fa396]">CONFIDENCE</span><p className="mt-1">{String(answer.confidence)}</p></div>
        </div>
      )}
    </div>
  );
}

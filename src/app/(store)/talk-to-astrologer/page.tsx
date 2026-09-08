import { Suspense } from "react";
import { AstrologerDirectory } from "@/components/marketplace/astrologer-directory";

export const metadata = {
  title: "Call with Astrologer",
  description: "Call sample JyotishKundali marketplace astrologers — demo consult UI.",
};

export default function TalkToAstrologerPage() {
  return (
    <div className="at-home min-h-screen">
      <div className="container-jk py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Consultations</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Call with <span className="text-[var(--at-yellow-ink)]">Astrologer</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--jk-muted)]">
          One-on-one voice call UI in demo mode. Real telephony is not connected yet — this mirrors the AstroTalk-style call listing.
        </p>
        <div className="mt-8">
          <Suspense fallback={<p className="text-sm text-[var(--jk-muted)]">Loading experts…</p>}>
            <AstrologerDirectory mode="call" />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

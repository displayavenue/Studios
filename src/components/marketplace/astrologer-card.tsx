import Link from "next/link";
import type { MarketplaceAstrologer } from "@/content/marketplace-astrologers";

type CardExpert = MarketplaceAstrologer & { source?: "live" | "sample" };

export function AstrologerCard({
  a,
  mode = "both",
}: {
  a: CardExpert;
  mode?: "chat" | "call" | "both";
}) {
  return (
    <article className="at-card flex flex-col p-4">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: a.accent }}
            aria-hidden
          >
            {a.initials}
          </div>
          <span
            className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${
              a.online ? "bg-emerald-500" : "bg-slate-300"
            }`}
            title={a.online ? "Online" : "Offline"}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="truncate text-[15px] font-semibold text-[var(--jk-ink)]">
                {a.name}
                <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                  ✓
                </span>
              </p>
              <p className="mt-0.5 text-xs text-[var(--jk-muted)]">{a.specialties.join(" · ")}</p>
              <p className="mt-0.5 text-xs text-[var(--jk-muted)]">{a.languages.join(" · ")}</p>
            </div>
            <span className="shrink-0 rounded-full bg-[var(--at-yellow)]/25 px-2 py-0.5 text-[10px] font-semibold text-[var(--jk-ink)]">
              {a.source === "live" ? "Live" : a.badge}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[var(--jk-muted)]">
              {a.yearsExp} yrs exp · ★ {a.rating.toFixed(1)} · {a.reviewsLabel}
            </span>
            <span className="font-semibold text-[var(--jk-ink)]">₹{a.pricePerMinInr}/min</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        {(mode === "chat" || mode === "both") && (
          <Link
            href={`/consult/${a.slug}?mode=chat`}
            className="flex-1 rounded-full border border-[var(--jk-line)] py-2 text-center text-sm font-semibold hover:border-[var(--at-yellow)] hover:bg-[var(--at-yellow)]/15"
          >
            Chat
          </Link>
        )}
        {(mode === "call" || mode === "both") && (
          <Link
            href={`/consult/${a.slug}?mode=call`}
            className="flex-1 rounded-full border border-[var(--jk-line)] py-2 text-center text-sm font-semibold hover:border-[var(--at-yellow)] hover:bg-[var(--at-yellow)]/15"
          >
            Call
          </Link>
        )}
      </div>
    </article>
  );
}

import Link from "next/link";
import { PageHero, SectionShell, Surface, GoldCtaLink } from "@/components/site/page-chrome";

export default function AiPage() {
  return (
    <div>
      <PageHero
        eyebrow="Ask anything"
        title="AI astrology chat"
        subtitle="Conversational guidance grounded in your chart context. Available for members and report owners."
      />
      <SectionShell muted>
        <Surface className="mx-auto max-w-2xl">
          <div className="rounded-2xl border border-[var(--jk-line)] bg-[#f8f9fb] p-5 text-sm text-[var(--jk-muted)]">
            Chat requires membership or a purchased report. Wire your LLM provider in the environment, then open this
            console from a logged-in account.
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <GoldCtaLink href="/membership">Get membership</GoldCtaLink>
            <Link
              href="/services"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--jk-line)] bg-white px-7 text-sm font-semibold text-[var(--jk-navy)] transition hover:border-[var(--jk-gold)] hover:text-[var(--jk-gold-dark)]"
            >
              Buy a report
            </Link>
          </div>
        </Surface>
      </SectionShell>
    </div>
  );
}

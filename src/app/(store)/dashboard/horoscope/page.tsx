import Link from "next/link";
import { PageHero, SectionShell, Surface, GoldCtaLink } from "@/components/site/page-chrome";

export default function HoroscopePage() {
  return (
    <div>
      <PageHero
        eyebrow="Daily guidance"
        title="Horoscope"
        subtitle="Personalized daily, weekly, and monthly forecasts unlock after your birth details are saved."
      />
      <SectionShell muted>
        <Surface className="text-center">
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-[var(--jk-muted)]">
            Connect birth data and enable notifications to receive forecast digests. Interpretive guidance only — not
            medical, legal, or financial advice.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <GoldCtaLink href="/dashboard/profile">Add birth details</GoldCtaLink>
            <Link
              href="/services"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--jk-line)] bg-white px-7 text-sm font-semibold text-[var(--jk-navy)] transition hover:border-[var(--jk-gold)] hover:text-[var(--jk-gold-dark)]"
            >
              Browse reports
            </Link>
          </div>
        </Surface>
      </SectionShell>
    </div>
  );
}

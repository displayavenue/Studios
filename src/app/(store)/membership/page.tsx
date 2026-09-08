import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PageHero, SectionShell } from "@/components/site/page-chrome";
import { PRICING } from "@/config/site";
import { formatINR } from "@/lib/utils";

export default function MembershipPage() {
  const features = [
    "All Kundali & birth chart reports",
    "Marriage & compatibility analysis",
    "Career & wealth reports",
    "Dosha analysis guidance",
    "AI Face Self-Discovery",
    "Complete numerology suite",
    "Daily / weekly / monthly horoscope",
    "AI astrology assistant",
    "Family member profiles",
    "Personalized dashboard & support",
  ];

  return (
    <div>
      <PageHero
        eyebrow="Annual membership"
        title="Complete Self-Discovery Premium Membership"
        subtitle={`Unlock premium tools for ${formatINR(PRICING.membershipYearly)}/year — transparent renewal and cancellation.`}
      />

      <SectionShell muted>
        <div className="premium-glow mx-auto max-w-4xl overflow-hidden rounded-3xl p-6 text-white sm:p-10">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="text-2xl" aria-hidden>👑</span>
            <span className="rounded-full bg-[var(--jk-gold)] px-3 py-0.5 text-xs font-semibold text-[var(--jk-navy)]">
              Most Popular
            </span>
          </div>
          <p className="font-display text-4xl text-[var(--jk-gold)]">
            {formatINR(PRICING.membershipYearly)}
            <span className="text-lg font-normal text-white/60">/year</span>
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-white/85">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--jk-gold)]" />
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs text-white/55">
            Membership includes interpretive astrology content for entertainment and self-reflection.
            Cancel anytime from your dashboard.
          </p>
          <Link href="/signup?plan=membership" className="gold-btn mt-8 inline-flex h-12 items-center gap-2 px-7 text-sm">
            Get Premium for {formatINR(PRICING.membershipYearly)}/year
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SectionShell>
    </div>
  );
}

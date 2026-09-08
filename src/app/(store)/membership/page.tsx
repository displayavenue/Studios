import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PRICING } from "@/config/site";
import { formatINR } from "@/lib/utils";

export default function MembershipPage() {
  const features = [
    "Daily personalized horoscope in your dashboard",
    "AI astrology assistant for guided reflection",
    "Member pricing on select premium reports",
    "Priority report generation queue",
    "Family profile slots (up to 3 birth charts)",
  ];

  return (
    <div className="container-jk py-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--jk-purple)]">Annual membership</p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Your cosmic companion, all year</h1>
        <p className="mt-4 text-[var(--jk-muted)]">
          Unlock daily guidance, AI-assisted insights, and member benefits across JyotishKundali.
        </p>
        <p className="mt-6 font-display text-5xl text-[var(--jk-gold)]">
          {formatINR(PRICING.membershipYearly)}
          <span className="text-lg font-normal text-[var(--jk-muted)]">/year</span>
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-xl">
        <div className="site-section">
          <ul className="space-y-4">
            {features.map((f) => (
              <li key={f} className="flex gap-3 text-sm">
                <span className="text-[var(--jk-gold)]">✦</span>
                {f}
              </li>
            ))}
          </ul>
          <p className="disclaimer-strip mt-6">
            Membership includes interpretive astrology content for entertainment and self-reflection. Cancel anytime from your dashboard.
          </p>
          <Button asChild size="lg" className="mt-6 w-full bg-[var(--jk-gold)] text-[var(--jk-navy)] hover:bg-[var(--jk-gold-soft)]">
            <Link href="/signup?plan=membership">Start membership</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

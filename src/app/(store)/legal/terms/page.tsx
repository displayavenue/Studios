import { ASTROLOGY_DISCLAIMER, BRAND } from "@/config/site";
import { PageHero, SectionShell, Surface } from "@/components/site/page-chrome";

export default function TermsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        subtitle={`By using ${BRAND.name}, you agree to these terms.`}
      />
      <SectionShell muted>
        <Surface className="mx-auto max-w-3xl">
          <p className="text-sm leading-relaxed text-[var(--jk-muted)]">
            All astrology, face-reading, numerology, and AI guidance on this platform is for interpretive and
            entertainment purposes only. It is not a substitute for medical, legal, financial, or professional advice.
          </p>
          <p className="mt-4 rounded-xl border border-[var(--jk-line)] bg-[#f8f9fb] p-4 text-xs leading-relaxed text-[var(--jk-muted)]">
            {ASTROLOGY_DISCLAIMER}
          </p>
          <p className="mt-4 text-sm text-[var(--jk-muted)]">
            Membership renews annually unless cancelled. Report purchases are digital goods delivered after successful
            payment. Refunds follow applicable consumer law and our support policy.
          </p>
        </Surface>
      </SectionShell>
    </div>
  );
}

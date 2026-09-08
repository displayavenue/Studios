import { PageHero, SectionShell, Surface, GoldCtaLink } from "@/components/site/page-chrome";

export default function ExpertsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Consultations"
        title="Expert Astrologers"
        subtitle="Live consultations are being prepared. Automated reports are available today."
      />
      <SectionShell muted>
        <Surface className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-[var(--jk-muted)]">
            Expert matching and scheduling are not live yet — we won’t show fake availability. Start with an automated
            Kundali report while booking opens.
          </p>
          <div className="mt-6 flex justify-center">
            <GoldCtaLink href="/services">Browse reports</GoldCtaLink>
          </div>
        </Surface>
      </SectionShell>
    </div>
  );
}

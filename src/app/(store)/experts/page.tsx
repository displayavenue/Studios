import { PageHero, SectionShell, Surface, GoldCtaLink } from "@/components/site/page-chrome";

export default function ExpertsPage() {
  return (
    <div>
      <PageHero
        eyebrow="Consultations"
        title="Expert Astrologers"
        subtitle="Book live sessions with verified Jyotish experts — booking opens soon."
      />
      <SectionShell muted>
        <Surface className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-[var(--jk-muted)]">
            Expert matching and scheduling are being prepared. Start with an automated Kundali report today.
          </p>
          <div className="mt-6 flex justify-center">
            <GoldCtaLink href="/services">Browse reports</GoldCtaLink>
          </div>
        </Surface>
      </SectionShell>
    </div>
  );
}

import { PageHero, SectionShell, Surface } from "@/components/site/page-chrome";

export default function ContactPage() {
  return (
    <div>
      <PageHero
        eyebrow="Support"
        title="Contact"
        subtitle="Questions about reports, membership, or payments? Reach the JyotishKundali team."
      />
      <SectionShell muted>
        <div className="mx-auto grid max-w-4xl gap-5 md:grid-cols-2">
          <Surface>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--jk-gold-dark)]">Email</p>
            <a
              href="mailto:hello@jyotishkundali.com"
              className="mt-3 block font-display text-2xl text-[var(--jk-navy)] hover:text-[var(--jk-gold-dark)]"
            >
              hello@jyotishkundali.com
            </a>
            <p className="mt-3 text-sm text-[var(--jk-muted)]">We typically reply within one business day.</p>
          </Surface>
          <Surface>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--jk-gold-dark)]">Before you write</p>
            <ul className="mt-3 space-y-2 text-sm text-[var(--jk-muted)]">
              <li>Include your order ID for payment issues.</li>
              <li>Birth-detail corrections can be updated in your profile.</li>
              <li>Reports are interpretive guidance, not professional advice.</li>
            </ul>
          </Surface>
        </div>
      </SectionShell>
    </div>
  );
}

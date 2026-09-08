import { PageHero, SectionShell, Surface } from "@/components/site/page-chrome";

export default function BlogPage() {
  return (
    <div>
      <PageHero
        eyebrow="Insights"
        title="Blog"
        subtitle="Articles on Vedic astrology, self-discovery, and cosmic themes — publishing soon."
      />
      <SectionShell muted>
        <Surface className="mx-auto max-w-2xl text-center">
          <p className="text-sm text-[var(--jk-muted)]">
            Editorial content is in progress. Meanwhile, explore personalized reports and membership tools.
          </p>
        </Surface>
      </SectionShell>
    </div>
  );
}

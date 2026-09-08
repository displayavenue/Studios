import { BRAND } from "@/config/site";
import { PageHero, SectionShell, Surface } from "@/components/site/page-chrome";

export default function PrivacyPage() {
  return (
    <div>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle={`${BRAND.name} respects your privacy and handles birth data with care.`}
      />
      <SectionShell muted>
        <Surface className="mx-auto max-w-3xl prose prose-sm prose-headings:font-display">
          <p className="text-[var(--jk-muted)]">
            Birth details and personal data are used solely to generate interpretive astrology reports, manage your
            account, and process payments. We do not sell personal data.
          </p>
          <p className="mt-4 text-[var(--jk-muted)]">
            Payment processing is handled by Razorpay. You may request account deletion by contacting{" "}
            <a href="mailto:hello@jyotishkundali.com" className="text-[var(--jk-gold-dark)] underline">
              hello@jyotishkundali.com
            </a>
            .
          </p>
        </Surface>
      </SectionShell>
    </div>
  );
}

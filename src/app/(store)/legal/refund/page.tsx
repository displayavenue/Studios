import { BRAND } from "@/config/site";
import { PageHero, SectionShell, Surface } from "@/components/site/page-chrome";

export default function RefundPage() {
  return (
    <div>
      <PageHero
        eyebrow="Legal"
        title="Refund Policy"
        subtitle={`How ${BRAND.name} handles digital report refunds.`}
      />
      <SectionShell muted>
        <Surface className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-[var(--jk-muted)]">
          <p>
            Reports are digital goods generated after successful payment. If generation fails for a technical reason on
            our side and we cannot deliver a PDF within a reasonable time, contact support for a refund or regeneration.
          </p>
          <p>
            Because content is personalized and delivered digitally, completed successful downloads are generally not
            refundable except where required by applicable consumer law.
          </p>
          <p>
            Membership renewals can be cancelled anytime before the next billing cycle from your dashboard / support.
          </p>
          <p>
            Email <a className="underline" href="mailto:hello@jyotishkundali.com">hello@jyotishkundali.com</a> with your
            order ID. We typically respond within one business day.
          </p>
        </Surface>
      </SectionShell>
    </div>
  );
}

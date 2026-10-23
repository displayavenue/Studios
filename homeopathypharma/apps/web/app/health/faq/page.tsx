import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Health FAQ", "/health/faq", "Common questions about educational health content.");

export default function Page() {
  return (
    <ContentPage title="Health FAQ" description="Common questions about our educational health pages." path="/health/faq">
      <ul className="faq-list">
        <li>
          <details open>
            <summary>Is this medical advice?</summary>
            <p>No. Health pages are educational. For personal care, consult a qualified practitioner.</p>
          </details>
        </li>
        <li>
          <details>
            <summary>Can I buy medicines from health pages?</summary>
            <p>Health pages may link to shop discovery. Product pages include labelling, directions, and warnings.</p>
          </details>
        </li>
        <li>
          <details>
            <summary>Where can I talk to a doctor?</summary>
            <p>
              Browse the <Link href="/doctors/" className="hp-link">Mumbai doctor directory</Link> and request a consultation.
            </p>
          </details>
        </li>
      </ul>
    </ContentPage>
  );
}

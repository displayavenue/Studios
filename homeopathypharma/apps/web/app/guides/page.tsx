import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Guides", "/guides", "Practical homeopathy education guides.");

export default function Page() {
  return (
    <ContentPage title="Guides" description="Practical educational guides for browsing remedies and consultations." path="/guides">
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.75rem" }}>
        <li><Link href="/how-it-works/" className="hp-link">How HomeopathyPharma works</Link></li>
        <li><Link href="/remedies/" className="hp-link">Browse remedy monographs</Link></li>
        <li><Link href="/consult/" className="hp-link">Book a consultation</Link></li>
        <li><Link href="/faq/" className="hp-link">Frequently asked questions</Link></li>
      </ul>
    </ContentPage>
  );
}

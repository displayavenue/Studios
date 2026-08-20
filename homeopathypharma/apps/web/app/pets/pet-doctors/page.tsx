import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Pet doctors", "/pets/pet-doctors", "Find pet-focused homeopathy guidance.");

export default function Page() {
  return (
    <ContentPage title="Pet doctors" description="Request guidance for pet care under qualified supervision." path="/pets/pet-doctors">
      <p style={{ maxWidth: "60ch" }}>
        Pet consultations should involve a qualified veterinary professional. Browse pet-care products for discovery,
        and contact support if you need help finding appropriate guidance.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
        <Link href="/pets/pet-consultation/"><Button variant="accent">Request pet consultation</Button></Link>
        <Link href="/shop/health-areas/pet-care/"><Button variant="secondary">Pet care products</Button></Link>
      </div>
    </ContentPage>
  );
}

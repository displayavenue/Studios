import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "How it works",
  "/how-it-works",
  "Browse remedies, consult practitioners, and manage orders in one place.",
);

export default function Page() {
  return (
    <ContentPage title="How it works" description="Browse remedies, consult practitioners, and manage orders in one place." path="/how-it-works">
      <ol style={{ maxWidth: "60ch", lineHeight: "var(--hp-leading-relaxed)" }}>
        <li>Explore the shop or health knowledge hub for educational context.</li>
        <li>Add products to cart; checkout uses secure, API-backed order creation.</li>
        <li>Book online or offline consultations with verified practitioners when you need guidance.</li>
        <li>Track orders and manage prescriptions from your account dashboard.</li>
      </ol>
    </ContentPage>
  );
}

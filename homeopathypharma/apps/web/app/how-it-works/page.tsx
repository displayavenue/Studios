import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "How it works",
  "/how-it-works",
  "Browse remedies, consult practitioners, and manage orders in one place.",
);

export default function Page() {
  return (
    <ContentPage
      title="How it works"
      description="Browse remedies, consult practitioners, and manage orders in one place."
      path="/how-it-works"
    >
      <ol style={{ maxWidth: "60ch", lineHeight: "var(--hp-leading-relaxed)" }}>
        <li>
          Explore the{" "}
          <Link href="/shop/" className="hp-link">
            shop
          </Link>
          ,{" "}
          <Link href="/remedies/" className="hp-link">
            remedies
          </Link>
          , or{" "}
          <Link href="/health/" className="hp-link">
            health hub
          </Link>{" "}
          for educational context.
        </li>
        <li>Open a product page for potency, pack size, directions, and warnings — then add to cart.</li>
        <li>
          Need guidance? Browse{" "}
          <Link href="/doctors/" className="hp-link">
            Mumbai BHMS practitioners
          </Link>{" "}
          and request an online or clinic consultation.
        </li>
        <li>Complete checkout when payment is enabled for your session, then track your order from your account.</li>
      </ol>
    </ContentPage>
  );
}

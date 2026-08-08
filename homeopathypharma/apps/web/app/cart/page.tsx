import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Your cart",
  "/cart",
  "Review selected products before checkout on HomeopathyPharma.",
);

export default function CartPage() {
  return (
    <ContentPage title="Your cart" path="/cart">
      <p style={{ maxWidth: "60ch" }}>
        Your cart is empty. Browse the catalogue and add products from any product page. Persistent carts sync when
        you are signed in.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--hp-space-3)", marginTop: "var(--hp-space-6)" }}>
        <Link href="/shop/">
          <Button variant="accent">Browse shop</Button>
        </Link>
        <Link href="/remedies/">
          <Button variant="secondary">Explore remedies</Button>
        </Link>
      </div>
    </ContentPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Checkout",
  "/checkout",
  "Complete your HomeopathyPharma order — address, delivery, and payment.",
);

export default function CheckoutPage() {
  return (
    <ContentPage title="Checkout" path="/checkout">
      <ol style={{ paddingLeft: "var(--hp-space-6)", maxWidth: "55ch", lineHeight: "var(--hp-leading-relaxed)" }}>
        <li>Review cart items and pack sizes</li>
        <li>Add shipping address and serviceable PIN code</li>
        <li>Choose delivery method</li>
        <li>Pay securely (Razorpay when payment is enabled for your session)</li>
        <li>Receive order confirmation and tracking</li>
      </ol>
      <p style={{ maxWidth: "60ch", color: "var(--hp-color-text-muted)" }}>
        Your cart is empty right now. Add products from the shop, then return here to complete checkout.
      </p>
      <div style={{ marginTop: "var(--hp-space-6)" }}>
        <Link href="/shop/">
          <Button variant="accent">Continue shopping</Button>
        </Link>
      </div>
    </ContentPage>
  );
}

import type { Metadata } from "next";
import { CHECKOUT_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Checkout",
  robots: renderRobotsMeta(CHECKOUT_ROBOTS),
};

export default function CheckoutPage() {
  return (
    <ContentPage title="Checkout" path="/checkout">
      <ol style={{ paddingLeft: "var(--hp-space-6)", lineHeight: "var(--hp-leading-relaxed)" }}>
        <li>Shipping address — stub</li>
        <li>Delivery method — stub</li>
        <li>Payment — stub (Razorpay integration via API)</li>
        <li>Order review — stub</li>
      </ol>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        By placing an order you confirm you have reviewed product labels and understand remedies are not substitutes
        for professional medical care.
      </p>
    </ContentPage>
  );
}

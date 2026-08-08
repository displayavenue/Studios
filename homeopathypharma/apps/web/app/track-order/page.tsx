import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Track your order",
  "/track-order",
  "Check delivery status with your order ID.",
);

export default function Page() {
  return (
    <ContentPage title="Track your order" description="Enter your order ID and phone to see delivery status." path="/track-order">
      <form style={{ display: "grid", gap: "1rem", maxWidth: "24rem" }}>
        <label style={{ display: "grid", gap: "0.4rem" }}>
          <span>Order ID</span>
          <input name="orderId" required className="hp-focus-ring" style={inputStyle} placeholder="e.g. HP123456" />
        </label>
        <label style={{ display: "grid", gap: "0.4rem" }}>
          <span>Phone used at checkout</span>
          <input name="phone" type="tel" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <Button variant="accent" type="submit">
          Track order
        </Button>
      </form>
    </ContentPage>
  );
}

const inputStyle: CSSProperties = {
  padding: "0.75rem 0.9rem",
  border: "1px solid var(--hp-color-border)",
  borderRadius: "var(--hp-radius-md)",
  font: "inherit",
  background: "var(--hp-color-surface-elevated)",
};

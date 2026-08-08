import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Delivery serviceability",
  "/serviceability",
  "Check whether we deliver to your PIN code.",
);

export default function Page() {
  return (
    <ContentPage
      title="Check delivery"
      description="Enter your PIN code to see if we deliver to your area."
      path="/serviceability"
    >
      <form style={{ display: "grid", gap: "1rem", maxWidth: "20rem" }}>
        <label style={{ display: "grid", gap: "0.4rem" }}>
          <span>PIN code</span>
          <input
            name="pin"
            inputMode="numeric"
            maxLength={6}
            required
            className="hp-focus-ring"
            style={inputStyle}
            placeholder="400001"
          />
        </label>
        <Button variant="accent" type="submit">
          Check availability
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

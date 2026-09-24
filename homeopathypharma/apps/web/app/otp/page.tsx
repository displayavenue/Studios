import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { PRIVATE_PAGE_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  ...buildPageMetadata("Verify OTP", "/otp", "Enter the one-time code sent to your phone or email."),
  robots: renderRobotsMeta(PRIVATE_PAGE_ROBOTS),
};

export default function Page() {
  return (
    <ContentPage
      title="Enter verification code"
      description="Type the 6-digit code we sent to your phone or email."
      path="/otp"
    >
      <form style={{ display: "grid", gap: "1rem", maxWidth: "20rem" }}>
        <label style={{ display: "grid", gap: "0.4rem" }}>
          <span>One-time code</span>
          <input
            name="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            required
            className="hp-focus-ring"
            style={inputStyle}
            placeholder="••••••"
          />
        </label>
        <Button variant="accent" type="submit">
          Verify and continue
        </Button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        <Link href="/login/" className="hp-link">
          Back to sign in
        </Link>
      </p>
    </ContentPage>
  );
}

const inputStyle: CSSProperties = {
  padding: "0.75rem 0.9rem",
  border: "1px solid var(--hp-color-border)",
  borderRadius: "var(--hp-radius-md)",
  font: "inherit",
  letterSpacing: "0.2em",
  background: "var(--hp-color-surface-elevated)",
};

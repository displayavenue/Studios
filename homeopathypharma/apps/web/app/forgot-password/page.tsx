import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { PRIVATE_PAGE_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  ...buildPageMetadata("Reset password", "/forgot-password", "Request a secure password reset link."),
  robots: renderRobotsMeta(PRIVATE_PAGE_ROBOTS),
};

export default function Page() {
  return (
    <ContentPage
      title="Reset password"
      description="Enter your email or mobile and we’ll send a reset link."
      path="/forgot-password"
    >
      <form style={{ display: "grid", gap: "1rem", maxWidth: "24rem" }}>
        <label style={{ display: "grid", gap: "0.4rem" }}>
          <span>Email or mobile</span>
          <input name="identifier" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <Button variant="accent" type="submit">
          Send reset link
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
  background: "var(--hp-color-surface-elevated)",
};

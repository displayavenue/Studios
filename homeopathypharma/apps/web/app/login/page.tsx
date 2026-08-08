import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Log in", "/login", "Sign in to HomeopathyPharma.");

export default function Page() {
  return (
    <ContentPage title="Log in" description="Access your orders, consultations, and saved addresses." path="/login">
      <form style={{ display: "grid", gap: "var(--hp-space-4)", maxWidth: "24rem" }}>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Email or mobile</span>
          <input name="identifier" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Password</span>
          <input name="password" type="password" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <Button variant="accent" type="submit">
          Continue
        </Button>
      </form>
      <p style={{ marginTop: "var(--hp-space-4)" }}>
        <Link href="/forgot-password/" className="hp-link">
          Forgot password
        </Link>
        {" · "}
        <Link href="/signup/" className="hp-link">
          Create account
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

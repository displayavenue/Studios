import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Create account", "/signup", "Join HomeopathyPharma.");

export default function Page() {
  return (
    <ContentPage title="Create account" description="Save addresses, track orders, and manage consultation requests." path="/signup">
      <form style={{ display: "grid", gap: "var(--hp-space-4)", maxWidth: "24rem" }}>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Full name</span>
          <input name="name" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Email</span>
          <input name="email" type="email" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Mobile</span>
          <input name="phone" type="tel" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Password</span>
          <input name="password" type="password" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <Button variant="accent" type="submit">
          Create account
        </Button>
      </form>
      <p style={{ marginTop: "var(--hp-space-4)" }}>
        Already registered?{" "}
        <Link href="/login/" className="hp-link">
          Log in
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

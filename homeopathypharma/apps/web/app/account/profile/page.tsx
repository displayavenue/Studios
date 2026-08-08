import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { accountSectionMetadata } from "@/components/account-section-shell";
import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = accountSectionMetadata("Profile");

export default function Page() {
  return (
    <ContentPage title="Profile" description="Your name, contact details, and preferences." path="/account/profile">
      <form style={{ display: "grid", gap: "1rem", maxWidth: "28rem" }}>
        <label style={{ display: "grid", gap: "0.4rem" }}>
          <span>Full name</span>
          <input name="name" className="hp-focus-ring" style={inputStyle} placeholder="Your name" />
        </label>
        <label style={{ display: "grid", gap: "0.4rem" }}>
          <span>Email</span>
          <input name="email" type="email" className="hp-focus-ring" style={inputStyle} placeholder="you@example.com" />
        </label>
        <label style={{ display: "grid", gap: "0.4rem" }}>
          <span>Mobile</span>
          <input name="phone" type="tel" className="hp-focus-ring" style={inputStyle} placeholder="10-digit mobile" />
        </label>
        <Button variant="accent" type="submit">
          Save profile
        </Button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        <Link href="/account/" className="hp-link">
          Back to account
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

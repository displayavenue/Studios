import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata("Pet consultation", "/pets/pet-consultation", "Request a pet consultation.");

export default function Page() {
  return (
    <ContentPage title="Pet consultation" description="Send a request for pet-care guidance." path="/pets/pet-consultation">
      <form style={{ display: "grid", gap: "1rem", maxWidth: "28rem" }}>
        <label style={{ display: "grid", gap: "0.4rem" }}>
          <span>Your name</span>
          <input name="name" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <label style={{ display: "grid", gap: "0.4rem" }}>
          <span>Pet type</span>
          <select name="species" className="hp-focus-ring" style={inputStyle} defaultValue="dog">
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label style={{ display: "grid", gap: "0.4rem" }}>
          <span>Brief note</span>
          <textarea name="note" rows={4} className="hp-focus-ring" style={inputStyle} />
        </label>
        <Button variant="accent" type="submit">Send request</Button>
      </form>
      <p className="disclaimer-banner" style={{ marginTop: "1.25rem" }}>
        Not a substitute for veterinary emergency care. Use animal products only under qualified guidance.
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

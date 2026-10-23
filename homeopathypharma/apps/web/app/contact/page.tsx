import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Contact us",
  "/contact",
  "Reach HomeopathyPharma support and editorial teams.",
);

export default function Page() {
  return (
    <ContentPage title="Contact us" description="Reach our support and editorial teams." path="/contact">
      <ul className="detail-meta">
        <li>
          <strong>Email</strong>
          <a className="hp-link" href="mailto:support@homeopathypharma.com">
            support@homeopathypharma.com
          </a>
        </li>
        <li>
          <strong>Orders</strong>
          <a className="hp-link" href="mailto:orders@homeopathypharma.com">
            orders@homeopathypharma.com
          </a>
        </li>
        <li>
          <strong>Doctors</strong>
          <a className="hp-link" href="mailto:doctors@homeopathypharma.com">
            doctors@homeopathypharma.com
          </a>
        </li>
        <li>
          <strong>Hours</strong>
          <span>Mon–Sat, 10:00–19:00 IST</span>
        </li>
      </ul>

      <form style={{ display: "grid", gap: "var(--hp-space-4)", maxWidth: "28rem", marginTop: "var(--hp-space-6)" }}>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Name</span>
          <input name="name" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Email</span>
          <input name="email" type="email" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Topic</span>
          <select name="topic" className="hp-focus-ring" style={inputStyle} defaultValue="orders">
            <option value="orders">Orders & shipping</option>
            <option value="consult">Consultations</option>
            <option value="catalogue">Catalogue question</option>
            <option value="editorial">Editorial / content</option>
          </select>
        </label>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Message</span>
          <textarea name="message" rows={4} required className="hp-focus-ring" style={inputStyle} />
        </label>
        <Button variant="accent" type="submit">
          Send message
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

import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";

export const metadata: Metadata = { title: "Inventory" };

export default function InventoryPage() {
  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>Inventory</h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>
            Stock levels and warehouse sync — <code>/v1/admin/inventory</code>.
          </p>
        </div>
      </Container>
    </Section>
  );
}

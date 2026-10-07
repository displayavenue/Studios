import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";

export const metadata: Metadata = { title: "Shipments" };

export default function ShipmentsPage() {
  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>Shipments</h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>
            Shiprocket integration and tracking — <code>/v1/admin/shipments</code>.
          </p>
        </div>
      </Container>
    </Section>
  );
}

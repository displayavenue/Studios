import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>Orders</h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>
            Order search, fulfillment status, and support actions — <code>/v1/admin/orders</code>.
          </p>
        </div>
      </Container>
    </Section>
  );
}

import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";

export const metadata: Metadata = { title: "Coupons" };

export default function CouponsPage() {
  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>Coupons</h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>
            Promotional codes and campaign rules — <code>/v1/admin/coupons</code>.
          </p>
        </div>
      </Container>
    </Section>
  );
}

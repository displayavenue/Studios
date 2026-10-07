import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";

export const metadata: Metadata = { title: "Referrals" };

export default function ReferralsPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-display" style={{ fontSize: "var(--hp-text-3xl)", marginBottom: "var(--hp-space-6)" }}>
          Referrals
        </h1>
        <p className="dashboard-panel" style={{ color: "var(--hp-color-text-muted)" }}>
          Incoming and outgoing referrals from <code>GET /v1/doctor/referrals</code>.
        </p>
      </Container>
    </Section>
  );
}

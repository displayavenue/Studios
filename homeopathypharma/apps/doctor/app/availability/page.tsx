import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";

export const metadata: Metadata = { title: "Availability" };

export default function AvailabilityPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-display" style={{ fontSize: "var(--hp-text-3xl)", marginBottom: "var(--hp-space-6)" }}>
          Availability
        </h1>
        <p className="dashboard-panel" style={{ color: "var(--hp-color-text-muted)" }}>
          Weekly calendar and slot management — stub for <code>PUT /v1/doctor/availability</code>.
        </p>
      </Container>
    </Section>
  );
}

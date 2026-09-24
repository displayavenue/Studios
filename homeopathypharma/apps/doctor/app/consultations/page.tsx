import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";

export const metadata: Metadata = { title: "Consultations" };

export default function ConsultationsPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-display" style={{ fontSize: "var(--hp-text-3xl)", marginBottom: "var(--hp-space-6)" }}>
          Consultations
        </h1>
        <p className="dashboard-panel" style={{ color: "var(--hp-color-text-muted)" }}>
          Active and past consults load from <code>GET /v1/doctor/consultations</code>. Video room links are issued by
          the API when a session starts.
        </p>
      </Container>
    </Section>
  );
}

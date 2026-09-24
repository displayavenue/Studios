import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";

export const metadata: Metadata = { title: "Reviews" };

export default function ReviewsPage() {
  return (
    <Section>
      <Container>
        <h1 className="font-display" style={{ fontSize: "var(--hp-text-3xl)", marginBottom: "var(--hp-space-6)" }}>
          Patient reviews
        </h1>
        <p className="dashboard-panel" style={{ color: "var(--hp-color-text-muted)" }}>
          Moderated reviews from <code>GET /v1/doctor/reviews</code>. Only verified consult reviews are shown after
          platform moderation.
        </p>
      </Container>
    </Section>
  );
}

import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";
import { getDashboardMetrics } from "@/lib/api";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const metrics = await getDashboardMetrics();

  const cards = [
    { label: "Doctor verifications", value: metrics.pendingVerifications },
    { label: "Content reviews", value: metrics.contentReviews },
    { label: "Open orders", value: metrics.openOrders },
    { label: "Flagged reviews", value: metrics.flaggedReviews },
  ];

  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0, fontSize: "var(--hp-text-3xl)" }}>
            Command center
          </h1>
          <p style={{ color: "var(--hp-color-text-muted)", marginBottom: "var(--hp-space-8)" }}>
            Operational overview — metrics from <code>GET /v1/admin/dashboard</code>.
          </p>
          <div className="metric-grid">
            {cards.map((card) => (
              <div key={card.label} className="metric-card">
                <span style={{ fontSize: "var(--hp-text-sm)", color: "var(--hp-color-text-muted)" }}>{card.label}</span>
                <strong>{card.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";
import { getEarnings } from "@/lib/api";

export const metadata: Metadata = { title: "Earnings" };

export default async function EarningsPage() {
  const earnings = await getEarnings();

  return (
    <Section>
      <Container>
        <h1 className="font-display" style={{ fontSize: "var(--hp-text-3xl)", marginBottom: "var(--hp-space-6)" }}>
          Earnings
        </h1>
        <div className="dashboard-grid">
          <div className="dashboard-panel">
            <h2>{earnings.period}</h2>
            <p style={{ fontSize: "var(--hp-text-2xl)", margin: 0, fontFamily: "var(--app-font-display)" }}>
              {earnings.total}
            </p>
          </div>
          <div className="dashboard-panel">
            <h2>Pending payout</h2>
            <p style={{ fontSize: "var(--hp-text-2xl)", margin: 0 }}>{earnings.pending}</p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

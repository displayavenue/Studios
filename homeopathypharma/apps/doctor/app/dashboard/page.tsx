import type { Metadata } from "next";
import { Container, Section, Badge } from "@homeopathypharma/ui";
import { getDashboard } from "@/lib/api";

export const metadata: Metadata = { title: "Dashboard" };

function ScheduleList({ title, items }: { title: string; items: Awaited<ReturnType<typeof getDashboard>>["todaySchedule"] }) {
  return (
    <div className="dashboard-panel">
      <h2>{title}</h2>
      {items.length === 0 ? (
        <p style={{ margin: 0, color: "var(--hp-color-text-muted)", fontSize: "var(--hp-text-sm)" }}>
          No appointments — data from <code>GET /v1/doctor/dashboard</code>.
        </p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: "var(--hp-space-5)" }}>
          {items.map((item) => (
            <li key={item.id} style={{ marginBottom: "var(--hp-space-2)" }}>
              <strong>{item.time}</strong> — {item.patientName}{" "}
              <span className="status-pill">{item.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function DoctorDashboardPage() {
  const data = await getDashboard();

  const verificationVariant =
    data.verificationStatus === "verified"
      ? "success"
      : data.verificationStatus === "action-required"
        ? "warning"
        : "default";

  return (
    <Section>
      <Container>
        <header style={{ marginBottom: "var(--hp-space-8)" }}>
          <h1 className="font-display" style={{ margin: "0 0 var(--hp-space-2)", fontSize: "var(--hp-text-3xl)" }}>
            Today
          </h1>
          <p style={{ margin: 0, color: "var(--hp-color-text-muted)" }}>
            Your schedule and verification at a glance.
          </p>
        </header>

        <div className="dashboard-grid">
          <ScheduleList title="Today's schedule" items={data.todaySchedule} />
          <ScheduleList title="Upcoming consults" items={data.upcomingConsults} />
          <div className="dashboard-panel">
            <h2>Verification</h2>
            <Badge variant={verificationVariant}>{data.verificationStatus}</Badge>
            <p style={{ fontSize: "var(--hp-text-sm)", color: "var(--hp-color-text-muted)", marginTop: "var(--hp-space-4)" }}>
              Upload credentials under Verification when the API is connected.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}

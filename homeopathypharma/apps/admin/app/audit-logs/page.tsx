import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";
import { listAuditLogs } from "@/lib/api";

export const metadata: Metadata = { title: "Audit logs" };

export default async function AuditLogsPage() {
  const logs = await listAuditLogs();

  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>Audit logs</h1>
          <table className="stub-table">
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Actor</th>
                <th scope="col">Action</th>
                <th scope="col">Resource</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ color: "var(--hp-color-text-muted)" }}>
                    Logs from <code>GET /v1/admin/audit-logs</code>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.timestamp}</td>
                    <td>{log.actor}</td>
                    <td>{log.action}</td>
                    <td>{log.resource}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}

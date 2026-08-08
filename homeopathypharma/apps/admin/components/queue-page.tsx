import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";
import { getQueue } from "@/lib/api";

interface QueuePageProps {
  queueId: string;
  title: string;
}

export async function QueuePageShell({ queueId, title }: QueuePageProps) {
  const items = await getQueue(queueId);

  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>{title}</h1>
          <ul className="queue-list">
            {items.length === 0 ? (
              <li style={{ color: "var(--hp-color-text-muted)" }}>
                Queue empty — <code>GET /v1/admin/queues/{queueId}</code>
              </li>
            ) : (
              items.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.title}</strong>
                    <div style={{ fontSize: "var(--hp-text-sm)", color: "var(--hp-color-text-muted)" }}>
                      {item.submittedAt}
                    </div>
                  </div>
                  <span className="status-pill">{item.priority}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

export function queueMetadata(title: string): Metadata {
  return { title };
}

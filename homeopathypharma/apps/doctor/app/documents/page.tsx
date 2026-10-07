import type { Metadata } from "next";
import { Button, Container, Section } from "@homeopathypharma/ui";
import { listVerificationDocuments } from "@/lib/api";

export const metadata: Metadata = { title: "Verification documents" };

export default async function DocumentsPage() {
  const docs = await listVerificationDocuments();

  return (
    <Section>
      <Container>
        <h1 className="font-display" style={{ fontSize: "var(--hp-text-3xl)", marginBottom: "var(--hp-space-6)" }}>
          Verification documents
        </h1>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-4)" }}>
          {docs.map((doc) => (
            <li key={doc.id} className="dashboard-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>{doc.label}</strong>
                <div className="status-pill" style={{ marginTop: "var(--hp-space-2)" }}>
                  {doc.status}
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Upload
              </Button>
            </li>
          ))}
        </ul>
        <p style={{ fontSize: "var(--hp-text-sm)", color: "var(--hp-color-text-muted)", marginTop: "var(--hp-space-6)" }}>
          Files upload to secure storage via <code>POST /v1/doctor/documents</code>.
        </p>
      </Container>
    </Section>
  );
}

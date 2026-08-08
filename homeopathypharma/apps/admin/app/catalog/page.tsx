import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";

export const metadata: Metadata = { title: "Catalog" };

export default function CatalogPage() {
  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>Catalog</h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>
            Product CRUD, variants, and publish workflow — <code>/v1/admin/catalog</code>.
          </p>
        </div>
      </Container>
    </Section>
  );
}

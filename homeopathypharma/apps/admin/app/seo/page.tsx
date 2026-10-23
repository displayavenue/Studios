import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";

export const metadata: Metadata = { title: "SEO & sitemaps" };

export default function SeoPage() {
  return (
    <Section>
      <Container>
        <div className="admin-content">
          <h1 className="font-display" style={{ marginTop: 0 }}>SEO &amp; sitemaps</h1>
          <p style={{ color: "var(--hp-color-text-muted)" }}>
            Sitemap regeneration, robots overrides, and canonical rules via{" "}
            <code>@homeopathypharma/seo</code> and <code>/v1/admin/seo</code>.
          </p>
        </div>
      </Container>
    </Section>
  );
}

import type { Metadata } from "next";
import { Container, Section } from "@homeopathypharma/ui";
import { robotsForPath, renderRobotsMeta } from "@homeopathypharma/seo";

interface ContentPageProps {
  title: string;
  description?: string;
  path: string;
  children: React.ReactNode;
}

export function ContentPage({ title, description, path, children }: ContentPageProps) {
  return (
    <Section>
      <Container>
        <header style={{ marginBottom: "var(--hp-space-8)" }}>
          <h1
            className="font-display"
            style={{
              margin: "0 0 var(--hp-space-3)",
              fontSize: "var(--hp-text-3xl)",
              color: "var(--hp-color-teal-900)",
            }}
          >
            {title}
          </h1>
          {description ? (
            <p style={{ margin: 0, color: "var(--hp-color-text-muted)", maxWidth: "60ch" }}>{description}</p>
          ) : null}
        </header>
        {children}
      </Container>
    </Section>
  );
}

export function buildPageMetadata(
  title: string,
  path: string,
  description?: string,
): Metadata {
  const robots = robotsForPath(path);
  return {
    title,
    description,
    robots: renderRobotsMeta(robots),
  };
}

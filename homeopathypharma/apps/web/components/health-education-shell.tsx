import { ContentPage } from "@/components/content-page";

interface HealthEducationShellProps {
  title: string;
  description?: string;
  path: string;
  apiHint: string;
}

export function HealthEducationShell({ title, description, path, apiHint }: HealthEducationShellProps) {
  return (
    <ContentPage title={title} description={description} path={path}>
      <article className="product-placeholder">{apiHint}</article>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        For general education only. Not intended to diagnose, treat, cure, or prevent any disease. Consult a
        qualified healthcare provider for personal health decisions.
      </p>
    </ContentPage>
  );
}

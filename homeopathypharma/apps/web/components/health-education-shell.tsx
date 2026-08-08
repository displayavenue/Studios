import Link from "next/link";
import { ContentPage } from "@/components/content-page";

interface HealthEducationShellProps {
  title: string;
  description?: string;
  path: string;
  body: string;
  links?: { href: string; label: string }[];
}

export function HealthEducationShell({
  title,
  description,
  path,
  body,
  links = [
    { href: "/health/", label: "Health hub" },
    { href: "/doctors/", label: "Consult a doctor" },
    { href: "/shop/", label: "Shop medicines" },
  ],
}: HealthEducationShellProps) {
  return (
    <ContentPage title={title} description={description} path={path}>
      <article style={{ maxWidth: "65ch", lineHeight: "var(--hp-leading-relaxed)" }}>
        <p style={{ marginTop: 0 }}>{body}</p>
      </article>
      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1.25rem" }}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="hp-link">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        For general education only. Not intended to diagnose, treat, cure, or prevent any disease. Consult a
        qualified healthcare provider for personal health decisions.
      </p>
    </ContentPage>
  );
}

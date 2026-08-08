import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Health knowledge hub",
  "/health",
  "Educational articles on body systems, organs, and conditions — not medical advice.",
);

const hubs = [
  { href: "/health/body-systems/cardiovascular-system/", label: "Body systems", slug: "body-systems" },
  { href: "/health/organs/heart/", label: "Organs", slug: "organs" },
  { href: "/health/conditions/common-cold/", label: "Conditions", slug: "conditions" },
]

export default function HealthHubPage() {
  return (
    <ContentPage
      title="Health knowledge hub"
      description="Curated educational content about how the body works and common wellness topics. Always consult a qualified provider for personal health decisions."
      path="/health"
    >
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-4)" }}>
        {hubs.map((hub) => (
          <li key={hub.slug}>
            <Link href={hub.href} className="hp-link hp-focus-ring font-display" style={{ fontSize: "var(--hp-text-xl)" }}>
              {hub.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-8)" }}>
        Content is for general education only and is not intended to diagnose, treat, cure, or prevent any disease.
      </p>
    </ContentPage>
  );
}

import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

interface LegalAliasPageProps {
  title: string;
  path: string;
  canonicalPath: string;
  note?: string;
}

export function legalAliasMetadata(title: string, path: string, canonicalPath: string): Metadata {
  return {
    ...buildPageMetadata(title, path),
    alternates: { canonical: canonicalPath },
  };
}

/** Flat URL alias that forwards visitors to the canonical /legal/* page (static export safe). */
export function LegalAliasPage({ title, path, canonicalPath, note }: LegalAliasPageProps) {
  return (
    <ContentPage title={title} path={path}>
      <p style={{ marginBottom: "var(--hp-space-4)" }}>
        This page has moved. Continue to the{" "}
        <Link href={canonicalPath} className="hp-link hp-focus-ring">
          canonical {title.toLowerCase()}
        </Link>
        .
      </p>
      <noscript>
        <p>
          <Link href={canonicalPath}>Continue to {title.toLowerCase()}</Link>
        </p>
      </noscript>
      {note ? <p className="disclaimer-banner">{note}</p> : null}
    </ContentPage>
  );
}

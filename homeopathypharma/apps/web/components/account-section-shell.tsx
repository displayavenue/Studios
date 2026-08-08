import type { Metadata } from "next";
import { ACCOUNT_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { ContentPage } from "@/components/content-page";

interface AccountSectionShellProps {
  title: string;
  description: string;
  path: string;
  apiHint: string;
}

export function accountSectionMetadata(title: string): Metadata {
  return {
    title,
    robots: renderRobotsMeta(ACCOUNT_ROBOTS),
  };
}

/** Static account area shell — data loads from authenticated API at runtime. */
export function AccountSectionShell({ title, description, path, apiHint }: AccountSectionShellProps) {
  return (
    <ContentPage title={title} description={description} path={path}>
      <p className="product-placeholder">
        {apiHint} Authentication and authorization are enforced by the API.
      </p>
      <p style={{ marginTop: "var(--hp-space-4)", fontSize: "var(--hp-text-sm)" }}>
        <a href="/account/" className="hp-link hp-focus-ring">
          Back to account overview
        </a>
      </p>
    </ContentPage>
  );
}

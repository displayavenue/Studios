import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { ACCOUNT_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { ContentPage } from "@/components/content-page";

interface AccountSectionShellProps {
  title: string;
  description: string;
  path: string;
  emptyTitle: string;
  emptyBody: string;
  primaryHref?: string;
  primaryLabel?: string;
}

export function accountSectionMetadata(title: string): Metadata {
  return {
    title,
    robots: renderRobotsMeta(ACCOUNT_ROBOTS),
  };
}

export function AccountSectionShell({
  title,
  description,
  path,
  emptyTitle,
  emptyBody,
  primaryHref = "/shop/",
  primaryLabel = "Browse medicines",
}: AccountSectionShellProps) {
  return (
    <ContentPage title={title} description={description} path={path}>
      <div className="account-empty">
        <h2 className="font-display">{emptyTitle}</h2>
        <p>{emptyBody}</p>
        <div className="account-empty__actions">
          <Link href={primaryHref}>
            <Button variant="accent">{primaryLabel}</Button>
          </Link>
          <Link href="/account/" className="hp-link">
            Back to account
          </Link>
        </div>
      </div>
    </ContentPage>
  );
}

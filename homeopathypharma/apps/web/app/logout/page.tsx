import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { PRIVATE_PAGE_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  ...buildPageMetadata("Sign out", "/logout", "End your session securely."),
  robots: renderRobotsMeta(PRIVATE_PAGE_ROBOTS),
};

export default function Page() {
  return (
    <ContentPage title="Sign out" description="End your HomeopathyPharma session." path="/logout">
      <p style={{ maxWidth: "40ch" }}>You can sign out of this device at any time. Shopping as a guest still works.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.25rem" }}>
        <Link href="/">
          <Button variant="accent">Back to home</Button>
        </Link>
        <Link href="/login/">
          <Button variant="secondary">Sign in again</Button>
        </Link>
      </div>
    </ContentPage>
  );
}

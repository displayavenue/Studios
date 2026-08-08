import type { Metadata } from "next";
import { PRIVATE_PAGE_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  ...buildPageMetadata("Sign out", "/logout", "End your session securely."),
  robots: renderRobotsMeta(PRIVATE_PAGE_ROBOTS),
};

export default function Page() {
  return (
    <ContentPage title="Sign out" description="End your session securely." path="/logout">
      <p className="product-placeholder">
        Sign-out calls <code>POST /v1/auth/logout</code> and clears session cookies client-side.
      </p>
    </ContentPage>
  );
}

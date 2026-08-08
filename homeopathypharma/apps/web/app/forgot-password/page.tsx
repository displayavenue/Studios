import type { Metadata } from "next";
import { PRIVATE_PAGE_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  ...buildPageMetadata("Reset password", "/forgot-password", "Request a secure password reset link."),
  robots: renderRobotsMeta(PRIVATE_PAGE_ROBOTS),
};

export default function Page() {
  return (
    <ContentPage title="Reset password" description="Request a secure password reset link." path="/forgot-password">
      <p className="product-placeholder">
        Password reset requests use <code>POST /v1/auth/forgot-password</code>.
      </p>
    </ContentPage>
  );
}

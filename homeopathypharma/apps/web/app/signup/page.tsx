import type { Metadata } from "next";
import { PRIVATE_PAGE_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  ...buildPageMetadata("Create account", "/signup", "Register for orders, consultations, and account features."),
  robots: renderRobotsMeta(PRIVATE_PAGE_ROBOTS),
};

export default function Page() {
  return (
    <ContentPage title="Create account" description="Register for orders, consultations, and account features." path="/signup">
      <p className="product-placeholder">
        Registration form submits to <code>POST /v1/auth/register</code> with server-side validation.
      </p>
    </ContentPage>
  );
}

import type { Metadata } from "next";
import { PRIVATE_PAGE_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  ...buildPageMetadata("Verify OTP", "/otp", "Enter the one-time code sent to your phone or email."),
  robots: renderRobotsMeta(PRIVATE_PAGE_ROBOTS),
};

export default function Page() {
  return (
    <ContentPage title="Verify OTP" description="Enter the one-time code sent to your phone or email." path="/otp">
      <p className="product-placeholder">
        OTP verification posts to <code>POST /v1/auth/verify-otp</code>.
      </p>
    </ContentPage>
  );
}

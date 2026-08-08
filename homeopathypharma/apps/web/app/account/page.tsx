import type { Metadata } from "next";
import { ACCOUNT_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { ContentPage } from "@/components/content-page";
import { getAccount } from "@/lib/api";

export const metadata: Metadata = {
  title: "Account",
  robots: renderRobotsMeta(ACCOUNT_ROBOTS),
};

export default async function AccountPage() {
  const account = await getAccount();

  return (
    <ContentPage
      title="Your account"
      description="Orders, consultations, and profile settings."
      path="/account"
    >
      {account ? (
        <p>
          Signed in as <strong>{account.name}</strong> ({account.email})
        </p>
      ) : (
        <p className="product-placeholder">
          Sign-in state loads from <code>GET /v1/account/me</code>. Authentication is enforced by the API.
        </p>
      )}
    </ContentPage>
  );
}

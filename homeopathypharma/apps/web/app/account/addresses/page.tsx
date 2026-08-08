import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Addresses");

export default function Page() {
  return (
    <AccountSectionShell
      title="Addresses"
      description="Saved shipping and billing addresses."
      path="/account/addresses"
      apiHint="Data loads from GET /v1/account/addresses."
    />
  );
}

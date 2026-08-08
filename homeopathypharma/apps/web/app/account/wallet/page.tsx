import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Wallet");

export default function Page() {
  return (
    <AccountSectionShell
      title="Wallet"
      description="Store credit and wallet balance."
      path="/account/wallet"
      apiHint="Data loads from GET /v1/account/wallet."
    />
  );
}

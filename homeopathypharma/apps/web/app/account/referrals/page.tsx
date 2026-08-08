import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Referrals");

export default function Page() {
  return (
    <AccountSectionShell
      title="Referrals"
      description="Refer friends and track rewards."
      path="/account/referrals"
      apiHint="Data loads from GET /v1/account/referrals."
    />
  );
}

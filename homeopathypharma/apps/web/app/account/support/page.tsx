import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Support");

export default function Page() {
  return (
    <AccountSectionShell
      title="Support"
      description="Help tickets and contact options."
      path="/account/support"
      apiHint="Data loads from GET /v1/account/support."
    />
  );
}

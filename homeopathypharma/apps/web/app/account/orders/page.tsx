import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Orders");

export default function Page() {
  return (
    <AccountSectionShell
      title="Orders"
      description="Order history and status."
      path="/account/orders"
      apiHint="Data loads from GET /v1/account/orders."
    />
  );
}

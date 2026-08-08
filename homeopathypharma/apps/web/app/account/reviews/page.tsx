import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Reviews");

export default function Page() {
  return (
    <AccountSectionShell
      title="Reviews"
      description="Product and consultation reviews you have submitted."
      path="/account/reviews"
      apiHint="Data loads from GET /v1/account/reviews."
    />
  );
}

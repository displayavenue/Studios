import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Coupons");

export default function Page() {
  return (
    <AccountSectionShell
      title="Coupons"
      description="Saved coupon codes and offers."
      path="/account/coupons"
      apiHint="Data loads from GET /v1/account/coupons."
    />
  );
}

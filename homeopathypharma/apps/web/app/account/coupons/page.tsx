import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Coupons");

export default function Page() {
  return (
    <AccountSectionShell
      title="Coupons"
      description="Offers saved to your account."
      path="/account/coupons"
      emptyTitle="No coupons saved"
      emptyBody="Browse current deals and apply codes at checkout when available."
      primaryHref="/shop/offers/"
      primaryLabel="See offers"
    />
  );
}

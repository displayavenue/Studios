import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Wallet");

export default function Page() {
  return (
    <AccountSectionShell
      title="Wallet"
      description="Store credit and refund balance."
      path="/account/wallet"
      emptyTitle="Wallet balance ₹0"
      emptyBody="Refunds and promotional credit will appear here when available."
      primaryHref="/shop/offers/"
      primaryLabel="View offers"
    />
  );
}

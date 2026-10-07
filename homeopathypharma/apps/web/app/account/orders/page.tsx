import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Orders");

export default function Page() {
  return (
    <AccountSectionShell
      title="Orders"
      description="Order history and delivery status."
      path="/account/orders"
      emptyTitle="No orders yet"
      emptyBody="When you place an order, it will show up here with tracking updates."
      primaryHref="/shop/"
      primaryLabel="Shop medicines"
    />
  );
}

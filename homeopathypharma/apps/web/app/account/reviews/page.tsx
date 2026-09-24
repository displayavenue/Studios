import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Reviews");

export default function Page() {
  return (
    <AccountSectionShell
      title="Reviews"
      description="Feedback you have left on products."
      path="/account/reviews"
      emptyTitle="No reviews yet"
      emptyBody="After you receive an order, you can rate products from this page."
      primaryHref="/account/orders/"
      primaryLabel="View orders"
    />
  );
}

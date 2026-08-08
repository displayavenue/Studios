import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Support");

export default function Page() {
  return (
    <AccountSectionShell
      title="Support"
      description="Help with orders, deliveries, and account questions."
      path="/account/support"
      emptyTitle="Need help?"
      emptyBody="Message our support team for order or account questions. We reply on business days."
      primaryHref="/contact/"
      primaryLabel="Contact support"
    />
  );
}

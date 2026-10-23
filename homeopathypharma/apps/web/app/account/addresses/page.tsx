import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Addresses");

export default function Page() {
  return (
    <AccountSectionShell
      title="Addresses"
      description="Saved delivery addresses."
      path="/account/addresses"
      emptyTitle="No saved addresses"
      emptyBody="Add a home or office address so checkout is faster next time."
      primaryHref="/account/profile/"
      primaryLabel="Update profile"
    />
  );
}

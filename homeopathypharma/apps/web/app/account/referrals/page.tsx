import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Referrals");

export default function Page() {
  return (
    <AccountSectionShell
      title="Referrals"
      description="Invite friends and family."
      path="/account/referrals"
      emptyTitle="Share HomeopathyPharma"
      emptyBody="Your personal invite link appears here after you sign in."
      primaryHref="/signup/"
      primaryLabel="Create account"
    />
  );
}

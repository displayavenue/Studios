import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Consultations");

export default function Page() {
  return (
    <AccountSectionShell
      title="Consultations"
      description="Past and upcoming consultation requests."
      path="/account/consultations"
      emptyTitle="No consultations yet"
      emptyBody="Your booking requests and completed sessions will appear here."
      primaryHref="/doctors/"
      primaryLabel="Find a doctor"
    />
  );
}

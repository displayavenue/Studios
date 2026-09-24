import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Prescriptions");

export default function Page() {
  return (
    <AccountSectionShell
      title="Prescriptions"
      description="Prescription notes linked to your consultations."
      path="/account/prescriptions"
      emptyTitle="No prescriptions on file"
      emptyBody="After a consultation, any shared notes will be saved here for your reference."
      primaryHref="/consult/"
      primaryLabel="Book consultation"
    />
  );
}

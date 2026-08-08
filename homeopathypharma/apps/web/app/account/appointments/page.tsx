import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Appointments");

export default function Page() {
  return (
    <AccountSectionShell
      title="Appointments"
      description="Upcoming clinic and video slots."
      path="/account/appointments"
      emptyTitle="No appointments scheduled"
      emptyBody="Book a consultation with a Mumbai BHMS practitioner when you need guidance."
      primaryHref="/consult/"
      primaryLabel="Book consultation"
    />
  );
}

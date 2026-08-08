import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Prescriptions");

export default function Page() {
  return (
    <AccountSectionShell
      title="Prescriptions"
      description="Prescription records linked to your account."
      path="/account/prescriptions"
      apiHint="Data loads from GET /v1/account/prescriptions."
    />
  );
}

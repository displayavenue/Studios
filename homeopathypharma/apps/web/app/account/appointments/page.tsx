import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Appointments");

export default function Page() {
  return (
    <AccountSectionShell
      title="Appointments"
      description="Scheduled in-clinic visits."
      path="/account/appointments"
      apiHint="Data loads from GET /v1/account/appointments."
    />
  );
}

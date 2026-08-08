import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Consultations");

export default function Page() {
  return (
    <AccountSectionShell
      title="Consultations"
      description="Past and upcoming consultations."
      path="/account/consultations"
      apiHint="Data loads from GET /v1/account/consultations."
    />
  );
}

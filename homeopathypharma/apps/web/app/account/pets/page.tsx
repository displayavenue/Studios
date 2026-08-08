import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Pets");

export default function Page() {
  return (
    <AccountSectionShell
      title="Pets"
      description="Your registered companion animals."
      path="/account/pets"
      apiHint="Data loads from GET /v1/account/pets."
    />
  );
}

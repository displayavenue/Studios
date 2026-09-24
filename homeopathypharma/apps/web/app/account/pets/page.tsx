import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Pets");

export default function Page() {
  return (
    <AccountSectionShell
      title="Pets"
      description="Pet profiles for care browsing."
      path="/account/pets"
      emptyTitle="No pets added"
      emptyBody="Add a pet profile to personalise pet-care browsing. Always follow veterinary guidance."
      primaryHref="/shop/health-areas/pet-care/"
      primaryLabel="Browse pet care"
    />
  );
}

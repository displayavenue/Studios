import type { Metadata } from "next";
import { AccountSectionShell, accountSectionMetadata } from "@/components/account-section-shell";

export const metadata: Metadata = accountSectionMetadata("Profile");

export default function Page() {
  return (
    <AccountSectionShell
      title="Profile"
      description="Your name, contact details, and preferences."
      path="/account/profile"
      apiHint="Data loads from GET /v1/account/profile."
    />
  );
}

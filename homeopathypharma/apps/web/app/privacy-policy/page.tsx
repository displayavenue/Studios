import type { Metadata } from "next";
import { LegalAliasPage, legalAliasMetadata } from "@/components/legal-alias-page";

export const metadata: Metadata = legalAliasMetadata(
  "Privacy policy",
  "/privacy-policy",
  "/legal/privacy/",
);

export default function PrivacyPolicyAliasPage() {
  return (
    <LegalAliasPage
      title="Privacy policy"
      path="/privacy-policy"
      canonicalPath="/legal/privacy/"
    />
  );
}

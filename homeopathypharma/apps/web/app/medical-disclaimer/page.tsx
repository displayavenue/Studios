import type { Metadata } from "next";
import { LegalAliasPage, legalAliasMetadata } from "@/components/legal-alias-page";

export const metadata: Metadata = legalAliasMetadata(
  "Medical disclaimer",
  "/medical-disclaimer",
  "/legal/disclaimer/",
);

export default function MedicalDisclaimerAliasPage() {
  return (
    <LegalAliasPage
      title="Medical disclaimer"
      path="/medical-disclaimer"
      canonicalPath="/legal/disclaimer/"
      note="Educational content on HomeopathyPharma is not a substitute for professional medical advice."
    />
  );
}

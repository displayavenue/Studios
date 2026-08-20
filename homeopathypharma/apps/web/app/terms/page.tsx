import type { Metadata } from "next";
import { LegalAliasPage, legalAliasMetadata } from "@/components/legal-alias-page";

export const metadata: Metadata = legalAliasMetadata("Terms of service", "/terms", "/legal/terms/");

export default function TermsAliasPage() {
  return <LegalAliasPage title="Terms of service" path="/terms" canonicalPath="/legal/terms/" />;
}

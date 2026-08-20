import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { RoleLogin } from "@/components/role-login";

export const metadata: Metadata = buildPageMetadata("Patient sign in", "/login/patient", "Sign in to your patient account.");

export default function Page() {
  return (
    <ContentPage title="Patient / customer sign in" description="Access orders, consultations, and saved addresses." path="/login/patient">
      <RoleLogin initialRole="patient" />
    </ContentPage>
  );
}

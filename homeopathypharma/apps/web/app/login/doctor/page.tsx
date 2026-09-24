import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { RoleLogin } from "@/components/role-login";

export const metadata: Metadata = buildPageMetadata("Doctor sign in", "/login/doctor", "Sign in to the doctor portal.");

export default function Page() {
  return (
    <ContentPage title="Doctor sign in" description="Manage consultation requests and your clinic profile." path="/login/doctor">
      <RoleLogin initialRole="doctor" />
    </ContentPage>
  );
}

import type { Metadata } from "next";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { RoleLogin } from "@/components/role-login";

export const metadata: Metadata = buildPageMetadata("Admin sign in", "/login/admin", "Sign in to the admin operations portal.");

export default function Page() {
  return (
    <ContentPage title="Admin sign in" description="Catalogue, homepage CMS, and verification queues." path="/login/admin">
      <RoleLogin initialRole="admin" />
    </ContentPage>
  );
}

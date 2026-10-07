import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { RoleLogin } from "@/components/role-login";

export const metadata: Metadata = buildPageMetadata(
  "Sign in",
  "/login",
  "Sign in as a patient, doctor, or admin on HomeopathyPharma.",
);

export default function Page() {
  return (
    <ContentPage
      title="Sign in"
      description="Choose your role — patient/customer, doctor, or admin — then continue."
      path="/login"
    >
      <RoleLogin initialRole="patient" />
      <p style={{ marginTop: "1.25rem", fontSize: "0.9rem", color: "var(--hp-color-text-muted)" }}>
        Prefer a direct link?{" "}
        <Link href="/login/patient/" className="hp-link">
          Patient
        </Link>
        {" · "}
        <Link href="/login/doctor/" className="hp-link">
          Doctor
        </Link>
        {" · "}
        <Link href="/login/admin/" className="hp-link">
          Admin
        </Link>
      </p>
    </ContentPage>
  );
}

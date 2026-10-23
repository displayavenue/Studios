import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { DOCTORS } from "@/lib/content/doctors";

export const metadata: Metadata = buildPageMetadata(
  "Doctor portal",
  "/doctor",
  "HomeopathyPharma doctor workspace.",
);

export default function DoctorPortalPage() {
  const sample = DOCTORS[0];

  return (
    <ContentPage
      title="Doctor portal"
      description="Review consultation requests, update availability, and manage your listing."
      path="/doctor"
    >
      <div className="portal-panel">
        <p style={{ marginTop: 0 }}>
          Signed in to the doctor workspace. {DOCTORS.length} practitioners are currently listed for Mumbai discovery.
        </p>
        <ul className="portal-links">
          <li>
            <Link href="/doctors/">View public directory</Link>
          </li>
          <li>
            <Link href={sample ? `/doctors/${sample.slug}/` : "/doctors/"}>Open a profile example</Link>
          </li>
          <li>
            <Link href="/consult/">Consultation formats</Link>
          </li>
          <li>
            <Link href="/doctor-verification/">Verification status help</Link>
          </li>
        </ul>
        <div style={{ marginTop: "1rem" }}>
          <Link href="/login/doctor/">
            <Button variant="secondary">Switch account</Button>
          </Link>
        </div>
      </div>
    </ContentPage>
  );
}

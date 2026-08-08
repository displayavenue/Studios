import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { listDoctors } from "@/lib/api";

export const metadata: Metadata = buildPageMetadata(
  "Find a doctor",
  "/doctors",
  "Connect with verified homeopathic practitioners for consultations.",
);

export default async function DoctorsPage() {
  const doctors = await listDoctors();

  return (
    <ContentPage
      title="Find a doctor"
      description="Browse verified homeopathic practitioners available for video and chat consultations."
      path="/doctors"
    >
      {doctors.length === 0 ? (
        <p className="product-placeholder">Doctor directory loads from <code>GET /v1/doctors</code>.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "var(--hp-space-4)" }}>
          {doctors.map((doc) => (
            <li key={doc.slug}>
              <Link href={`/doctors/${doc.slug}`} className="hp-link hp-focus-ring">
                {doc.name}
              </Link>
              <span style={{ color: "var(--hp-color-text-muted)", marginLeft: "var(--hp-space-2)" }}>
                {doc.credentials}
              </span>
            </li>
          ))}
        </ul>
      )}
    </ContentPage>
  );
}

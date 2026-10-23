import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { getDoctorBySlug, listAllDoctorSlugs } from "@/lib/content/doctors";
import { toDoctorSlugParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toDoctorSlugParams(listAllDoctorSlugs());
}

interface BookConsultPageProps {
  params: Promise<{ doctorSlug: string }>;
}

export async function generateMetadata({ params }: BookConsultPageProps): Promise<Metadata> {
  const { doctorSlug } = await params;
  const doctor = getDoctorBySlug(doctorSlug);
  return buildPageMetadata(
    doctor ? `Book ${doctor.fullName}` : "Book consultation",
    `/consult/book/${doctorSlug}`,
  );
}

export default async function BookConsultPage({ params }: BookConsultPageProps) {
  const { doctorSlug } = await params;
  const doctor = getDoctorBySlug(doctorSlug);

  if (!doctor) {
    return (
      <ContentPage title="Doctor not found" path={`/consult/book/${doctorSlug}`}>
        <Link href="/doctors/" className="hp-link">
          Browse doctors
        </Link>
      </ContentPage>
    );
  }

  return (
    <ContentPage
      title={`Request consultation — ${doctor.fullName}`}
      description={`${doctor.credentials} · ${doctor.locality}, ${doctor.city} · from ₹${doctor.consultationFeeInr}`}
      path={`/consult/book/${doctorSlug}`}
    >
      <ul className="detail-meta">
        <li>
          <strong>Formats</strong>
          <span>{doctor.formats.join(" · ")}</span>
        </li>
        <li>
          <strong>Availability</strong>
          <span>{doctor.availabilityNote}</span>
        </li>
        <li>
          <strong>Response</strong>
          <span>{doctor.responseTime}</span>
        </li>
        <li>
          <strong>Clinic</strong>
          <span>{doctor.clinicAddress}</span>
        </li>
      </ul>

      <p style={{ maxWidth: "60ch" }}>
        Submit a booking request and the practitioner team will confirm a slot. Live payment and calendar sync
        activate when account checkout is enabled for your session.
      </p>

      <form
        style={{
          display: "grid",
          gap: "var(--hp-space-4)",
          maxWidth: "28rem",
          marginTop: "var(--hp-space-6)",
        }}
      >
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Your name</span>
          <input name="name" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Mobile / WhatsApp</span>
          <input name="phone" type="tel" required className="hp-focus-ring" style={inputStyle} />
        </label>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Preferred format</span>
          <select name="format" className="hp-focus-ring" style={inputStyle} defaultValue={doctor.formats[0]}>
            {doctor.formats.map((format) => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "grid", gap: "var(--hp-space-2)" }}>
          <span>Brief note (optional)</span>
          <textarea name="note" rows={3} className="hp-focus-ring" style={inputStyle} />
        </label>
        <Button variant="accent" type="submit">
          Send booking request
        </Button>
      </form>

      <p style={{ marginTop: "var(--hp-space-4)" }}>
        <Link href={`/doctors/${doctor.slug}/`} className="hp-link">
          ← Back to profile
        </Link>
      </p>

      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        Consultations provide general educational guidance. They do not replace in-person medical evaluation or
        emergency care.
      </p>
    </ContentPage>
  );
}

const inputStyle: CSSProperties = {
  padding: "0.75rem 0.9rem",
  border: "1px solid var(--hp-color-border)",
  borderRadius: "var(--hp-radius-md)",
  font: "inherit",
  background: "var(--hp-color-surface-elevated)",
};

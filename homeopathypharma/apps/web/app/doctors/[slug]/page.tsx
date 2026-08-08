import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { getDoctorBySlug, listAllDoctorSlugs } from "@/lib/content/doctors";
import { toParams } from "@/lib/static-params";

export function generateStaticParams() {
  return toParams(listAllDoctorSlugs());
}

interface DoctorProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DoctorProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);
  return buildPageMetadata(
    doctor?.fullName ?? "Doctor profile",
    `/doctors/${slug}`,
    doctor
      ? `${doctor.fullName}, ${doctor.credentials} — ${doctor.locality}, ${doctor.city}. ${doctor.specialties.join(", ")}.`
      : undefined,
  );
}

export default async function DoctorProfilePage({ params }: DoctorProfilePageProps) {
  const { slug } = await params;
  const doctor = getDoctorBySlug(slug);

  if (!doctor) {
    return (
      <ContentPage title="Doctor not found" path={`/doctors/${slug}`}>
        <p>
          This profile is unavailable.{" "}
          <Link href="/doctors/" className="hp-link">
            Browse all doctors
          </Link>
          .
        </p>
      </ContentPage>
    );
  }

  return (
    <ContentPage
      title={doctor.fullName}
      description={`${doctor.credentials} · ${doctor.locality}, ${doctor.city}`}
      path={`/doctors/${slug}`}
    >
      <ul className="detail-meta">
        <li>
          <strong>Clinic</strong>
          <span>
            {doctor.clinicName} — {doctor.clinicAddress}
          </span>
        </li>
        <li>
          <strong>Experience</strong>
          <span>{doctor.yearsExperience}+ years</span>
        </li>
        <li>
          <strong>Focus</strong>
          <span>{doctor.specialties.join(" · ")}</span>
        </li>
        <li>
          <strong>Languages</strong>
          <span>{doctor.languages.join(", ")}</span>
        </li>
        <li>
          <strong>Formats</strong>
          <span>{doctor.formats.join(" · ")}</span>
        </li>
        <li>
          <strong>Fee</strong>
          <span>From ₹{doctor.consultationFeeInr}</span>
        </li>
        <li>
          <strong>Availability</strong>
          <span>
            {doctor.availabilityNote} · {doctor.responseTime}
          </span>
        </li>
        <li>
          <strong>Listing status</strong>
          <span>
            {doctor.verificationStatus === "VERIFIED"
              ? "Verified by HomeopathyPharma admin review"
              : "Listed for discovery — admin verification pending"}
          </span>
        </li>
      </ul>

      <p style={{ maxWidth: "65ch", lineHeight: "var(--hp-leading-relaxed)" }}>{doctor.bio}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--hp-space-3)", marginTop: "var(--hp-space-6)" }}>
        <Link href={`/consult/book/${doctor.slug}/`}>
          <Button variant="accent">Request consultation</Button>
        </Link>
        <Link href="/doctors/city/mumbai/">
          <Button variant="secondary">More Mumbai doctors</Button>
        </Link>
      </div>

      <p className="disclaimer-banner" style={{ marginTop: "var(--hp-space-6)" }}>
        Consultations provide general educational guidance. They do not replace in-person medical evaluation or
        emergency care. HomeopathyPharma does not invent verified badges — verification is issued only after admin
        review of credentials.
      </p>
    </ContentPage>
  );
}

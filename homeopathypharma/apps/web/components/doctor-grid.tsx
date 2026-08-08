import Link from "next/link";
import type { DoctorProfile } from "@/lib/content/doctors";

export function DoctorGrid({ doctors }: { doctors: DoctorProfile[] }) {
  if (doctors.length === 0) {
    return (
      <p style={{ color: "var(--hp-color-text-muted)" }}>
        No practitioners listed for this filter yet. Browse the full directory or check back soon.
      </p>
    );
  }

  return (
    <ul className="catalog-grid catalog-grid--doctors" role="list">
      {doctors.map((doctor) => (
        <li key={doctor.id} className="catalog-tile">
          <Link href={`/doctors/${doctor.slug}/`} className="catalog-tile__link hp-focus-ring">
            <p className="catalog-tile__eyebrow">
              {doctor.locality}, {doctor.city}
            </p>
            <h3 className="catalog-tile__title font-display">{doctor.fullName}</h3>
            <p className="catalog-tile__meta">
              {doctor.credentials} · {doctor.yearsExperience}+ years
            </p>
            <p className="catalog-tile__meta">{doctor.specialties.slice(0, 3).join(" · ")}</p>
            <p className="catalog-tile__price">
              From ₹{doctor.consultationFeeInr}
              <span className="catalog-tile__mrp">{doctor.formats.join(" · ")}</span>
            </p>
            <p className="catalog-tile__stock">{doctor.availabilityNote}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

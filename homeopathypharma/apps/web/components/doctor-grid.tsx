import Link from "next/link";
import type { DoctorProfile } from "@/lib/content/doctors";
import { doctorAvatarDataUrl } from "@/lib/content/images";

export function DoctorGrid({
  doctors,
  compact = false,
}: {
  doctors: DoctorProfile[];
  compact?: boolean;
}) {
  if (doctors.length === 0) {
    return (
      <p style={{ color: "var(--hp-color-text-muted)" }}>
        No practitioners listed for this filter yet. Browse the full directory or check back soon.
      </p>
    );
  }

  return (
    <ul className={`doctor-grid${compact ? " doctor-grid--compact" : ""}`} role="list">
      {doctors.map((doctor) => (
        <li key={doctor.id} className="doctor-card">
          <Link href={`/doctors/${doctor.slug}/`} className="doctor-card__link hp-focus-ring">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="doctor-card__avatar"
              src={doctorAvatarDataUrl(doctor.fullName, doctor.locality)}
              alt=""
              width={96}
              height={96}
              loading="lazy"
            />
            <div className="doctor-card__body">
              <h3 className="doctor-card__name">{doctor.fullName}</h3>
              <p className="doctor-card__meta">
                {doctor.credentials} · {doctor.yearsExperience}+ yrs
              </p>
              <p className="doctor-card__meta">
                {doctor.locality}, {doctor.city}
              </p>
              <p className="doctor-card__focus">{doctor.specialties.slice(0, 2).join(" · ")}</p>
              <p className="doctor-card__fee">
                ₹{doctor.consultationFeeInr}
                <span> onwards</span>
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

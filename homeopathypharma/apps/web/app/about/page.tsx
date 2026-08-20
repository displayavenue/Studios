import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";
import { DOCTORS } from "@/lib/content/doctors";
import { PRODUCTS } from "@/lib/content/products";
import { remedies } from "@/lib/content/remedies";

export const metadata: Metadata = buildPageMetadata(
  "About HomeopathyPharma",
  "/about",
  "Our mission and commitment to clear homeopathic retail and educational care.",
);

export default function Page() {
  return (
    <ContentPage
      title="About HomeopathyPharma"
      description="A live storefront for homeopathic remedies, educational resources, and practitioner discovery."
      path="/about"
    >
      <p style={{ maxWidth: "60ch" }}>
        HomeopathyPharma publishes a multidimensional catalogue — remedies, brands, health areas, and kits — alongside
        a Mumbai BHMS practitioner directory. We prioritize labelling clarity, respectful healthcare UX, and honest
        status language: listed is not the same as verified.
      </p>
      <ul className="detail-meta" style={{ marginTop: "var(--hp-space-6)" }}>
        <li>
          <strong>Products</strong>
          <span>{PRODUCTS.length} published SKUs</span>
        </li>
        <li>
          <strong>Remedies</strong>
          <span>{remedies.length} master remedy pages</span>
        </li>
        <li>
          <strong>Doctors</strong>
          <span>{DOCTORS.length} BHMS profiles in Mumbai</span>
        </li>
      </ul>
      <p style={{ marginTop: "var(--hp-space-6)" }}>
        <Link href="/shop/" className="hp-link">
          Shop
        </Link>
        {" · "}
        <Link href="/doctors/" className="hp-link">
          Doctors
        </Link>
        {" · "}
        <Link href="/medical-disclaimer/" className="hp-link">
          Medical disclaimer
        </Link>
      </p>
    </ContentPage>
  );
}

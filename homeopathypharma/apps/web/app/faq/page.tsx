import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata, ContentPage } from "@/components/content-page";

export const metadata: Metadata = buildPageMetadata(
  "Frequently asked questions",
  "/faq",
  "Answers about orders, consultations, catalogue browsing, and educational content.",
);

const faqs = [
  {
    q: "Is HomeopathyPharma a live pharmacy storefront?",
    a: "Yes. You can browse published products, brand hubs, remedy pages, and the Mumbai doctor directory today. Account checkout, Razorpay payments, and Shiprocket dispatch activate when those services are connected for your session.",
  },
  {
    q: "Are the doctors verified?",
    a: "Profiles are listed for discovery and booking requests. A verified badge appears only after HomeopathyPharma admin review of credentials — we do not invent verification marks.",
  },
  {
    q: "Do product pages claim to treat diseases?",
    a: "No. Listings are educational retail information. Read pack labels and consult a qualified practitioner. We do not make unsupported treatment or cure claims.",
  },
  {
    q: "How many doctors are listed?",
    a: "The directory currently lists 100 BHMS practitioners across Mumbai localities, with online and clinic formats depending on the profile.",
  },
  {
    q: "Can I return a product?",
    a: "See the return and refund policy pages for eligibility rules. Final commercial terms are subject to counsel-reviewed policy text and applicable pharmacy regulations.",
  },
  {
    q: "Is this a substitute for emergency care?",
    a: "Never. For emergencies or worsening symptoms, seek urgent medical care immediately.",
  },
];

export default function Page() {
  return (
    <ContentPage
      title="Frequently asked questions"
      description="Answers about orders, consultations, and educational content."
      path="/faq"
    >
      <ul className="faq-list">
        {faqs.map((faq) => (
          <li key={faq.q}>
            <details>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "var(--hp-space-6)" }}>
        Still need help?{" "}
        <Link href="/contact/" className="hp-link">
          Contact support
        </Link>
        .
      </p>
    </ContentPage>
  );
}

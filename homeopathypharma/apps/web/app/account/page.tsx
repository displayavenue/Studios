import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@homeopathypharma/ui";
import { ACCOUNT_ROBOTS, renderRobotsMeta } from "@homeopathypharma/seo";
import { ContentPage } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Account",
  robots: renderRobotsMeta(ACCOUNT_ROBOTS),
};

const sections = [
  { href: "/account/orders/", label: "Orders", hint: "Track purchases and invoices" },
  { href: "/account/consultations/", label: "Consultations", hint: "Online and clinic bookings" },
  { href: "/account/appointments/", label: "Appointments", hint: "Upcoming visit slots" },
  { href: "/account/prescriptions/", label: "Prescriptions", hint: "Saved prescription notes" },
  { href: "/account/addresses/", label: "Addresses", hint: "Delivery locations" },
  { href: "/account/profile/", label: "Profile", hint: "Name, phone, and preferences" },
  { href: "/account/wallet/", label: "Wallet", hint: "Store credit balance" },
  { href: "/account/coupons/", label: "Coupons", hint: "Offers saved to your account" },
  { href: "/account/referrals/", label: "Referrals", hint: "Invite family and friends" },
  { href: "/account/pets/", label: "Pets", hint: "Pet profiles for care products" },
  { href: "/account/reviews/", label: "Reviews", hint: "Your product feedback" },
  { href: "/account/support/", label: "Support", hint: "Help with orders and account" },
] as const;

export default function AccountPage() {
  return (
    <ContentPage
      title="Your account"
      description="Manage orders, consultations, addresses, and profile details."
      path="/account"
    >
      <div className="account-signin">
        <p style={{ marginTop: 0, maxWidth: "40ch" }}>
          Sign in to see your orders and consultation history, or create an account in a minute.
        </p>
        <div className="account-empty__actions">
          <Link href="/login/">
            <Button variant="accent">Sign in</Button>
          </Link>
          <Link href="/signup/">
            <Button variant="secondary">Create account</Button>
          </Link>
        </div>
      </div>

      <ul className="account-nav-grid" role="list">
        {sections.map((section) => (
          <li key={section.href}>
            <Link href={section.href} className="account-nav-card hp-focus-ring">
              <strong>{section.label}</strong>
              <span>{section.hint}</span>
            </Link>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}

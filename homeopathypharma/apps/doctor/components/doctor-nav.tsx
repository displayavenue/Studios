"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/patients", label: "Patients" },
  { href: "/consultations", label: "Consultations" },
  { href: "/availability", label: "Availability" },
  { href: "/referrals", label: "Referrals" },
  { href: "/earnings", label: "Earnings" },
  { href: "/reviews", label: "Reviews" },
  { href: "/documents", label: "Verification" },
];

export function DoctorNav() {
  const pathname = usePathname();

  return (
    <ul className="dashboard-nav" style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {links.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <li key={link.href}>
            <Link href={link.href} aria-current={active ? "page" : undefined} className="hp-focus-ring">
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

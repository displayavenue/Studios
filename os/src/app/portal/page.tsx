"use client";

import Link from "next/link";

const CARDS = [
  {
    href: "/portal/campaigns",
    title: "Campaigns",
    detail: "No campaigns connected yet. Once Meta is linked, active ads will show here.",
  },
  {
    href: "/portal/approvals",
    title: "Approvals",
    detail: "No approvals waiting. Creative and budget changes will land here for your review.",
  },
  {
    href: "/portal/billing",
    title: "Billing",
    detail: "No invoices yet. Retainers and ad-spend invoices appear when billing starts.",
  },
  {
    href: "/portal/reports",
    title: "Reports",
    detail: "No reports yet. Monthly performance packs will be listed when published.",
  },
];

export default function PortalHome() {
  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Client home</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>
        Your DisplayAvenue workspace. Cards stay empty until real data exists — nothing invented.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: ".85rem" }}>
        {CARDS.map((card) => (
          <Link key={card.href} href={card.href} className="panel fade-up" style={{ padding: "1.15rem", display: "grid", gap: ".45rem", minHeight: 140 }}>
            <div className="display" style={{ color: "var(--navy)", fontWeight: 700, fontSize: "1.25rem" }}>{card.title}</div>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: ".95rem" }}>{card.detail}</p>
            <span style={{ marginTop: "auto", fontWeight: 700, color: "var(--blue)", minHeight: 44, display: "inline-flex", alignItems: "center" }}>Open →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}

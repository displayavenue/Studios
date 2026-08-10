"use client";

import Link from "next/link";

const nav = [
  ["Dashboard", "/admin"],
  ["Leads", "/admin/leads"],
  ["Assessments", "/admin/assessments"],
  ["Competitors", "/admin/competitors"],
  ["Pricing", "/admin/pricing"],
  ["Rules", "/admin/rules"],
  ["AI Usage", "/admin/ai"],
  ["Prompts", "/admin/prompts"],
  ["Settings", "/admin/settings"],
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }
  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div className="display" style={{ fontWeight: 700, color: "var(--navy)" }}>Growth360 Admin</div>
        <button className="btn btn-secondary" onClick={logout}>Logout</button>
      </div>
      <nav style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        {nav.map(([label, href]) => (
          <Link key={href} href={href} className="btn btn-secondary" style={{ padding: "0.45rem 0.8rem", fontSize: "0.85rem" }}>
            {label}
          </Link>
        ))}
      </nav>
      {children}
    </main>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/app", label: "Command Center", exact: true },
  { href: "/app/crm", label: "CRM" },
  { href: "/app/sales", label: "Sales" },
  { href: "/app/quotations", label: "Quotations" },
  { href: "/app/quote-clients", label: "Clients" },
  { href: "/app/quote-services", label: "Services" },
  { href: "/app/campaigns", label: "Campaigns" },
  { href: "/app/creatives", label: "Creatives" },
  { href: "/app/approvals", label: "Approvals" },
  { href: "/app/recommendations", label: "AI Recs" },
  { href: "/app/billing", label: "Billing" },
  { href: "/app/quote-settings", label: "Quote Settings" },
  { href: "/app/reports", label: "Reports" },
  { href: "/app/organizations", label: "Orgs" },
  { href: "/app/jobs", label: "Jobs" },
  { href: "/app/search", label: "Search" },
];

export default function StaffAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      const me = await fetch("/api/auth/me");
      const json = await me.json();
      if (!json.ok) {
        router.push("/login");
        return;
      }
      setName(json.data.user.name);
    })().catch(() => router.push("/login"));
  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  }

  return (
    <div>
      <header style={{ borderBottom: "1px solid var(--line)", background: "rgba(255,255,255,.72)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 20 }}>
        <div className="container" style={{ padding: ".85rem 0 .55rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: ".55rem" }}>
            <div>
              <div className="display" style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1.2rem" }}>DisplayAvenue OS</div>
              <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>{name ? `Signed in as ${name}` : "Staff workspace"}</div>
            </div>
            <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
              <Link href="/" className="btn btn-secondary" style={{ padding: ".55rem .9rem" }}>Site</Link>
              <button type="button" className="btn btn-secondary" style={{ padding: ".55rem .9rem" }} onClick={logout}>Logout</button>
            </div>
          </div>
          <nav className="shell-nav" aria-label="Staff navigation">
            {NAV.map((item) => {
              const active = item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} className={active ? "active" : undefined}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}

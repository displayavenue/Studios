"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/portal", label: "Home", exact: true },
  { href: "/portal/campaigns", label: "Campaigns" },
  { href: "/portal/approvals", label: "Approvals" },
  { href: "/portal/billing", label: "Billing" },
  { href: "/portal/reports", label: "Reports" },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [name, setName] = useState("");
  const [orgName, setOrgName] = useState("");

  useEffect(() => {
    (async () => {
      const me = await fetch("/api/auth/me");
      const json = await me.json();
      if (!json.ok) {
        router.push("/login");
        return;
      }
      setName(json.data.user.name);
      const membership = json.data.memberships?.[0];
      setOrgName(membership?.organization?.name || "");
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
              <div className="display" style={{ fontWeight: 700, color: "var(--navy)", fontSize: "1.2rem" }}>DisplayAvenue Portal</div>
              <div style={{ color: "var(--muted)", fontSize: ".9rem" }}>
                {name ? `${name}${orgName ? ` · ${orgName}` : ""}` : "Client workspace"}
              </div>
            </div>
            <button type="button" className="btn btn-secondary" style={{ padding: ".55rem .9rem" }} onClick={logout}>Logout</button>
          </div>
          <nav className="shell-nav" aria-label="Client portal navigation">
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

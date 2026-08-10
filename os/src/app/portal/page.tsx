import Link from "next/link";

export default function PortalHome() {
  return (
    <main className="container" style={{ padding: "2rem 0" }}>
      <h1 className="display" style={{ color: "var(--navy)" }}>Client Portal</h1>
      <p style={{ color: "var(--muted)" }}>
        Phase 1 foundation is live. Campaign, approvals, billing, and Meta connection modules arrive in later phases.
      </p>
      <Link href="/login" className="btn btn-secondary">Sign in</Link>
    </main>
  );
}

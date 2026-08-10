import Link from "next/link";

export default function Growth360Entry() {
  return (
    <main className="container" style={{ padding: "2.5rem 0", maxWidth: 720 }}>
      <p style={{ color: "var(--muted)", fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase" }}>Growth360</p>
      <h1 className="display" style={{ color: "var(--navy)", fontSize: "clamp(1.8rem,5vw,2.8rem)" }}>
        Your Business Has an Opportunity. Let&apos;s Find It.
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "1.05rem" }}>
        The full interactive assessment ships in Phase 2, ported from the existing Growth360 product into DisplayAvenue OS with multi-tenant lead capture.
      </p>
      <div className="panel" style={{ padding: "1.2rem", marginBottom: "1rem" }}>
        <strong>Phase 1 status:</strong> Auth, organizations, CRM lead API with tenant isolation, jobs, and Command Center are live.
        Growth360 questions, scoring engines, and Razorpay ₹99 flow are next.
      </div>
      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
        <Link href="/login" className="btn btn-primary">Staff sign in</Link>
        <Link href="/" className="btn btn-secondary">Back home</Link>
      </div>
    </main>
  );
}

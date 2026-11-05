import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <header className="container" style={{ padding: "1.25rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <div className="display" style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--navy)" }}>DisplayAvenue</div>
          <div style={{ fontSize: ".8rem", color: "var(--muted)", letterSpacing: ".08em", textTransform: "uppercase" }}>OS</div>
        </div>
        <div style={{ display: "flex", gap: ".5rem" }}>
          <Link href="/login" className="btn btn-secondary" style={{ padding: ".55rem .9rem" }}>Sign in</Link>
          <Link href="/growth360" className="btn btn-primary" style={{ padding: ".55rem .9rem" }}>Start Free Analysis</Link>
        </div>
      </header>

      <section className="container fade-up" style={{ padding: "2rem 0 4rem", minHeight: "78vh", display: "grid", alignContent: "center" }}>
        <div
          style={{
            borderRadius: 28,
            padding: "clamp(2rem, 6vw, 4.5rem)",
            color: "#fff",
            background:
              "linear-gradient(145deg, rgba(7,24,51,.93), rgba(13,42,82,.88)), url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80') center/cover",
            boxShadow: "var(--shadow)",
          }}
        >
          <p style={{ margin: 0, opacity: .85, fontWeight: 600 }}>DISPLAYAVENUE OS · os.displayavenue.com</p>
          <h1 className="display" style={{ margin: ".7rem 0 1rem", fontSize: "clamp(2.1rem, 7vw, 4rem)", lineHeight: 1.05, maxWidth: 720 }}>
            Your Business Has an Opportunity. Let&apos;s Find It.
          </h1>
          <p style={{ margin: "0 0 1.5rem", fontSize: "1.08rem", opacity: .92, maxWidth: 540 }}>
            Discover your growth score, competitive position, advertising opportunities and potential ROI in just a few minutes.
          </p>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
            <Link href="/growth360" className="btn" style={{ background: "#fff", color: "var(--navy)" }}>
              Start My Free Growth Analysis →
            </Link>
            <a href="#how" className="btn btn-secondary">See How It Works</a>
          </div>
        </div>

        <div id="how" style={{ display: "grid", gap: ".85rem", marginTop: "1.5rem", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
          {[
            "Acquire & score leads",
            "Sell with AI briefs",
            "Onboard & connect Meta",
            "Monitor, report, retain",
          ].map((t) => (
            <div key={t} className="panel" style={{ padding: "1rem", fontWeight: 600, color: "var(--navy-2)" }}>{t}</div>
          ))}
        </div>
      </section>
    </main>
  );
}

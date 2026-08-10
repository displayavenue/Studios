import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <header className="container" style={{ padding: "1.25rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="display" style={{ fontSize: "1.35rem", fontWeight: 700, color: "var(--navy)" }}>
            DisplayAvenue
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Growth360
          </div>
        </div>
        <Link href="/admin/login" className="btn btn-secondary" style={{ padding: "0.55rem 0.9rem", fontSize: "0.85rem" }}>
          Admin
        </Link>
      </header>

      <section className="container fade-up" style={{ padding: "2.5rem 0 4rem", minHeight: "78vh", display: "grid", alignContent: "center" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "28px",
            padding: "clamp(2rem, 6vw, 4.5rem)",
            color: "white",
            background:
              "linear-gradient(145deg, rgba(7,24,51,0.92), rgba(13,42,82,0.88)), url('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80') center/cover",
            boxShadow: "var(--shadow)",
          }}
        >
          <div style={{ maxWidth: 640 }}>
            <p style={{ margin: 0, opacity: 0.85, fontWeight: 600, letterSpacing: "0.04em" }}>DISPLAYAVENUE GROWTH360</p>
            <h1 className="display" style={{ margin: "0.7rem 0 1rem", fontSize: "clamp(2.2rem, 7vw, 4.2rem)", lineHeight: 1.05 }}>
              Your Business Has an Opportunity. Let&apos;s Find It.
            </h1>
            <p style={{ margin: "0 0 1.6rem", fontSize: "1.08rem", opacity: 0.92, maxWidth: 520 }}>
              A free growth analysis with your score, closest competitors, and a clear path to more demand.
            </p>
            <Link href="/assess" className="btn btn-primary" style={{ background: "white", color: "var(--navy)" }}>
              Start My Free Growth Analysis →
            </Link>
          </div>
        </div>

        <div style={{ display: "grid", gap: "0.85rem", marginTop: "1.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          {[
            "8–10 easy questions",
            "Growth score + 5 competitors",
            "Strategy, ROI & PDF report",
            "₹99 strategy call",
          ].map((item) => (
            <div key={item} className="panel" style={{ padding: "1rem 1.1rem", fontWeight: 600, color: "var(--navy-2)" }}>
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

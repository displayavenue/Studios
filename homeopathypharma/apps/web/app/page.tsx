import Link from "next/link";
import { Button } from "@homeopathypharma/ui";

export default function HomePage() {
  return (
    <section
      aria-labelledby="hero-heading"
      style={{
        position: "relative",
        minHeight: "calc(100dvh - var(--hp-header-height))",
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr)",
        overflow: "hidden",
      }}
    >
      <div className="hero-visual-plane" aria-hidden="true" />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(var(--hp-space-8), 8vw, var(--hp-space-16))",
          maxWidth: "42rem",
          minHeight: "inherit",
        }}
      >
        <p
          className="font-display"
          style={{
            margin: "0 0 var(--hp-space-6)",
            fontSize: "clamp(var(--hp-text-2xl), 4vw, var(--hp-text-4xl))",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "var(--hp-color-ivory-50)",
            lineHeight: "var(--hp-leading-tight)",
          }}
        >
          HomeopathyPharma
        </p>

        <h1
          id="hero-heading"
          className="font-display"
          style={{
            margin: "0 0 var(--hp-space-5)",
            fontSize: "clamp(var(--hp-text-3xl), 5vw, 3.5rem)",
            fontWeight: 500,
            lineHeight: "var(--hp-leading-tight)",
            color: "var(--hp-color-ivory-50)",
            letterSpacing: "-0.02em",
          }}
        >
          Care rooted in nature, guided by science-minded practitioners.
        </h1>

        <p
          style={{
            margin: "0 0 var(--hp-space-8)",
            fontSize: "var(--hp-text-lg)",
            lineHeight: "var(--hp-leading-relaxed)",
            color: "var(--hp-color-sage-100)",
            maxWidth: "34ch",
          }}
        >
          Explore pharmacy-grade remedies and educational health resources — with optional consultations from
          listed BHMS practitioners in Mumbai.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--hp-space-4)",
            alignItems: "center",
          }}
        >
          <Link href="/search" className="hp-focus-ring" style={{ borderRadius: "var(--hp-radius-md)" }}>
            <Button variant="accent" size="lg">
              Explore remedies
            </Button>
          </Link>
          <Link href="/doctors" className="hp-focus-ring" style={{ borderRadius: "var(--hp-radius-md)" }}>
            <Button
              variant="secondary"
              size="lg"
              style={{
                backgroundColor: "transparent",
                color: "var(--hp-color-ivory-50)",
                borderColor: "rgb(255 255 255 / 35%)",
              }}
            >
              Book a consultation
            </Button>
          </Link>
        </div>

        <p
          style={{
            marginTop: "var(--hp-space-10)",
            fontSize: "var(--hp-text-xs)",
            color: "rgb(227 237 231 / 75%)",
            maxWidth: "40ch",
          }}
        >
          Educational content only — not medical advice. Always consult a qualified healthcare provider for
          diagnosis and treatment.
        </p>
      </div>
    </section>
  );
}

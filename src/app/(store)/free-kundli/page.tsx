import { FreeKundliForm } from "@/components/marketplace/free-kundli-form";

export const metadata = {
  title: "Free Kundli",
  description: "Generate a free Janam Kundli preview with Lahiri sidereal calculations.",
};

export default function FreeKundliPage() {
  return (
    <div className="at-home min-h-screen">
      <div className="container-jk py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Free services</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Free <span className="text-[var(--at-yellow-ink)]">Kundli</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--jk-muted)]">
          Instant Janam Kundli preview — Lagna, Moon, Sun, nakshatra, and houses from our Lahiri engine. Upgrade anytime to a multi-page PDF.
        </p>
        <div className="mt-8">
          <FreeKundliForm />
        </div>
      </div>
    </div>
  );
}

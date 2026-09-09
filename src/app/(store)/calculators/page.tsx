import { CalculatorsPanel } from "@/components/marketplace/calculators-panel";
import Link from "next/link";

export const metadata = {
  title: "Calculators",
  description: "Free Kundli matching and moon-sign calculators.",
};

export default function CalculatorsPage() {
  return (
    <div className="at-home min-h-screen">
      <div className="container-jk py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Free tools</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Astrology <span className="text-[var(--at-yellow-ink)]">Calculators</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--jk-muted)]">
          Instant Ashtakoota and Moon-sign tools powered by the Lahiri engine.{" "}
          <Link href="/panchang" className="font-semibold text-[var(--at-yellow-ink)]">
            Open Panchang
          </Link>
          {" · "}
          <Link href="/free-kundli" className="font-semibold text-[var(--at-yellow-ink)]">
            Free Kundli
          </Link>
        </p>
        <div className="mt-8">
          <CalculatorsPanel />
        </div>
      </div>
    </div>
  );
}

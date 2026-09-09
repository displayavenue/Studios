import { PanchangPanel } from "@/components/marketplace/panchang-panel";
import Link from "next/link";

export const metadata = {
  title: "Panchang",
  description: "Daily Hindu panchang snapshot — tithi, nakshatra, yoga, karana.",
};

export default function PanchangPage() {
  return (
    <div className="at-home min-h-screen">
      <div className="container-jk py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Free tools</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Daily <span className="text-[var(--at-yellow-ink)]">Panchang</span>
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--jk-muted)]">
          Lahiri-based day elements at IST noon. For muhurat precision, cross-check a regional panchang.
        </p>
        <div className="mt-8">
          <PanchangPanel />
        </div>
        <p className="mt-8 text-sm">
          <Link href="/calculators" className="font-semibold text-[var(--at-yellow-ink)]">
            More calculators →
          </Link>
        </p>
      </div>
    </div>
  );
}

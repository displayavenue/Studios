import { DailyHoroscopePanel } from "@/components/marketplace/daily-horoscope-panel";

export const metadata = {
  title: "Daily Horoscope",
  description: "Daily rashi horoscope samples for all 12 signs — entertainment UI.",
};

export default function HoroscopePage() {
  return (
    <div className="at-home min-h-screen">
      <div className="container-jk py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Horoscope</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Your daily <span className="text-[var(--at-yellow-ink)]">horoscope</span> reading
        </h1>
        <p className="mt-2 text-sm text-[var(--jk-muted)]">
          Pick your raashi to see today&apos;s sample pillars. For a birth-chart based reading, generate Free Kundli or buy a PDF report.
        </p>
        <div className="mt-8">
          <DailyHoroscopePanel />
        </div>
      </div>
    </div>
  );
}

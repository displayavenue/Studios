export default function DashboardHoroscopePage() {
  return (
    <div className="container-jk py-10">
      <h1 className="font-display text-2xl font-semibold">Daily Horoscope</h1>
      <div className="site-section mt-8">
        <p className="text-[var(--jk-muted)]">
          Your personalized daily guidance will appear here once your birth profile is set up.
        </p>
        <p className="disclaimer-strip mt-4">
          Daily horoscope content is interpretive and for entertainment purposes.
        </p>
      </div>
    </div>
  );
}

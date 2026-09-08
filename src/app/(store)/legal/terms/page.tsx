import { ASTROLOGY_DISCLAIMER, BRAND } from "@/config/site";

export default function TermsPage() {
  return (
    <div className="container-jk py-10 prose prose-sm max-w-3xl">
      <h1 className="font-display text-3xl">Terms of Service</h1>
      <p className="text-[var(--jk-muted)]">By using {BRAND.name}, you agree that all astrology and face-reading content is for interpretive and entertainment purposes only.</p>
      <p className="disclaimer-strip mt-4">{ASTROLOGY_DISCLAIMER}</p>
    </div>
  );
}

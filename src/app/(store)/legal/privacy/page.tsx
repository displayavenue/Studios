import { BRAND } from "@/config/site";

export default function PrivacyPage() {
  return (
    <div className="container-jk py-10 prose prose-sm max-w-3xl">
      <h1 className="font-display text-3xl">Privacy Policy</h1>
      <p className="text-[var(--jk-muted)]">{BRAND.name} respects your privacy. Birth details and personal data are used solely to generate interpretive astrology reports.</p>
    </div>
  );
}

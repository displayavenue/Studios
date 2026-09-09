import { ExpertApplyForm } from "@/components/marketplace/expert-apply-form";

export const metadata = {
  title: "Become an expert",
  description: "Apply to join the JyotishKundali marketplace as a verified astrologer.",
};

export default function ExpertApplyPage() {
  return (
    <div className="at-home min-h-screen">
      <div className="container-jk py-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--jk-muted)]">Experts</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Become an expert</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--jk-muted)]">
          Create your consultant profile. After admin verification you can go online for chat and call rooms with wallet billing.
        </p>
        <div className="mt-8">
          <ExpertApplyForm />
        </div>
      </div>
    </div>
  );
}

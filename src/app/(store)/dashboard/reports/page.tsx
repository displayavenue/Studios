import Link from "next/link";

export default function DashboardReportsPage() {
  return (
    <div className="container-jk py-10">
      <h1 className="font-display text-2xl font-semibold">My Reports</h1>
      <div className="mt-8 rounded-lg border border-dashed border-[var(--jk-line)] p-12 text-center">
        <p className="text-[var(--jk-muted)]">Your purchased reports will appear here.</p>
        <Link href="/services" className="mt-4 inline-block text-sm text-[var(--jk-purple)] hover:underline">
          Browse services →
        </Link>
      </div>
    </div>
  );
}

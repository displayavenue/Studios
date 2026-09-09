import { AdminAnalyticsClient } from "@/components/admin/admin-analytics-client";

export const dynamic = "force-dynamic";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[var(--jk-ivory)]">Analytics</h1>
        <p className="mt-2 text-sm text-[var(--jk-ivory)]/60">
          Traction, GMV proxies, wallet activity, and top tracked events.
        </p>
      </div>
      <AdminAnalyticsClient />
    </div>
  );
}

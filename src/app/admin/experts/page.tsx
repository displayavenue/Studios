import { AdminExpertsClient } from "@/components/admin/admin-experts-client";

export const dynamic = "force-dynamic";

export default function AdminExpertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[var(--jk-ivory)]">Experts</h1>
        <p className="mt-2 text-sm text-[var(--jk-ivory)]/60">
          Verify applications, toggle online status, and seed sample marketplace profiles.
        </p>
      </div>
      <AdminExpertsClient />
    </div>
  );
}

import { AdminCouponsClient } from "@/components/admin/admin-coupons-client";

export const dynamic = "force-dynamic";

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[var(--jk-ivory)]">Coupons</h1>
        <p className="mt-2 text-sm text-[var(--jk-ivory)]/60">Create and toggle promotional codes.</p>
      </div>
      <AdminCouponsClient />
    </div>
  );
}

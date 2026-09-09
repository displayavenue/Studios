import { AdminOrdersClient } from "@/components/admin/admin-orders-client";

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[var(--jk-ivory)]">Report orders</h1>
        <p className="mt-2 text-sm text-[var(--jk-ivory)]/60">Update payment and report delivery status.</p>
      </div>
      <AdminOrdersClient kind="reports" />
    </div>
  );
}

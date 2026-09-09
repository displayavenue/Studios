import { AdminCustomersClient } from "@/components/admin/admin-customers-client";

export const dynamic = "force-dynamic";

export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[var(--jk-ivory)]">Customers</h1>
        <p className="mt-2 text-sm text-[var(--jk-ivory)]/60">
          View phone/email users, wallet balances, and adjust credits from the backend.
        </p>
      </div>
      <AdminCustomersClient />
    </div>
  );
}

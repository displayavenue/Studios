import { AdminOrdersClient } from "@/components/admin/admin-orders-client";

export const dynamic = "force-dynamic";

export default function AdminMallOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[var(--jk-ivory)]">Mall & wallet orders</h1>
        <p className="mt-2 text-sm text-[var(--jk-ivory)]/60">
          AstroMall purchases and wallet recharge containers (`MallOrder`).
        </p>
      </div>
      <AdminOrdersClient kind="mall" />
    </div>
  );
}

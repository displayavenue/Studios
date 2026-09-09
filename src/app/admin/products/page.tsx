import { AdminProductsClient } from "@/components/admin/admin-products-client";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[var(--jk-ivory)]">Products</h1>
        <p className="mt-2 text-sm text-[var(--jk-ivory)]/60">Publish, hide, and manage PDF catalogue items.</p>
      </div>
      <AdminProductsClient />
    </div>
  );
}

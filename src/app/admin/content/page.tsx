import { AdminContentClient } from "@/components/admin/admin-content-client";

export const dynamic = "force-dynamic";

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-[var(--jk-ivory)]">Content & banners</h1>
        <p className="mt-2 text-sm text-[var(--jk-ivory)]/60">
          Manage marketplace ticker lines and site-wide announcements from the backend.
        </p>
      </div>
      <AdminContentClient />
    </div>
  );
}

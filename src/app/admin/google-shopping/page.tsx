import Link from "next/link";

export default function GoogleShoppingAdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl text-white">Google Shopping</h1>
      <p className="text-sm text-[#8fa396]">Feed generated from approved, complete, eligible products only. Never invents GTIN/MPN.</p>
      <Link href="/api/feeds/google" className="inline-block rounded-md bg-emerald-700 px-4 py-2 text-sm">Download Google Merchant TSV</Link>
      <Link href="/api/feeds/meta" className="ml-2 inline-block rounded-md border border-white/15 px-4 py-2 text-sm">Download Meta Catalog CSV</Link>
    </div>
  );
}

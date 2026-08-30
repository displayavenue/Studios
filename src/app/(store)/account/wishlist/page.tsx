import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
export default async function WishlistPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <div className="container-velora py-12">
      <h1 className="font-display text-4xl">Wishlist</h1>
      <p className="mt-4 text-sm text-[var(--velora-muted)]">Save products while browsing. Empty for now.</p>
    </div>
  );
}

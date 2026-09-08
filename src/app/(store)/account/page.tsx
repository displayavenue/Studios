import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <div className="container-velora py-12">
      <h1 className="font-display text-4xl">Account</h1>
      <p className="mt-2 text-sm text-[var(--velora-muted)]">{session.email}</p>
      <ul className="mt-8 space-y-3 text-sm">
        {[
          ["/account/orders", "Orders"],
          ["/account/wishlist", "Wishlist"],
          ["/account/profile", "Profile"],
          ["/account/addresses", "Addresses"],
          ["/account/returns", "Returns"],
        ].map(([href, label]) => (
          <li key={href}><Link href={href} className="text-[var(--velora-accent)] underline">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}

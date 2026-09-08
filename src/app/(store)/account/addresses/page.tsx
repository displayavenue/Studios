import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function AddressesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const addresses = await prisma.address.findMany({ where: { userId: session.id } });
  return (
    <div className="container-velora py-12">
      <h1 className="font-display text-4xl">Addresses</h1>
      <ul className="mt-6 space-y-3 text-sm">
        {addresses.map((a) => (
          <li key={a.id} className="rounded border border-[var(--velora-line)] p-4">
            {a.fullName}<br />{a.line1}, {a.city}, {a.state} {a.pincode}
          </li>
        ))}
        {!addresses.length && <p className="text-[var(--velora-muted)]">No saved addresses.</p>}
      </ul>
    </div>
  );
}

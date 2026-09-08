import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
export default async function ReturnsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <div className="container-velora py-12">
      <h1 className="font-display text-4xl">Returns</h1>
      <p className="mt-4 text-sm text-[var(--velora-muted)]">
        Request returns for delivered orders. Status flow: REQUESTED → UNDER_REVIEW → APPROVED/REJECTED → PICKUP → REFUND.
      </p>
    </div>
  );
}

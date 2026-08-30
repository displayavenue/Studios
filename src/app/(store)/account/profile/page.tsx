import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <div className="container-velora py-12">
      <h1 className="font-display text-4xl">Profile</h1>
      <p className="mt-4 text-sm">{session.firstName} {session.lastName}</p>
      <p className="text-sm text-[var(--velora-muted)]">{session.email}</p>
    </div>
  );
}

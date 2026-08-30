import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, logoutUser } from "@/lib/auth";
import { isAdminRole, ADMIN_NAV, hasPermission } from "@/lib/rbac";
import { BRAND } from "@/config/site";

async function logoutAction() {
  "use server";
  await logoutUser();
  redirect("/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || !isAdminRole(session.role)) {
    redirect("/login");
  }

  const nav = ADMIN_NAV.filter((n) => hasPermission(session.role, n.permission));

  return (
    <div className="admin-shell flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 p-4 lg:block">
        <div className="px-2 py-3">
          <Link href="/admin" className="font-display text-2xl tracking-[0.12em]">
            {BRAND.name}
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-emerald-400/80">
            Command Center
          </p>
        </div>
        <nav className="mt-4 max-h-[calc(100vh-120px)] space-y-0.5 overflow-y-auto text-sm" aria-label="Admin">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-[#c5d0c8] hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[#8fa396]">Signed in</p>
            <p className="text-sm">{session.email}</p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-[#8fa396] hover:text-white">
              View store
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="rounded-md border border-white/15 px-3 py-1.5 hover:bg-white/5">
                Log out
              </button>
            </form>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

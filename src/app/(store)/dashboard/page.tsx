import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");

  const reports = await prisma.report.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { product: { select: { name: true, slug: true } } },
  });

  const name = session.firstName || session.email.split("@")[0];

  return (
    <div className="container-jk py-10">
      <h1 className="font-display text-3xl font-semibold">Welcome, {name}</h1>
      <p className="mt-2 text-[var(--jk-muted)]">Your personal astrology hub.</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="My Reports" href="/dashboard/reports" description="View and download your purchased reports." />
        <DashboardCard title="Daily Horoscope" href="/dashboard/horoscope" description="Today's personalized guidance." />
        <DashboardCard title="AI Assistant" href="/dashboard/ai" description="Ask reflective questions about your chart." />
        <DashboardCard title="Profile" href="/dashboard/profile" description="Manage birth details and account settings." />
      </div>

      <div className="site-section mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent reports</h2>
          <Link href="/services" className="text-sm text-[var(--jk-purple)] hover:underline">Browse services</Link>
        </div>
        {reports.length ? (
          <ul className="mt-4 divide-y divide-[var(--jk-line)]">
            {reports.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{r.product.name}</p>
                  <p className="text-[var(--jk-muted)]">Status: {r.jobStatus.replace(/_/g, " ").toLowerCase()}</p>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/reports/${r.id}`}>View</Link>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-[var(--jk-line)] p-8 text-center">
            <p className="text-[var(--jk-muted)]">No reports yet.</p>
            <Button asChild className="mt-4 bg-[var(--jk-gold)] text-[var(--jk-navy)]">
              <Link href="/services/janam-kundali">Create My Kundali</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardCard({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <Link href={href} className="site-section block transition hover:border-[var(--jk-gold)] hover:shadow-md">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--jk-muted)]">{description}</p>
    </Link>
  );
}

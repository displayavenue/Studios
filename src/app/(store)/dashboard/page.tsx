import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Moon, Sparkles, User } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageHero, SectionShell, Surface, GoldCtaLink } from "@/components/site/page-chrome";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/dashboard");

  let reports: Array<{
    id: string;
    jobStatus: string;
    product: { name: string; slug: string };
  }> = [];
  try {
    reports = await prisma.report.findMany({
      where: { userId: session.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { product: { select: { name: true, slug: true } } },
    });
  } catch {
    reports = [];
  }

  const name = session.firstName || session.email.split("@")[0];

  const cards = [
    { title: "My Reports", href: "/dashboard/reports", description: "View and download purchased reports.", icon: FileText },
    { title: "Daily Horoscope", href: "/dashboard/horoscope", description: "Today's personalized guidance.", icon: Moon },
    { title: "AI Assistant", href: "/dashboard/ai", description: "Ask reflective questions about your chart.", icon: Sparkles },
    { title: "Profile", href: "/dashboard/profile", description: "Manage birth details and settings.", icon: User },
  ];

  return (
    <div>
      <PageHero
        eyebrow="Dashboard"
        title={`Welcome back, ${name}`}
        subtitle="Your personal astrology hub — reports, guidance, and self-discovery tools."
      />

      <SectionShell muted>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ title, href, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="rounded-2xl border border-white bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--jk-gold)]/15 text-[var(--jk-gold-dark)]">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-[var(--jk-muted)]">{description}</p>
            </Link>
          ))}
        </div>

        <Surface className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold">Recent reports</h2>
            <Link href="/services" className="text-sm font-medium text-[var(--jk-gold-dark)] hover:underline">
              Browse services
            </Link>
          </div>
          {reports.length ? (
            <ul className="mt-4 divide-y divide-[var(--jk-line)]">
              {reports.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium">{r.product.name}</p>
                    <p className="text-[var(--jk-muted)]">
                      Status: {r.jobStatus.replace(/_/g, " ").toLowerCase()}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/reports`}
                    className="rounded-full border border-[var(--jk-line)] px-3 py-1.5 text-xs font-medium hover:border-[var(--jk-gold)]"
                  >
                    View
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-2xl border border-dashed border-[var(--jk-line)] bg-[#f8f9fb] p-8 text-center">
              <p className="text-[var(--jk-muted)]">No reports yet.</p>
              <div className="mt-4 flex justify-center">
                <GoldCtaLink href="/services/janam-kundali">Create My Kundali</GoldCtaLink>
              </div>
            </div>
          )}
        </Surface>
      </SectionShell>
    </div>
  );
}

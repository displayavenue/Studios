import type { Metadata } from "next";
import { Fraunces, Source_Serif_4 } from "next/font/google";
import { Container } from "@homeopathypharma/ui";
import { AdminAppShell } from "@/components/admin-app-shell";
import { AdminAuthGate } from "@/components/admin-auth-gate";
import { AdminNav } from "@/components/admin-nav";
import { AdminSignOut } from "@/components/admin-sign-out";
import { readAdminSession } from "@/lib/cms-auth";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Admin · HomeopathyPharma", template: "%s · Admin" },
  description: "WordPress-style CMS and operations command center for HomeopathyPharma.",
  robots: { index: false, follow: false },
};

async function AdminHeader() {
  const session = await readAdminSession();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
      <span className="font-display" style={{ fontWeight: 600, color: "var(--hp-color-ivory-50)" }}>
        HomeopathyPharma <span style={{ color: "var(--hp-color-amber-400)" }}>Admin</span>
      </span>
      {session ? (
        <span
          style={{
            fontSize: "0.85rem",
            color: "var(--hp-color-sage-200)",
            display: "inline-flex",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          {session.email}
          <AdminSignOut />
        </span>
      ) : null}
    </div>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSerif.variable}`}>
      <body className="font-body">
        <AdminAppShell
          header={<AdminHeader />}
          nav={
            <Container>
              <AdminNav roles={["super-admin"]} />
            </Container>
          }
        >
          <AdminAuthGate>{children}</AdminAuthGate>
        </AdminAppShell>
      </body>
    </html>
  );
}

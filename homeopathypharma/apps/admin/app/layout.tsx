import type { Metadata } from "next";
import { Fraunces, Source_Serif_4 } from "next/font/google";
import { Container } from "@homeopathypharma/ui";
import { AdminAppShell } from "@/components/admin-app-shell";
import { AdminNav } from "@/components/admin-nav";
import { getAdminSession } from "@/lib/api";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Admin · HomeopathyPharma", template: "%s · Admin" },
  description: "Operations command center for HomeopathyPharma.",
  robots: { index: false, follow: false },
};

function AdminHeader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span className="font-display" style={{ fontWeight: 600, color: "var(--hp-color-ivory-50)" }}>
        HomeopathyPharma <span style={{ color: "var(--hp-color-amber-400)" }}>Admin</span>
      </span>
    </div>
  );
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSerif.variable}`}>
      <body className="font-body">
        <AdminAppShell
          header={<AdminHeader />}
          nav={
            <Container>
              <AdminNav roles={session?.roles ?? ["super-admin"]} />
            </Container>
          }
        >
          {children}
        </AdminAppShell>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Fraunces, Source_Serif_4 } from "next/font/google";
import { DoctorAppShell } from "@/components/doctor-app-shell";
import { DoctorNav } from "@/components/doctor-nav";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Doctor portal · HomeopathyPharma", template: "%s · Doctor portal" },
  description: "Practice management and consultations for verified homeopathic doctors.",
  robots: { index: false, follow: false },
};

function DoctorHeader() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--hp-space-4)" }}>
      <span className="font-display" style={{ fontWeight: 600, color: "var(--hp-color-teal-900)" }}>
        HomeopathyPharma <span style={{ fontWeight: 400, color: "var(--hp-color-text-muted)" }}>Doctor</span>
      </span>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSerif.variable}`}>
      <body className="font-body">
        <DoctorAppShell header={<DoctorHeader />} nav={<DoctorNav />}>
          {children}
        </DoctorAppShell>
      </body>
    </html>
  );
}

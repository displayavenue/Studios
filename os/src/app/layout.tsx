import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DisplayAvenue OS",
  description:
    "Operate your digital marketing agency: acquire, qualify, sell, onboard, run Meta campaigns, report, and retain — on os.displayavenue.com.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

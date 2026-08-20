import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DisplayAvenue Growth360 | Find Your Business Opportunity",
  description:
    "Free Growth360 analysis: growth score, competitors, marketing strategy, ROI preview, and a ₹99 strategy call with DisplayAvenue.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

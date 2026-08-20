import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { buildOrganizationJsonLd, buildWebSiteJsonLd, serializeJsonLd } from "@homeopathypharma/seo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WebAppShell } from "@/components/web-app-shell";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.WEB_URL ?? process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HomeopathyPharma — Medicines, doctors & health guidance",
    template: "%s · HomeopathyPharma",
  },
  description:
    "Order homeopathic medicines, explore remedies, and consult listed BHMS practitioners in Mumbai. Clear labelling and educational health resources.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "HomeopathyPharma",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const orgJsonLd = serializeJsonLd(
    buildOrganizationJsonLd({
      name: "HomeopathyPharma",
      url: siteUrl,
      logoUrl: `${siteUrl}/brand/logo.svg`,
      description: "Homeopathic pharmacy and healthcare education platform.",
    }),
  );
  const siteJsonLd = serializeJsonLd(
    buildWebSiteJsonLd({
      name: "HomeopathyPharma",
      url: siteUrl,
      searchUrlTemplate: `${siteUrl}/search?q={search_term_string}`,
    }),
  );

  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: orgJsonLd }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: siteJsonLd }} />
      </head>
      <body className="font-body">
        <WebAppShell header={<SiteHeader />} footer={<SiteFooter />}>
          {children}
        </WebAppShell>
      </body>
    </html>
  );
}

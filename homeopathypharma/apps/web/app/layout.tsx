import type { Metadata } from "next";
import { Fraunces, Source_Serif_4 } from "next/font/google";
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

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.WEB_URL ?? process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HomeopathyPharma — Thoughtful homeopathic care",
    template: "%s · HomeopathyPharma",
  },
  description:
    "Premium homeopathic pharmacy and health education platform. Explore remedies, connect with verified practitioners, and learn from curated educational content.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "HomeopathyPharma",
  },
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
    <html lang="en" className={`${fraunces.variable} ${sourceSerif.variable}`}>
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

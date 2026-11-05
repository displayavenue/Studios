import type { Metadata } from "next";
import PublicQuotationClient from "./PublicQuotationClient";

export const metadata: Metadata = {
  title: "Quotation | DisplayAvenue",
  description: "Secure client quotation from DisplayAvenue / Mediashouter.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function PublicQuotationPage() {
  return <PublicQuotationClient />;
}

import type { NextConfig } from "next";

/**
 * Hostinger shared hosting serves static files from public_html (no Node runtime via SSH).
 * `output: "export"` produces an `out/` directory for FTP/SCP deploy.
 * Full SSR/API will move to Node.js Web App / VPS when credentials and plan allow.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  transpilePackages: ["@homeopathypharma/ui", "@homeopathypharma/seo"],
};

export default nextConfig;

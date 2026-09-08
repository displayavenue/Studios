import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const hasDb = Boolean(process.env.DATABASE_URL);
  const mock = process.env.USE_MOCK_PROVIDERS === "true" || process.env.JYOTISH_MODE === "development";

  return NextResponse.json({
    ok: true,
    service: "jyotishkundali",
    brand: process.env.NEXT_PUBLIC_BRAND_NAME || "JyotishKundali",
    region: process.env.VERCEL_REGION || "local",
    env: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
    databaseConfigured: hasDb,
    mockProviders: mock,
    timestamp: new Date().toISOString(),
  });
}

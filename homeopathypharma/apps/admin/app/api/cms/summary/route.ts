import { NextResponse } from "next/server";
import {
  ensureCmsDefaults,
  getCmsSummary,
  getHomepage,
  getMenus,
  getSettings,
  listMedia,
  listPages,
  listCatalogBrands,
  listCatalogDoctors,
  listCatalogProducts,
} from "@homeopathypharma/content-store";
import { requireAdminSession } from "@/lib/cms-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return auth.response;
  ensureCmsDefaults();
  const homepage = getHomepage();
  return NextResponse.json({
    ...getCmsSummary(),
    products: listCatalogProducts(true).length,
    doctors: listCatalogDoctors(true).length,
    brands: listCatalogBrands().length,
    pages: listPages().length,
    media: listMedia().length,
    menuItems: getMenus().header.length + getMenus().footer.length,
    banners: homepage.banners.length,
    settings: getSettings(),
  });
}

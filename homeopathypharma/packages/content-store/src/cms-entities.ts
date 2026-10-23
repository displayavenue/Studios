import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cmsFile, resolveCmsDir } from "./paths.js";
import type { CmsMediaItem, CmsMenuItem, CmsMenus, CmsPage, CmsSettings } from "./types.js";

function readJson<T>(fileName: string, fallback: T): T {
  const path = cmsFile(fileName);
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function writeJson(fileName: string, value: unknown): void {
  const dir = resolveCmsDir();
  mkdirSync(dir, { recursive: true });
  writeFileSync(cmsFile(fileName), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function nowIso() {
  return new Date().toISOString();
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

const DEFAULT_PAGES: CmsPage[] = [
  {
    id: "page-about",
    slug: "about",
    title: "About HomeopathyPharma",
    excerpt: "India’s labelled homeopathy pharmacy and doctor network.",
    bodyHtml:
      "<p>HomeopathyPharma stocks SBL, Dr. Reckeweg, and Schwabe medicines with clear pack labels, and connects patients to listed BHMS doctors.</p>",
    status: "published",
    seoTitle: "About · HomeopathyPharma",
    seoDescription: "Learn about HomeopathyPharma — medicines, brands, and listed doctors.",
    updatedAt: nowIso(),
  },
  {
    id: "page-contact",
    slug: "contact",
    title: "Contact us",
    excerpt: "Support for orders, consultations, and catalogue questions.",
    bodyHtml:
      "<p>Email <a href=\"mailto:support@homeopathypharma.com\">support@homeopathypharma.com</a> or call +91 22 4000 0000 (Mon–Sat, 10am–7pm IST).</p>",
    status: "published",
    seoTitle: "Contact · HomeopathyPharma",
    seoDescription: "Contact HomeopathyPharma support.",
    updatedAt: nowIso(),
  },
];

const DEFAULT_MENUS: CmsMenus = {
  header: [
    { id: "h-shop", label: "Shop", href: "/shop/", order: 1 },
    { id: "h-brands", label: "Brands", href: "/brands/", order: 2 },
    { id: "h-doctors", label: "Doctors", href: "/doctors/", order: 3 },
    { id: "h-health", label: "Health library", href: "/health/", order: 4 },
  ],
  footer: [
    { id: "f-about", label: "About", href: "/p/about/", order: 1 },
    { id: "f-contact", label: "Contact", href: "/p/contact/", order: 2 },
    { id: "f-shipping", label: "Shipping", href: "/shipping-policy/", order: 3 },
    { id: "f-returns", label: "Returns", href: "/return-policy/", order: 4 },
  ],
  mobile: [
    { id: "m-home", label: "Home", href: "/", order: 1 },
    { id: "m-shop", label: "Shop", href: "/shop/", order: 2 },
    { id: "m-brands", label: "Brands", href: "/brands/", order: 3 },
    { id: "m-cart", label: "Cart", href: "/cart/", order: 4 },
    { id: "m-account", label: "Account", href: "/login/", order: 5 },
  ],
};

const DEFAULT_MEDIA: CmsMediaItem[] = [
  {
    id: "media-banner-medicines",
    url: "/images/banners/banner-medicines.png",
    alt: "Homeopathy medicines",
    filename: "banner-medicines.png",
    mimeType: "image/png",
    uploadedAt: nowIso(),
  },
  {
    id: "media-banner-consult",
    url: "/images/banners/banner-consult.png",
    alt: "Doctor consultation",
    filename: "banner-consult.png",
    mimeType: "image/png",
    uploadedAt: nowIso(),
  },
  {
    id: "media-banner-brands",
    url: "/images/banners/banner-brands.png",
    alt: "Trusted brands",
    filename: "banner-brands.png",
    mimeType: "image/png",
    uploadedAt: nowIso(),
  },
];

const DEFAULT_SETTINGS: CmsSettings = {
  siteName: "HomeopathyPharma",
  tagline: "Labelled homeopathy medicines & listed BHMS doctors",
  supportEmail: "support@homeopathypharma.com",
  supportPhone: "+91 22 4000 0000",
  defaultSeoTitle: "HomeopathyPharma — medicines & doctors",
  defaultSeoDescription:
    "Shop SBL, Reckeweg, and Schwabe homeopathy medicines. Consult listed BHMS doctors online or in clinic.",
  currency: "INR",
  timezone: "Asia/Kolkata",
};

/* ——— Pages ——— */

export function listPages(): CmsPage[] {
  return readJson<CmsPage[]>("pages.json", DEFAULT_PAGES);
}

export function getPageBySlug(slug: string): CmsPage | null {
  return listPages().find((p) => p.slug === slug) ?? null;
}

export function savePages(pages: CmsPage[]): CmsPage[] {
  writeJson("pages.json", pages);
  return pages;
}

export function upsertPage(input: Partial<CmsPage> & { title: string }): CmsPage {
  const pages = listPages();
  const id = input.id ?? `page-${slugify(input.title)}-${Date.now().toString(36)}`;
  const slug = input.slug?.trim() || slugify(input.title);
  const existing = pages.findIndex((p) => p.id === id);
  const next: CmsPage = {
    id,
    slug,
    title: input.title,
    excerpt: input.excerpt ?? "",
    bodyHtml: input.bodyHtml ?? "",
    status: input.status ?? "draft",
    seoTitle: input.seoTitle,
    seoDescription: input.seoDescription,
    updatedAt: nowIso(),
  };
  if (existing >= 0) pages[existing] = next;
  else pages.push(next);
  savePages(pages);
  return next;
}

export function deletePage(id: string): boolean {
  const pages = listPages();
  const next = pages.filter((p) => p.id !== id);
  if (next.length === pages.length) return false;
  savePages(next);
  return true;
}

/* ——— Menus ——— */

export function getMenus(): CmsMenus {
  return readJson<CmsMenus>("menus.json", DEFAULT_MENUS);
}

export function saveMenus(menus: CmsMenus): CmsMenus {
  const normalize = (items: CmsMenuItem[]) =>
    [...items]
      .map((item, index) => ({
        ...item,
        id: item.id || `menu-${index}-${Date.now().toString(36)}`,
        order: typeof item.order === "number" ? item.order : index + 1,
      }))
      .sort((a, b) => a.order - b.order);
  const next = {
    header: normalize(menus.header ?? []),
    footer: normalize(menus.footer ?? []),
    mobile: normalize(menus.mobile ?? []),
  };
  writeJson("menus.json", next);
  return next;
}

/* ——— Media ——— */

export function listMedia(): CmsMediaItem[] {
  return readJson<CmsMediaItem[]>("media.json", DEFAULT_MEDIA);
}

export function saveMedia(items: CmsMediaItem[]): CmsMediaItem[] {
  writeJson("media.json", items);
  return items;
}

export function registerMedia(item: Omit<CmsMediaItem, "id" | "uploadedAt"> & { id?: string }): CmsMediaItem {
  const items = listMedia();
  const next: CmsMediaItem = {
    id: item.id ?? `media-${Date.now().toString(36)}`,
    url: item.url,
    alt: item.alt,
    filename: item.filename,
    mimeType: item.mimeType,
    uploadedAt: nowIso(),
  };
  items.unshift(next);
  saveMedia(items);
  return next;
}

export function deleteMedia(id: string): boolean {
  const items = listMedia();
  const next = items.filter((m) => m.id !== id);
  if (next.length === items.length) return false;
  saveMedia(next);
  return true;
}

/** Resolve directory for uploaded binary assets (storefront public/images/uploads). */
export function resolveMediaUploadDir(): string {
  const cms = resolveCmsDir();
  // data/cms → repo root → apps/web/public/images/uploads
  const candidates = [
    join(cms, "../../apps/web/public/images/uploads"),
    join(cms, "../apps/web/public/images/uploads"),
    join(process.cwd(), "public/images/uploads"),
    join(process.cwd(), "../web/public/images/uploads"),
  ];
  for (const dir of candidates) {
    try {
      mkdirSync(dir, { recursive: true });
      return dir;
    } catch {
      // try next
    }
  }
  const fallback = join(cms, "uploads");
  mkdirSync(fallback, { recursive: true });
  return fallback;
}

/* ——— Settings ——— */

export function getSettings(): CmsSettings {
  return readJson<CmsSettings>("settings.json", DEFAULT_SETTINGS);
}

export function saveSettings(settings: CmsSettings): CmsSettings {
  writeJson("settings.json", settings);
  return settings;
}

/** Ensure default CMS JSON files exist on disk for first-run admin. */
export function ensureCmsDefaults(): void {
  if (!existsSync(cmsFile("pages.json"))) savePages(DEFAULT_PAGES);
  if (!existsSync(cmsFile("menus.json"))) saveMenus(DEFAULT_MENUS);
  if (!existsSync(cmsFile("media.json"))) saveMedia(DEFAULT_MEDIA);
  if (!existsSync(cmsFile("settings.json"))) saveSettings(DEFAULT_SETTINGS);
}

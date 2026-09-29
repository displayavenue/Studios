import { readFileSync, existsSync } from "fs";
import { join } from "path";

export type CmsMenuItem = { id: string; label: string; href: string; order: number };
export type CmsMenus = { header: CmsMenuItem[]; footer: CmsMenuItem[]; mobile: CmsMenuItem[] };

const FALLBACK: CmsMenus = {
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

function loadMenus(): CmsMenus {
  const candidates = [
    join(process.cwd(), "../../data/cms/menus.json"),
    join(process.cwd(), "data/cms/menus.json"),
    join(process.cwd(), "../data/cms/menus.json"),
  ];
  for (const path of candidates) {
    try {
      if (!existsSync(path)) continue;
      return JSON.parse(readFileSync(path, "utf8")) as CmsMenus;
    } catch {
      // try next
    }
  }
  return FALLBACK;
}

export const MENUS = loadMenus();

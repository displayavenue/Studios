export type RobotsDirective = "index" | "noindex" | "follow" | "nofollow" | "noarchive" | "nosnippet";

export interface RobotsMeta {
  directives: RobotsDirective[];
}

/** Private/authenticated pages — never index. */
export const PRIVATE_PAGE_ROBOTS: RobotsMeta = {
  directives: ["noindex", "nofollow", "noarchive"],
};

export const CHECKOUT_ROBOTS: RobotsMeta = PRIVATE_PAGE_ROBOTS;
export const CART_ROBOTS: RobotsMeta = PRIVATE_PAGE_ROBOTS;
export const ACCOUNT_ROBOTS: RobotsMeta = PRIVATE_PAGE_ROBOTS;
export const ADMIN_ROBOTS: RobotsMeta = PRIVATE_PAGE_ROBOTS;
export const DOCTOR_PORTAL_ROBOTS: RobotsMeta = PRIVATE_PAGE_ROBOTS;

/** Public indexable storefront pages. */
export const PUBLIC_PAGE_ROBOTS: RobotsMeta = {
  directives: ["index", "follow"],
};

export interface RobotsTxtRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

export const DEFAULT_ROBOTS_TXT_RULES: RobotsTxtRule[] = [
  {
    userAgent: "*",
    allow: ["/"],
    disallow: [
      "/cart",
      "/checkout",
      "/account",
      "/admin",
      "/doctor/dashboard",
      "/api/",
      "/search?*",
    ],
  },
];

export function renderRobotsMeta(meta: RobotsMeta): string {
  return meta.directives.join(", ");
}

export function renderRobotsTxt(
  sitemapUrl: string,
  rules: RobotsTxtRule[] = DEFAULT_ROBOTS_TXT_RULES,
): string {
  const blocks = rules.map((rule) => {
    const lines = [`User-agent: ${rule.userAgent}`];
    for (const path of rule.allow ?? []) lines.push(`Allow: ${path}`);
    for (const path of rule.disallow ?? []) lines.push(`Disallow: ${path}`);
    if (rule.crawlDelay !== undefined) lines.push(`Crawl-delay: ${rule.crawlDelay}`);
    return lines.join("\n");
  });
  return `${blocks.join("\n\n")}\n\nSitemap: ${sitemapUrl}\n`;
}

/** Returns robots meta for a given path pattern. */
export function robotsForPath(path: string): RobotsMeta {
  const normalized = path.toLowerCase();
  const privatePrefixes = ["/cart", "/checkout", "/account", "/admin", "/doctor/dashboard"];
  if (privatePrefixes.some((p) => normalized.startsWith(p))) {
    return PRIVATE_PAGE_ROBOTS;
  }
  return PUBLIC_PAGE_ROBOTS;
}

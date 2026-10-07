const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "ref",
  "session_id",
]);

export interface CanonicalOptions {
  baseUrl: string;
  path: string;
  /** Strip known tracking query params. Default true. */
  stripTracking?: boolean;
  /** Preserve these query params in canonical. */
  allowedParams?: string[];
}

/**
 * Build a canonical URL — lowercase path, no trailing slash, tracking stripped.
 */
export function buildCanonicalUrl(opts: CanonicalOptions): string {
  const base = opts.baseUrl.replace(/\/+$/, "");
  const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
  const normalizedPath = path.replace(/\/+$/, "") || "/";

  const [pathnamePart, query = ""] = normalizedPath.split("?");
  const pathname = pathnamePart ?? "/";
  const params = new URLSearchParams(query);
  const allowed = new Set(opts.allowedParams ?? []);

  if (opts.stripTracking !== false) {
    for (const key of [...params.keys()]) {
      if (TRACKING_PARAMS.has(key) || (!allowed.has(key) && allowed.size > 0)) {
        if (!allowed.has(key)) params.delete(key);
      }
    }
    if (allowed.size === 0) {
      for (const key of TRACKING_PARAMS) {
        params.delete(key);
      }
    }
  }

  const qs = params.toString();
  return `${base}${pathname.toLowerCase()}${qs ? `?${qs}` : ""}`;
}

export interface RedirectRule {
  from: string;
  to: string;
  status: 301 | 302 | 308;
}

/**
 * Resolve a redirect target if the path matches a rule.
 * Rules use prefix matching on normalized lowercase paths.
 */
export function resolveRedirect(
  path: string,
  rules: RedirectRule[],
): RedirectRule | null {
  const normalized = path.toLowerCase().replace(/\/+$/, "") || "/";
  for (const rule of rules) {
    const from = rule.from.toLowerCase().replace(/\/+$/, "") || "/";
    if (normalized === from || normalized.startsWith(`${from}/`)) {
      return rule;
    }
  }
  return null;
}

/** Common legacy slug redirect helper. */
export function slugRedirect(fromSlug: string, toSlug: string): RedirectRule {
  return {
    from: `/products/${fromSlug}`,
    to: `/products/${toSlug}`,
    status: 301,
  };
}

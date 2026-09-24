/**
 * Typed API client stubs — all requests target API_URL/v1.
 * Replace stub responses with live fetch when the backend is wired.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:4000";
export const API_V1 = `${API_BASE.replace(/\/$/, "")}/v1`;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_V1}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...init?.headers,
    },
    next: init?.next ?? { revalidate: 60 },
  });

  if (!res.ok) {
    let body: unknown;
    try {
      body = await res.json();
    } catch {
      body = undefined;
    }
    throw new ApiError(`API ${res.status}: ${path}`, res.status, body);
  }

  return res.json() as Promise<T>;
}

// ——— Storefront types & stubs ———

export interface ProductSummary {
  slug: string;
  name: string;
  brand: string;
  potency?: string;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  ingredients: string[];
  directions: string;
  warnings: string;
  variants: { id: string; label: string; inStock: boolean }[];
}

export interface SearchResult {
  products: ProductSummary[];
  articles: { slug: string; title: string }[];
  total: number;
}

export interface SitemapManifest {
  segments: { segment: string; urlCount: number; shards: string[] }[];
  staticUrls: string[];
}

export interface SeoEntry {
  loc: string;
  lastmod?: string;
}

/** Stub — GET /v1/products */
export async function listProducts(): Promise<ProductSummary[]> {
  try {
    return await apiFetch<ProductSummary[]>("/products");
  } catch {
    return [];
  }
}

/** Stub — GET /v1/products/:slug */
export async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    return await apiFetch<ProductDetail>(`/products/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

/** Stub — GET /v1/search?q= */
export async function searchCatalog(query: string): Promise<SearchResult> {
  try {
    return await apiFetch<SearchResult>(`/search?q=${encodeURIComponent(query)}`);
  } catch {
    return { products: [], articles: [], total: 0 };
  }
}

/** Stub — GET /v1/seo/sitemap-manifest */
export async function getSitemapManifest(): Promise<SitemapManifest> {
  try {
    return await apiFetch<SitemapManifest>("/seo/sitemap-manifest");
  } catch {
    return {
      segments: [],
      staticUrls: ["/", "/health", "/doctors", "/pets", "/search"],
    };
  }
}

/** Stub — GET /v1/seo/entries?segment= */
export async function getSitemapEntries(segment: string): Promise<SeoEntry[]> {
  try {
    return await apiFetch<SeoEntry[]>(`/seo/entries?segment=${encodeURIComponent(segment)}`);
  } catch {
    return [];
  }
}

export interface DoctorProfile {
  slug: string;
  name: string;
  credentials: string;
  specialties: string[];
}

export async function listDoctors(): Promise<DoctorProfile[]> {
  try {
    return await apiFetch<DoctorProfile[]>("/doctors");
  } catch {
    return [];
  }
}

export async function getDoctor(slug: string): Promise<DoctorProfile | null> {
  try {
    return await apiFetch<DoctorProfile>(`/doctors/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export interface HealthTopic {
  slug: string;
  title: string;
  kind: "body-system" | "organ" | "condition";
}

export async function getHealthTopic(
  kind: HealthTopic["kind"],
  slug: string,
): Promise<HealthTopic | null> {
  const segment = kind === "body-system" ? "body-systems" : kind === "organ" ? "organs" : "conditions";
  try {
    return await apiFetch<HealthTopic>(`/health/${segment}/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
}

export async function getArticle(slug: string): Promise<Article | null> {
  try {
    return await apiFetch<Article>(`/articles/${encodeURIComponent(slug)}`);
  } catch {
    return null;
  }
}

export interface CartSummary {
  itemCount: number;
  subtotal: string;
}

export async function getCart(): Promise<CartSummary> {
  try {
    return await apiFetch<CartSummary>("/cart");
  } catch {
    return { itemCount: 0, subtotal: "—" };
  }
}

export interface AccountProfile {
  email: string;
  name: string;
}

export async function getAccount(): Promise<AccountProfile | null> {
  try {
    return await apiFetch<AccountProfile>("/account/me");
  } catch {
    return null;
  }
}

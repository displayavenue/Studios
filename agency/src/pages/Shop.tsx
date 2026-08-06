import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import "../styles/pages.css";
import "./Shop.css";

export type ShopProduct = {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  category?: string;
  image?: string;
  features?: string[];
  enabled?: boolean;
  featured?: boolean;
};

export type ShopData = {
  enabled?: boolean;
  title?: string;
  eyebrow?: string;
  headline?: string;
  summary?: string;
  currency?: string;
  currencySymbol?: string;
  successMessage?: string;
  products?: ShopProduct[];
};

export const SHOP_DEFAULTS: ShopData = {
  enabled: true,
  title: "Shop",
  eyebrow: "Online Store",
  headline: "Shop DisplayAvenue products",
  summary: "Browse and buy products online. Secure checkout powered by Razorpay.",
  currency: "INR",
  currencySymbol: "₹",
  products: [],
};

export function formatInr(amount: number, symbol = "₹") {
  const n = Number(amount) || 0;
  return `${symbol}${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export async function loadShop(): Promise<ShopData> {
  const res = await fetch("/content/shop.json", { cache: "no-store" });
  if (!res.ok) return { ...SHOP_DEFAULTS };
  const json = (await res.json()) as ShopData;
  return { ...SHOP_DEFAULTS, ...json, products: Array.isArray(json.products) ? json.products : [] };
}

export function visibleProducts(data: ShopData): ShopProduct[] {
  return (data.products || []).filter((p) => p && p.enabled !== false && p.title && (p.slug || p.id));
}

export function Shop() {
  const [data, setData] = useState<ShopData>(SHOP_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const shop = await loadShop();
        if (!cancelled) setData(shop);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const products = useMemo(() => visibleProducts(data), [data]);
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  const filtered =
    category === "All" ? products : products.filter((p) => p.category === category);

  const symbol = data.currencySymbol || "₹";
  const enabled = data.enabled !== false;

  return (
    <div className="page-shell">
      <SEO
        title={`${data.title || "Shop"} | DisplayAvenue`}
        description={data.summary || SHOP_DEFAULTS.summary!}
        path="/shop"
      />
      <div className="container-wide">
        <div className="page-frame shop-frame">
          <div className="shop-hero">
            <p className="badge">{data.eyebrow || "Online Store"}</p>
            <h1 className="section-title">{data.headline || "Shop DisplayAvenue products"}</h1>
            <p className="section-sub">{data.summary}</p>
          </div>

          {!enabled ? (
            <div className="shop-empty">
              <h2>Shop temporarily closed</h2>
              <p>
                Please check back soon or <Link to="/contact">contact us</Link>.
              </p>
            </div>
          ) : loading ? (
            <p className="section-sub">Loading products…</p>
          ) : products.length === 0 ? (
            <div className="shop-empty">
              <h2>No products yet</h2>
              <p>Products added in the CMS will appear here.</p>
              <Link to="/contact" className="btn btn-primary">
                Contact us →
              </Link>
            </div>
          ) : (
            <>
              {categories.length > 1 && (
                <div className="shop-filters" role="tablist" aria-label="Product categories">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={category === cat ? "is-active" : ""}
                      onClick={() => setCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <div className="shop-grid">
                {filtered.map((p) => {
                  const slug = p.slug || p.id;
                  const price = Number(p.price) || 0;
                  const compare = Number(p.compareAtPrice) || 0;
                  return (
                    <article key={slug} className="shop-card">
                      <Link to={`/shop/${slug}`} className="shop-card-media">
                        {p.image ? (
                          <img src={p.image} alt={p.title} loading="lazy" />
                        ) : (
                          <div className="shop-card-placeholder" aria-hidden>
                            {p.title.slice(0, 1)}
                          </div>
                        )}
                        {p.featured ? <span className="shop-pill">Featured</span> : null}
                      </Link>
                      <div className="shop-card-body">
                        {p.category ? <p className="shop-card-cat">{p.category}</p> : null}
                        <h2>
                          <Link to={`/shop/${slug}`}>{p.title}</Link>
                        </h2>
                        <p>{p.summary}</p>
                        <div className="shop-card-foot">
                          <div className="shop-price">
                            <strong>{formatInr(price, symbol)}</strong>
                            {compare > price ? (
                              <span className="shop-compare">{formatInr(compare, symbol)}</span>
                            ) : null}
                          </div>
                          <Link to={`/shop/${slug}`} className="btn btn-primary btn-sm">
                            View / Buy
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

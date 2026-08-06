import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { SEO } from "../components/SEO";
import "../styles/pages.css";
import "./Shop.css";
import {
  formatInr,
  loadShop,
  SHOP_DEFAULTS,
  visibleProducts,
  type ShopData,
  type ShopProduct,
} from "./Shop";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>('script[data-da-razorpay="1"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.dataset.daRazorpay = "1";
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function ShopProductPage() {
  const { slug = "" } = useParams();
  const [data, setData] = useState<ShopData>(SHOP_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "paying" | "ok" | "err">("idle");
  const [message, setMessage] = useState("");

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

  const product: ShopProduct | undefined = useMemo(() => {
    return visibleProducts(data).find((p) => (p.slug || p.id) === slug);
  }, [data, slug]);

  const symbol = data.currencySymbol || "₹";
  const enabled = data.enabled !== false;

  async function onBuy(e: FormEvent) {
    e.preventDefault();
    if (!product) return;
    setStatus("paying");
    setMessage("");
    try {
      const ready = await loadRazorpay();
      if (!ready || !window.Razorpay) {
        throw new Error("Could not load Razorpay checkout. Please try again.");
      }

      const res = await fetch("/shop-api.php?action=create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          productId: product.id || product.slug,
          quantity: qty,
          name,
          email,
          phone,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || "Could not start checkout");
      }

      const rzp = new window.Razorpay({
        key: json.keyId,
        amount: json.amount,
        currency: json.currency || "INR",
        name: "DisplayAvenue",
        description: product.title,
        order_id: json.razorpayOrderId,
        prefill: json.prefill || { name, email, contact: phone },
        theme: { color: "#0056ff" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/shop-api.php?action=verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "same-origin",
              body: JSON.stringify({
                orderId: json.orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyJson = await verifyRes.json().catch(() => ({}));
            if (!verifyRes.ok || verifyJson.ok === false) {
              throw new Error(verifyJson.error || "Payment verification failed");
            }
            setStatus("ok");
            setMessage(
              verifyJson.message ||
                data.successMessage ||
                "Payment successful. We will contact you shortly.",
            );
          } catch (err) {
            setStatus("err");
            setMessage(err instanceof Error ? err.message : "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            setStatus((s) => (s === "ok" ? s : "idle"));
          },
        },
      });
      rzp.open();
      setStatus("idle");
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Checkout failed");
    }
  }

  if (loading) {
    return (
      <div className="page-shell">
        <div className="container">
          <div className="page-frame" style={{ padding: "2rem" }}>
            <p className="section-sub">Loading product…</p>
          </div>
        </div>
      </div>
    );
  }

  if (!enabled || !product) {
    return (
      <div className="page-shell">
        <div className="container">
          <div className="page-frame shop-empty" style={{ padding: "2rem" }}>
            <h1 className="section-title">Product not found</h1>
            <p className="section-sub">This product is unavailable or the shop is closed.</p>
            <Link to="/shop" className="btn btn-primary">
              Back to shop →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const price = Number(product.price) || 0;
  const compare = Number(product.compareAtPrice) || 0;
  const features = Array.isArray(product.features) ? product.features : [];
  const total = price * qty;

  return (
    <div className="page-shell">
      <SEO
        title={`${product.title} | Shop | DisplayAvenue`}
        description={product.summary || product.description || ""}
        path={`/shop/${product.slug || product.id}`}
      />
      <div className="container-wide">
        <div className="page-frame shop-product">
          <nav className="shop-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/shop">Shop</Link>
            <span>/</span>
            <span>{product.title}</span>
          </nav>

          <div className="shop-product-grid">
            <div className="shop-product-media">
              {product.image ? (
                <img src={product.image} alt={product.title} />
              ) : (
                <div className="shop-card-placeholder shop-product-placeholder" aria-hidden>
                  {product.title.slice(0, 1)}
                </div>
              )}
            </div>

            <div className="shop-product-info">
              {product.category ? <p className="badge">{product.category}</p> : null}
              <h1 className="section-title">{product.title}</h1>
              <p className="section-sub">{product.summary}</p>
              <div className="shop-price shop-price-lg">
                <strong>{formatInr(price, symbol)}</strong>
                {compare > price ? (
                  <span className="shop-compare">{formatInr(compare, symbol)}</span>
                ) : null}
              </div>

              {features.length > 0 && (
                <ul className="shop-feature-list">
                  {features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              )}

              <div className="shop-description">
                {(product.description || "")
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((para) => (
                    <p key={para.slice(0, 24)}>{para}</p>
                  ))}
              </div>

              <form className="shop-checkout" onSubmit={onBuy}>
                <h2>Buy this product</h2>
                <label>
                  Quantity
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={qty}
                    onChange={(e) => setQty(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
                  />
                </label>
                <label>
                  Full name
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                </label>
                <label>
                  Email
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                  />
                </label>
                <label>
                  Phone
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91…"
                  />
                </label>
                <p className="shop-total">
                  Total: <strong>{formatInr(total, symbol)}</strong>
                </p>
                <button className="btn btn-primary" type="submit" disabled={status === "paying"}>
                  {status === "paying" ? "Starting Razorpay…" : "Pay with Razorpay →"}
                </button>
                {status === "ok" && <p className="shop-msg ok">{message}</p>}
                {status === "err" && <p className="shop-msg err">{message}</p>}
                <p className="shop-secure">Secure payments via Razorpay. UPI, cards, and netbanking supported.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

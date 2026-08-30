#!/usr/bin/env python3
"""Build a Hostinger-ready static VELORA storefront and write to deploy/velora-static."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
from html import escape
from pathlib import Path

OUT = Path("/workspace/deploy/velora-static")


def inr(n: float) -> str:
    return f"₹{n:,.0f}"


def run_sql() -> list[dict]:
    cmd = [
        "psql",
        "postgresql://velora:velora_dev@localhost:5432/velora",
        "-At",
        "-F",
        "\t",
        "-c",
        'select slug, title, "sellingPrice", "compareAtPrice", "primaryImageUrl", '
        'coalesce("shortDescription",\'\'), coalesce(brand,\'\'), "stockQuantity" '
        "from products where status='PUBLISHED' order by \"createdAt\" asc;",
    ]
    raw = subprocess.check_output(cmd, text=True).strip()
    products = []
    for line in raw.splitlines():
        if not line.strip():
            continue
        slug, title, price, compare, image, desc, brand, stock = line.split("\t")
        products.append(
            {
                "slug": slug,
                "title": title,
                "price": float(price),
                "compare": float(compare or 0),
                "image": image
                or "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
                "desc": desc or "Curated product from VELORA.",
                "brand": brand or "VELORA",
                "stock": int(float(stock or 0)),
            }
        )
    return products


CSS = r"""@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
:root{--ink:#1c1915;--muted:#6e655a;--accent:#0f6b5c;--line:rgba(28,25,21,.12)}
*{box-sizing:border-box}body{margin:0;font-family:Outfit,system-ui,sans-serif;color:var(--ink);background:radial-gradient(1200px 600px at 10% -10%,rgba(15,107,92,.12),transparent 55%),radial-gradient(900px 500px at 100% 0%,rgba(217,203,182,.5),transparent 50%),linear-gradient(180deg,#f7f3eb,#f3efe6 45%,#efe8dc);min-height:100vh;display:flex;flex-direction:column}
.display{font-family:"Cormorant Garamond",Georgia,serif}a{color:inherit;text-decoration:none}.muted{color:var(--muted)}
.wrap{width:100%;max-width:1120px;margin:0 auto;padding:0 1.25rem}
.announce{background:var(--ink);color:#f7f3eb;font-size:12px;letter-spacing:.08em;text-transform:uppercase;text-align:center;padding:.55rem 1rem}
header.site{position:sticky;top:0;z-index:40;backdrop-filter:blur(10px);background:rgba(247,243,235,.92);border-bottom:1px solid var(--line)}
.nav{display:flex;align-items:center;justify-content:space-between;height:64px;gap:1rem}
.logo{font-family:"Cormorant Garamond",serif;font-size:1.7rem;letter-spacing:.12em}
.nav-links{display:none;gap:1.25rem;font-size:.9rem}@media(min-width:768px){.nav-links{display:flex}}
.btn{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 1.15rem;border-radius:8px;border:1px solid transparent;font:inherit;font-weight:500;font-size:.9rem;cursor:pointer;background:var(--ink);color:#fff}
.btn.accent{background:var(--accent)}.btn.outline{background:transparent;border-color:rgba(255,255,255,.45);color:#fff}
.btn.ghost{background:transparent;border-color:var(--line);color:var(--ink)}
.hero{position:relative;min-height:88vh;display:flex;align-items:flex-end;color:#fff;overflow:hidden}
.hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(28,25,21,.78),rgba(28,25,21,.35),transparent)}
.hero .content{position:relative;padding:6rem 0 4rem;max-width:640px}
.hero .brand{font-size:clamp(3rem,8vw,5rem);letter-spacing:.18em;margin:0}
.hero .tag{text-transform:uppercase;letter-spacing:.28em;font-size:.75rem;color:#d9cbb6}
.hero h1{font-size:clamp(1.8rem,4vw,3rem);margin:1.5rem 0 .75rem;font-weight:600}
.hero p{color:#e8dfd2;max-width:28rem;line-height:1.55}
.cta-row{display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.5rem}
.section{padding:4rem 0}.section-head{display:flex;justify-content:space-between;align-items:end;gap:1rem;margin-bottom:1.5rem}
.section-head h2{font-size:clamp(1.8rem,3vw,2.4rem);margin:0}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem}
@media(min-width:768px){.grid{grid-template-columns:repeat(3,1fr);gap:1.25rem}}
@media(min-width:1024px){.grid{grid-template-columns:repeat(4,1fr)}}
.card .img{aspect-ratio:4/5;background:rgba(217,203,182,.35);overflow:hidden;position:relative;display:block}
.card .img img{width:100%;height:100%;object-fit:cover;transition:transform .45s}
.card:hover .img img{transform:scale(1.03)}
.card .meta{padding-top:.75rem}.card .title{font-size:.92rem;font-weight:500;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.5em}
.price{margin-top:.4rem;display:flex;gap:.5rem;align-items:baseline;flex-wrap:wrap}
.price .now{font-weight:600}.price .was{color:var(--muted);text-decoration:line-through;font-size:.85rem}.price .save{color:var(--accent);font-size:.75rem}
.badge{position:absolute;left:.5rem;top:.5rem;background:var(--ink);color:#fff;font-size:10px;letter-spacing:.08em;text-transform:uppercase;padding:.2rem .45rem}
.why{border-block:1px solid var(--line);padding:4rem 0;text-align:center}
.why .cols{display:grid;gap:1.5rem;text-align:left;margin-top:2rem}@media(min-width:768px){.why .cols{grid-template-columns:repeat(3,1fr)}}
footer.site{background:var(--ink);color:#f3efe6;margin-top:auto;padding:3rem 0 1.5rem}
footer .cols{display:grid;gap:2rem}@media(min-width:768px){footer .cols{grid-template-columns:2fr 1fr 1fr 1.2fr}}
footer a{color:#d9cbb6;font-size:.9rem}
footer .copy{border-top:1px solid rgba(255,255,255,.1);margin-top:2rem;padding-top:1rem;text-align:center;font-size:12px;color:#a89c8c}
.pdp{display:grid;gap:2rem;padding:2.5rem 0}@media(min-width:900px){.pdp{grid-template-columns:1fr 1fr}}
.pdp .gallery{aspect-ratio:1;background:rgba(217,203,182,.3);overflow:hidden}
.pdp .gallery img{width:100%;height:100%;object-fit:cover}
.cart-line{display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--line)}
.cart-line img{width:88px;height:88px;object-fit:cover;background:rgba(217,203,182,.3)}
.toast{position:fixed;bottom:1.25rem;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:.7rem 1rem;border-radius:999px;font-size:.85rem;opacity:0;pointer-events:none;transition:opacity .25s;z-index:50}
.toast.show{opacity:1}.note{font-size:.8rem;color:var(--muted);margin-top:1rem}
"""

CART_JS = r"""const CART_KEY='velora_cart_v1';
function getCart(){try{return JSON.parse(localStorage.getItem(CART_KEY)||'[]')}catch(e){return []}}
function saveCart(items){localStorage.setItem(CART_KEY,JSON.stringify(items));updateCartCount()}
function updateCartCount(){const n=getCart().reduce((s,i)=>s+i.qty,0);document.querySelectorAll('[data-cart-count]').forEach(el=>{el.textContent=String(n)})}
function addToCart(product){const items=getCart();const ex=items.find(i=>i.slug===product.slug);if(ex)ex.qty+=1;else items.push({slug:product.slug,title:product.title,price:product.price,image:product.image,qty:1});saveCart(items);toast('Added to cart')}
function money(n){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)}
function toast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)}
document.addEventListener('DOMContentLoaded',updateCartCount);
"""

CART_PAGE_JS = r"""function renderCart(){
  var root=document.getElementById('cart-root');
  if(!root) return;
  var items=getCart();
  if(!items.length){root.innerHTML='<p class="muted">Your cart is empty.</p>';return;}
  var sub=items.reduce(function(s,i){return s+i.price*i.qty},0);
  root.innerHTML=items.map(function(i){
    return '<div class="cart-line"><img src="'+i.image+'" alt=""/><div style="flex:1"><div style="font-weight:500">'+i.title+'</div><div class="muted" style="font-size:.85rem;margin-top:.25rem">Qty '+i.qty+'</div><div style="margin-top:.35rem">'+money(i.price*i.qty)+'</div></div><button class="btn ghost" style="height:36px" type="button" onclick="removeItem(\''+i.slug+'\')">Remove</button></div>';
  }).join('')+'<div style="margin-top:1rem;display:flex;justify-content:space-between;font-weight:600"><span>Subtotal</span><span>'+money(sub)+'</span></div>';
}
function removeItem(slug){saveCart(getCart().filter(function(i){return i.slug!==slug}));renderCart()}
document.addEventListener('DOMContentLoaded',function(){
  renderCart();
  var btn=document.getElementById('checkout-btn');
  if(btn) btn.onclick=function(){ if(!getCart().length){toast('Cart is empty');return;} toast('Order intent captured — connect Razorpay for live payments'); };
});
"""


def layout(title: str, body: str) -> str:
    year = __import__("datetime").datetime.now().year
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>{escape(title)}</title>
<meta name="description" content="VELORA — Smart Products. Better Living. Curated everyday products delivered across India."/>
<link rel="canonical" href="https://jyotishkundali.com/"/>
<meta property="og:title" content="VELORA — Smart Products. Better Living."/>
<meta property="og:url" content="https://jyotishkundali.com/"/>
<link rel="stylesheet" href="/assets/site.css"/>
<script defer src="/assets/cart.js"></script>
</head>
<body>
<div class="announce">Free shipping on prepaid orders · Easy returns · Ships across India where serviceable</div>
<header class="site"><div class="wrap nav">
  <a class="logo" href="/">VELORA</a>
  <nav class="nav-links">
    <a href="/shop.html">Shop</a>
    <a href="/shop.html">Trending</a>
    <a href="/shop.html">Best Sellers</a>
    <a href="/#why">Why VELORA</a>
  </nav>
  <div class="nav-actions">
    <a class="btn ghost" href="/cart.html">Cart (<span data-cart-count>0</span>)</a>
  </div>
</div></header>
{body}
<footer class="site"><div class="wrap">
  <div class="cols">
    <div><div class="display" style="font-size:1.8rem;letter-spacing:.12em">VELORA</div><p class="muted" style="color:#d9cbb6">Smart Products. Better Living.</p><p style="color:#a89c8c;font-size:12px">jyotishkundali.com</p></div>
    <div><h3 style="font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:#d9cbb6">Shop</h3><p><a href="/shop.html">All products</a></p></div>
    <div><h3 style="font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:#d9cbb6">Help</h3><p><a href="/legal.html">Shipping &amp; returns</a></p></div>
    <div><h3 style="font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:#d9cbb6">Note</h3><p style="color:#d9cbb6;font-size:.85rem;line-height:1.5">Business targets are objectives, not guarantees. Reviews and inventory are never fabricated.</p></div>
  </div>
  <div class="copy">© {year} VELORA · jyotishkundali.com</div>
</div></footer>
</body></html>
"""


def product_card(p: dict, i: int) -> str:
    save_pct = (
        round(((p["compare"] - p["price"]) / p["compare"]) * 100)
        if p["compare"] > p["price"]
        else 0
    )
    payload = escape(
        json.dumps(
            {
                "slug": p["slug"],
                "title": p["title"],
                "price": p["price"],
                "image": p["image"],
            }
        )
    )
    badge = ""
    if i < 3:
        badge = '<span class="badge">Best Seller</span>'
    elif i < 6:
        badge = '<span class="badge" style="background:var(--accent)">Trending</span>'
    save_html = (
        f'<span class="was">{inr(p["compare"])}</span><span class="save">{save_pct}% off</span>'
        if save_pct
        else ""
    )
    return f"""<article class="card">
    <a href="/products/{p['slug']}.html" class="img">
      {badge}
      <img src="{escape(p['image'])}" alt="{escape(p['title'])}" loading="lazy"/>
    </a>
    <div class="meta">
      <a class="title" href="/products/{p['slug']}.html">{escape(p['title'])}</a>
      <div class="price"><span class="now">{inr(p['price'])}</span>{save_html}</div>
      <button class="btn" style="margin-top:.75rem;width:100%;height:40px;font-size:.8rem" data-product="{payload}" onclick="addToCart(JSON.parse(this.dataset.product))">Add to Cart</button>
    </div>
  </article>"""


def main() -> None:
    products = run_sql()
    if not products:
        raise SystemExit("No published products found")

    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "products").mkdir(parents=True)
    (OUT / "assets").mkdir(parents=True)

    (OUT / "assets/products.json").write_text(json.dumps(products, indent=2))
    (OUT / "assets/site.css").write_text(CSS)
    (OUT / "assets/cart.js").write_text(CART_JS)
    (OUT / "assets/cart-page.js").write_text(CART_PAGE_JS)

    hero = products[0]["image"]
    home = layout(
        "VELORA — Smart Products. Better Living.",
        f"""
  <section class="hero">
    <img src="{escape(hero)}" alt="VELORA curated products"/>
    <div class="shade"></div>
    <div class="wrap content">
      <p class="brand display">VELORA</p>
      <p class="tag">Smart Products. Better Living.</p>
      <h1>Discover products that make life better.</h1>
      <p>Curated everyday products, smart finds and useful innovations delivered to your door.</p>
      <div class="cta-row">
        <a class="btn accent" href="/shop.html">Shop Trending Products</a>
        <a class="btn outline" href="/shop.html">Explore All Products</a>
      </div>
    </div>
  </section>
  <section class="section"><div class="wrap">
    <div class="section-head"><h2 class="display">Trending Products</h2><a href="/shop.html">View all</a></div>
    <div class="grid">{''.join(product_card(p, i) for i, p in enumerate(products[:8]))}</div>
  </div></section>
  <section class="section" style="border-block:1px solid var(--line);background:rgba(255,252,247,.45)"><div class="wrap">
    <div class="section-head"><h2 class="display">Best Sellers</h2><a href="/shop.html">View all</a></div>
    <div class="grid">{''.join(product_card(p, i) for i, p in enumerate(products[:4]))}</div>
  </div></section>
  <section class="section"><div class="wrap">
    <div class="section-head"><h2 class="display">New Arrivals</h2><a href="/shop.html">View all</a></div>
    <div class="grid">{''.join(product_card(p, i + 8) for i, p in enumerate(products[-8:]))}</div>
  </div></section>
  <section class="why" id="why"><div class="wrap" style="max-width:800px">
    <h2 class="display" style="font-size:2.4rem;margin:0">Why VELORA</h2>
    <p class="muted">We curate useful products, price for healthy contribution, and ship through verified logistics partners.</p>
    <div class="cols">
      <div><h3 class="display" style="font-size:1.3rem">Curated catalog</h3><p class="muted" style="font-size:.9rem">Quality scoring before publish — not a dump of random SKUs.</p></div>
      <div><h3 class="display" style="font-size:1.3rem">Transparent pricing</h3><p class="muted" style="font-size:.9rem">Landed-cost informed — no fake discounts.</p></div>
      <div><h3 class="display" style="font-size:1.3rem">India-ready checkout</h3><p class="muted" style="font-size:.9rem">Razorpay architecture ready when credentials are connected.</p></div>
    </div>
  </div></section>
""",
    )
    (OUT / "index.html").write_text(home)

    shop = layout(
        "Shop — VELORA",
        f"""<section class="section"><div class="wrap">
    <h1 class="display" style="font-size:2.5rem;margin:0">Shop</h1>
    <p class="muted">{len(products)} curated products</p>
    <div class="grid" style="margin-top:2rem">{''.join(product_card(p, i) for i, p in enumerate(products))}</div>
  </div></section>""",
    )
    (OUT / "shop.html").write_text(shop)

    for p in products:
        save_amt = p["compare"] - p["price"] if p["compare"] > p["price"] else 0
        payload = escape(
            json.dumps(
                {
                    "slug": p["slug"],
                    "title": p["title"],
                    "price": p["price"],
                    "image": p["image"],
                }
            )
        )
        stock_txt = (
            f"Low stock — {p['stock']} left"
            if 0 < p["stock"] <= 5
            else ("In stock" if p["stock"] > 0 else "Out of stock")
        )
        save_html = (
            f'<span class="was">{inr(p["compare"])}</span><span class="save">Save {inr(save_amt)}</span>'
            if save_amt
            else ""
        )
        page = layout(
            f"{p['title']} — VELORA",
            f"""<section class="wrap pdp">
      <div class="gallery"><img src="{escape(p['image'])}" alt="{escape(p['title'])}"/></div>
      <div>
        <p class="muted" style="font-size:.85rem">{escape(p['brand'])}</p>
        <h1 class="display" style="font-size:2.2rem;margin:.35rem 0 1rem">{escape(p['title'])}</h1>
        <div class="price" style="font-size:1.4rem"><span class="now">{inr(p['price'])}</span>{save_html}</div>
        <p class="muted" style="margin-top:1rem;line-height:1.6">{escape(p['desc'])}</p>
        <p class="muted" style="font-size:.85rem;margin-top:.75rem">{stock_txt}</p>
        <button class="btn accent" style="margin-top:1.5rem;width:100%;max-width:320px" data-product="{payload}" onclick="addToCart(JSON.parse(this.dataset.product))">Add to Cart</button>
        <p class="note">Shipping estimates shown at checkout when serviceability is configured.</p>
      </div>
    </section>""",
        )
        (OUT / "products" / f"{p['slug']}.html").write_text(page)

    cart = layout(
        "Cart — VELORA",
        """<section class="section"><div class="wrap" style="max-width:720px">
    <h1 class="display" style="font-size:2.5rem">Cart</h1>
    <div id="cart-root"></div>
    <div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap">
      <a class="btn ghost" href="/shop.html">Continue shopping</a>
      <button class="btn accent" id="checkout-btn" type="button">Checkout</button>
    </div>
    <p class="note">Live Razorpay checkout activates when payment credentials are configured.</p>
  </div></section>
  <script src="/assets/cart-page.js"></script>""",
    )
    (OUT / "cart.html").write_text(cart)

    legal = layout(
        "Legal — VELORA",
        """<section class="section"><div class="wrap" style="max-width:720px">
    <h1 class="display" style="font-size:2.5rem">Policies</h1>
    <h2 style="margin-top:2rem">Shipping</h2><p class="muted">Estimates come from logistics partners when configured. We do not invent delivery dates.</p>
    <h2 style="margin-top:1.5rem">Returns</h2><p class="muted">Eligible orders may be returned per product and supplier conditions.</p>
    <h2 style="margin-top:1.5rem">Privacy</h2><p class="muted">We store only required customer information for orders and support on jyotishkundali.com.</p>
  </div></section>""",
    )
    (OUT / "legal.html").write_text(legal)

    (OUT / ".htaccess").write_text(
        """DirectoryIndex index.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^shop/?$ /shop.html [L]
  RewriteRule ^cart/?$ /cart.html [L]
  RewriteRule ^legal/?$ /legal.html [L]
  RewriteRule ^products/([^/]+)/?$ /products/$1.html [L]
</IfModule>
"""
    )

    print(f"Built static VELORA site with {len(products)} products → {OUT}")


if __name__ == "__main__":
    main()

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
BUILD_VERSION = __import__("datetime").datetime.now().strftime("%Y%m%d%H%M")


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


CSS = r""":root{--ink:#0f1111;--muted:#565959;--accent:#007185;--cta:#ffa41c;--cta-hover:#fa8900;--line:rgba(15,17,17,.15);--bg:#eaeded;--card:#fff;--header:#131921;--header2:#232f3e}
*{box-sizing:border-box}body{margin:0;font-family:Arial,Helvetica,sans-serif;color:var(--ink);background:var(--bg);min-height:100vh;display:flex;flex-direction:column}
a{color:inherit;text-decoration:none}.muted{color:var(--muted)}
.wrap{width:100%;max-width:none;margin:0 auto;padding:0 .5rem}@media(min-width:640px){.wrap{padding:0 .75rem}}@media(min-width:1024px){.wrap{padding:0 1rem}}
.announce{background:var(--header2);color:#fff;font-size:12px;text-align:center;padding:.45rem .75rem}
header.site{position:sticky;top:0;z-index:40;background:var(--header);color:#fff}
.header-inner{display:flex;flex-direction:column}
.nav-top{display:flex;align-items:center;justify-content:space-between;gap:.5rem;height:48px}@media(min-width:768px){.nav-top{height:56px}}
.logo{font-size:1.15rem;font-weight:700;white-space:nowrap;color:#fff}@media(min-width:768px){.logo{font-size:1.25rem}}
.nav-search{display:flex;width:100%;padding:0 0 .5rem}@media(min-width:768px){.header-inner{display:grid;grid-template-columns:auto 1fr auto;grid-template-rows:auto auto;align-items:center;column-gap:.75rem}.nav-top{display:contents}.logo{grid-column:1;grid-row:1}.nav-search{grid-column:2;grid-row:1;padding:0}.nav-actions{grid-column:3;grid-row:1}.subnav{grid-column:1/-1;grid-row:2}}
.nav-search input{flex:1;min-width:0;height:40px;border:0;border-radius:4px 0 0 4px;padding:0 .75rem;font:inherit;background:#fff;color:var(--ink)}
.nav-search button{width:44px;height:40px;border:0;border-radius:0 4px 4px 0;background:var(--cta);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1rem}
.nav-actions{display:flex;align-items:center;gap:.25rem;color:#fff;font-size:.85rem}
.nav-actions a{padding:.35rem .5rem;white-space:nowrap;color:#fff}
.subnav{display:flex;gap:.85rem;overflow-x:auto;padding:.55rem 0;font-size:.82rem;background:var(--header2);color:#fff;margin:0 -.5rem;padding-left:.5rem;padding-right:.5rem;-webkit-overflow-scrolling:touch;-ms-overflow-style:none;scrollbar-width:none}.subnav::-webkit-scrollbar{display:none}@media(min-width:768px){.subnav{margin:0;padding-left:0;padding-right:0}}
.subnav a{white-space:nowrap;color:#fff;flex-shrink:0}
.btn{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 1rem;border-radius:4px;border:1px solid transparent;font:inherit;font-weight:500;font-size:.9rem;cursor:pointer;background:var(--ink);color:#fff}
.btn.cta{background:var(--cta);color:var(--ink)}.btn.buy{background:#ffd814;color:var(--ink)}.btn.ghost{background:#fff;border-color:var(--line);color:var(--ink)}
.hero{position:relative;aspect-ratio:4/3;min-height:200px;color:#fff;overflow:hidden}@media(min-width:768px){.hero{aspect-ratio:21/9;min-height:280px}}
.hero>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.hero .shade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.72),rgba(0,0,0,.35),transparent)}
.hero .content{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:1rem}
.hero .tag{font-size:.75rem;color:var(--cta);font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin:0}
.hero h1{font-size:clamp(1.35rem,5vw,2.5rem);margin:.5rem 0;font-weight:700;max-width:18rem;line-height:1.15}@media(min-width:768px){.hero h1{max-width:32rem;font-size:clamp(1.8rem,4vw,3rem)}}
.hero p{color:#e5e5e5;font-size:.875rem;max-width:24rem;line-height:1.5;margin:0}
.cta-row{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
.panel{background:var(--card);border:1px solid var(--line);border-radius:4px;padding:.875rem;margin-bottom:.75rem}@media(min-width:768px){.panel{padding:1rem 1.25rem}}
.section{padding:.75rem 0 1rem}.section-head{display:flex;justify-content:space-between;align-items:end;gap:1rem;margin-bottom:.75rem;border-bottom:1px solid var(--line);padding-bottom:.5rem}
.section-head h2{font-size:1.1rem;margin:0;font-weight:700}@media(min-width:768px){.section-head h2{font-size:1.35rem}}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.75rem}@media(min-width:640px){.grid{grid-template-columns:repeat(3,1fr);gap:1rem}}@media(min-width:1024px){.grid{grid-template-columns:repeat(4,1fr)}}@media(min-width:1280px){.grid{grid-template-columns:repeat(5,1fr)}}@media(min-width:1536px){.grid{grid-template-columns:repeat(6,1fr)}}
.card{background:#fff;border:1px solid var(--line);border-radius:4px;padding:.5rem;display:flex;flex-direction:column;height:100%}
.card .img{aspect-ratio:1;background:#fff;overflow:hidden;position:relative;display:block}
.card .img img{width:100%;height:100%;object-fit:contain;padding:.25rem}
.card .meta{padding-top:.5rem;display:flex;flex-direction:column;flex:1}
.card .title{font-size:.78rem;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.2em}@media(min-width:640px){.card .title{font-size:.85rem}}
.price{margin-top:.35rem;display:flex;gap:.35rem;align-items:baseline;flex-wrap:wrap}
.price .now{font-weight:600;font-size:.95rem}.price .was{color:var(--muted);text-decoration:line-through;font-size:.75rem}.price .save{color:#c45500;font-size:.7rem}
.badge{position:absolute;left:.35rem;top:.35rem;background:var(--ink);color:#fff;font-size:9px;padding:.15rem .35rem;border-radius:2px}
.why{padding:1rem 0}.why .cols{display:grid;gap:.75rem;margin-top:1rem}@media(min-width:768px){.why .cols{grid-template-columns:repeat(3,1fr)}}
footer.site{background:var(--header2);color:#fff;margin-top:auto}
footer .back{background:var(--header);text-align:center;padding:1rem;font-size:.875rem}
footer .cols{display:grid;gap:1.5rem;padding:2rem 0}@media(min-width:768px){footer .cols{grid-template-columns:repeat(4,1fr)}}
footer a{color:#d5dbdb;font-size:.875rem}
footer .copy{border-top:1px solid rgba(255,255,255,.1);padding:1rem;text-align:center;font-size:12px;color:#999}
.pdp-breadcrumb{font-size:.75rem;color:var(--muted);padding:.35rem .5rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:var(--bg)}
.pdp-mobile-image{background:#fff;border-bottom:1px solid var(--line)}.pdp-mobile-image .gallery{height:38vh;max-height:320px;min-height:180px;display:flex;align-items:center;justify-content:center}.pdp-mobile-image .gallery img{max-width:100%;max-height:100%;object-fit:contain;padding:.5rem}
.pdp-grid{display:grid;gap:.75rem;padding:0 0 1.5rem}@media(min-width:1024px){.pdp-grid{grid-template-columns:80px minmax(0,1fr) 360px;gap:1rem;padding:1rem 0 2rem}}
.pdp-gallery-desktop{display:none}@media(min-width:1024px){.pdp-gallery-desktop{display:block}.pdp-mobile-image{display:none}}
.pdp-gallery-desktop .gallery{aspect-ratio:1;background:#fff;border:1px solid var(--line);border-radius:4px;padding:1rem}.pdp-gallery-desktop .gallery img{width:100%;height:100%;object-fit:contain}
.buybox{background:#fff;border:1px solid var(--line);border-radius:4px;padding:1rem}
.buybox h1{font-size:1.15rem;font-weight:400;line-height:1.35;margin:0}@media(min-width:1024px){.buybox h1{font-size:1.35rem}}
.buybox .price-big{font-size:1.75rem;margin:.5rem 0}.buybox .stock{font-size:.875rem;font-weight:600;margin:.75rem 0}.buybox .stock.ok{color:#007600}.buybox .stock.low{color:#c45500}
.buybox .actions{display:grid;gap:.5rem;margin-top:1rem}.buybox .actions .btn{width:100%}
.pdp-details{display:grid;gap:.75rem}.note{font-size:.8rem;color:var(--muted);margin-top:1rem}
.cart-line{display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid var(--line)}
.cart-line img{width:72px;height:72px;object-fit:contain;background:#fff;border:1px solid var(--line)}
.bottom-nav{position:fixed;inset:auto 0 0 0;display:flex;background:#fff;border-top:1px solid var(--line);z-index:30}@media(min-width:768px){.bottom-nav{display:none}}
.bottom-nav a{flex:1;text-align:center;padding:.55rem 0;font-size:11px;color:var(--ink)}
body.has-bottom-nav{padding-bottom:3.5rem}@media(min-width:768px){body.has-bottom-nav{padding-bottom:0}}
.toast{position:fixed;bottom:4.5rem;left:50%;transform:translateX(-50%);background:var(--header);color:#fff;padding:.7rem 1rem;border-radius:999px;font-size:.85rem;opacity:0;pointer-events:none;transition:opacity .25s;z-index:50}@media(min-width:768px){.toast{bottom:1.25rem}}
.toast.show{opacity:1}
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


def layout(title: str, body: str, version: str = BUILD_VERSION) -> str:
    year = __import__("datetime").datetime.now().year
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
<meta http-equiv="Pragma" content="no-cache"/>
<meta http-equiv="Expires" content="0"/>
<title>{escape(title)}</title>
<meta name="description" content="VELORA — Smart Products. Better Living. Curated everyday products delivered across India."/>
<link rel="canonical" href="https://jyotishkundali.com/"/>
<meta property="og:title" content="VELORA — Smart Products. Better Living."/>
<meta property="og:url" content="https://jyotishkundali.com/"/>
<style>body{{margin:0;font-family:Arial,Helvetica,sans-serif;background:#eaeded;color:#0f1111}}header.site{{background:#131921;color:#fff}}.announce{{background:#232f3e;color:#fff;font-size:12px;text-align:center;padding:.45rem .75rem}}</style>
<link rel="stylesheet" href="/assets/site.css?v={version}"/>
<script defer src="/assets/cart.js?v={version}"></script>
</head>
<body class="has-bottom-nav">
<div class="announce">Free shipping on prepaid orders · Easy returns · Ships across India where serviceable</div>
<header class="site"><div class="wrap header-inner">
  <div class="nav-top">
    <a class="logo" href="/">VELORA</a>
    <div class="nav-actions">
      <a href="/cart.html">Cart (<span data-cart-count>0</span>)</a>
    </div>
  </div>
  <form class="nav-search" action="/shop.html" method="get"><input name="q" placeholder="Search VELORA" aria-label="Search products"/><button type="submit" aria-label="Search">🔍</button></form>
  <nav class="subnav" aria-label="Categories">
    <a href="/shop.html">Shop All</a>
    <a href="/shop.html">Trending</a>
    <a href="/shop.html">Best Sellers</a>
    <a href="/shop.html">New Arrivals</a>
  </nav>
</div></header>
{body}
<nav class="bottom-nav" aria-label="Bottom navigation"><a href="/">Home</a><a href="/shop.html">Shop</a><a href="/cart.html">Cart</a><a href="/legal.html">Help</a></nav>
<footer class="site"><div class="back"><a href="#">Back to top</a></div><div class="wrap">
  <div class="cols">
    <div><strong>VELORA</strong><p style="color:#d5dbdb;font-size:.875rem;margin:.5rem 0 0">Smart Products. Better Living.</p></div>
    <div><strong>Shop</strong><p><a href="/shop.html">All products</a></p></div>
    <div><strong>Help</strong><p><a href="/legal.html">Shipping &amp; returns</a></p></div>
    <div><strong>Note</strong><p style="color:#d5dbdb;font-size:.85rem;line-height:1.5">Business targets are objectives, not guarantees.</p></div>
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
      <button class="btn cta" style="margin-top:auto;padding-top:.5rem;height:36px;font-size:.78rem" data-product="{payload}" onclick="addToCart(JSON.parse(this.dataset.product))">Add to Cart</button>
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
      <p class="tag">Smart Products. Better Living.</p>
      <h1>Discover products that make life better</h1>
      <p>Curated everyday products, smart finds and useful innovations delivered to your door.</p>
      <div class="cta-row">
        <a class="btn cta" href="/shop.html">Shop Trending</a>
        <a class="btn ghost" href="/shop.html" style="background:rgba(255,255,255,.12);color:#fff;border-color:rgba(255,255,255,.4)">Explore All</a>
      </div>
    </div>
  </section>
  <section class="section"><div class="wrap"><div class="panel">
    <div class="section-head"><h2>Trending Products</h2><a href="/shop.html" style="color:var(--accent);font-size:.875rem">See all</a></div>
    <div class="grid">{''.join(product_card(p, i) for i, p in enumerate(products[:8]))}</div>
  </div></div></section>
  <section class="section"><div class="wrap"><div class="panel">
    <div class="section-head"><h2>Best Sellers</h2><a href="/shop.html" style="color:var(--accent);font-size:.875rem">See all</a></div>
    <div class="grid">{''.join(product_card(p, i) for i, p in enumerate(products[:4]))}</div>
  </div></div></section>
  <section class="section"><div class="wrap"><div class="panel">
    <div class="section-head"><h2>New Arrivals</h2><a href="/shop.html" style="color:var(--accent);font-size:.875rem">See all</a></div>
    <div class="grid">{''.join(product_card(p, i + 8) for i, p in enumerate(products[-8:]))}</div>
  </div></div></section>
  <section class="why" id="why"><div class="wrap"><div class="panel">
    <h2 style="font-size:1.25rem;margin:0">Why VELORA</h2>
    <p class="muted" style="margin-top:.5rem">We curate useful products, price for healthy contribution, and ship through verified logistics partners.</p>
    <div class="cols">
      <div><strong>Curated catalog</strong><p class="muted" style="font-size:.875rem;margin-top:.35rem">Quality scoring before publish — not a dump of random SKUs.</p></div>
      <div><strong>Transparent pricing</strong><p class="muted" style="font-size:.875rem;margin-top:.35rem">Landed-cost informed — no fake discounts.</p></div>
      <div><strong>India-ready checkout</strong><p class="muted" style="font-size:.875rem;margin-top:.35rem">Razorpay architecture ready when credentials are connected.</p></div>
    </div>
  </div></div></section>
""",
    )
    (OUT / "index.html").write_text(home)

    shop = layout(
        "Shop — VELORA",
        f"""<section class="section"><div class="wrap"><div class="panel">
    <h1 style="font-size:1.5rem;margin:0">Shop</h1>
    <p class="muted" style="margin-top:.35rem">{len(products)} products</p>
    <div class="grid" style="margin-top:1rem">{''.join(product_card(p, i) for i, p in enumerate(products))}</div>
  </div></div></section>""",
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
            f'<p style="color:#c45500;font-size:.8rem;margin:0 0 .25rem">-{round((save_amt/p["compare"])*100)}% · Save {inr(save_amt)}</p><span class="was" style="font-size:.875rem">M.R.P.: {inr(p["compare"])}</span>'
            if save_amt
            else ""
        )
        stock_class = "low" if 0 < p["stock"] <= 5 else ("ok" if p["stock"] > 0 else "low")
        page = layout(
            f"{p['title']} — VELORA",
            f"""<div class="wrap pdp-breadcrumb"><a href="/">Home</a> › <a href="/shop.html">Shop</a> › {escape(p['title'][:40])}{'…' if len(p['title'])>40 else ''}</div>
      <div class="pdp-mobile-image"><div class="gallery"><img src="{escape(p['image'])}" alt="{escape(p['title'])}"/></div></div>
      <section class="wrap pdp-grid">
      <div class="pdp-gallery-desktop"><div class="gallery"><img src="{escape(p['image'])}" alt="{escape(p['title'])}"/></div></div>
      <div class="buybox">
        <h1>{escape(p['title'])}</h1>
        <p class="muted" style="font-size:.875rem;margin:.35rem 0 0">Brand: {escape(p['brand'])}</p>
        <div style="margin-top:1rem">{save_html}<div class="price-big">{inr(p['price'])}</div><p class="muted" style="font-size:.75rem;margin:.25rem 0 0">Inclusive of all taxes</p></div>
        <p class="stock {stock_class}">{stock_txt}</p>
        <p class="muted" style="font-size:.875rem;line-height:1.55;margin-top:.75rem">{escape(p['desc'])}</p>
        <div class="actions">
          <button class="btn cta" data-product="{payload}" onclick="addToCart(JSON.parse(this.dataset.product))">Add to Cart</button>
          <a class="btn buy" href="/cart.html">Buy Now</a>
        </div>
        <p class="note">Shipping estimates shown at checkout when serviceability is configured.</p>
      </div>
      <div class="pdp-details">
        <div class="panel"><strong>About this item</strong><p class="muted" style="font-size:.875rem;line-height:1.6;margin:.75rem 0 0">{escape(p['desc'])}</p></div>
        <div class="panel"><strong>Shipping &amp; returns</strong><p class="muted" style="font-size:.875rem;margin:.75rem 0 0">Estimates shown at checkout based on PIN code serviceability.</p></div>
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

<IfModule mod_headers.c>
  <FilesMatch "\\.(html)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
  </FilesMatch>
  <FilesMatch "\\.(css|js)$">
    Header set Cache-Control "public, max-age=604800"
  </FilesMatch>
</IfModule>

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

    print(f"Built static VELORA site with {len(products)} products → {OUT} (v{BUILD_VERSION})")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Build a Hostinger-ready static JyotishKundali site (replaces VELORA on domain)."""

from __future__ import annotations

import json
import re
import shutil
from datetime import datetime
from html import escape
from pathlib import Path

OUT = Path("/workspace/deploy/jyotishkundali-static")
BUILD_VERSION = datetime.now().strftime("%Y%m%d%H%M")
SEED = Path("/workspace/prisma/seed-data.ts")


def parse_products() -> list[dict]:
    text = SEED.read_text()
    membership_idx = text.find("export const MEMBERSHIP_PRODUCT")
    start = text.find("export const PRODUCT_SEEDS")
    product_block = text[start:membership_idx if membership_idx > 0 else None]
    pattern = re.compile(
        r'name:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*categorySlug:\s*"([^"]+)",\s*shortDescription:\s*"([^"]+)"',
        re.M,
    )
    products = []
    for i, m in enumerate(pattern.finditer(product_block), 1):
        products.append(
            {
                "name": m.group(1),
                "slug": m.group(2),
                "category": m.group(3),
                "desc": m.group(4),
                "price": 499,
                "sort": i,
            }
        )
    if len(products) < 20:
        raise SystemExit(f"Expected 20+ unique products, found {len(products)}")
    return products


def parse_categories() -> list[dict]:
    text = SEED.read_text()
    # CATEGORY_SEEDS
    block = text.split("export const CATEGORY_SEEDS")[1].split("export const PRODUCT_SEEDS")[0]
    cats = []
    for m in re.finditer(
        r'name:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*description:\s*"([^"]+)"',
        block,
    ):
        cats.append({"name": m.group(1), "slug": m.group(2), "desc": m.group(3)})
    return cats


HOME_SERVICE_CARDS = [
    ("Kundali & Birth Charts", "Janam Kundali, houses, dasha timelines, and natal deep-dives.", "☉", "violet", "/services.html?c=kundali"),
    ("Marriage & Matching", "Guna Milan, love chemistry, marriage timing, and couple synastry.", "♥", "pink", "/services.html?c=marriage"),
    ("Career & Profession", "Career path, timing windows, business themes, and abroad-work motifs.", "↑", "blue", "/services.html?c=career"),
    ("Wealth & Family", "Prosperity themes, property symbolism, education, and family dynamics.", "₹", "amber", "/services.html?c=wealth"),
    ("Dosha & Planets", "Dosha scans, Manglik, Rahu-Ketu, Sade Sati, and Saturn lessons.", "△", "orange", "/services.html?c=dosha"),
    ("Face Self-Discovery", "AI face reading and strengths maps for reflective self-awareness.", "◉", "fuchsia", "/services.html?c=self-discovery"),
    ("Numerology", "Complete number profiles, name, mobile, and personal year forecasts.", "8", "indigo", "/services.html?c=numerology"),
    ("Horoscopes & Transits", "Year-ahead forecasts, gochar reports, and monthly personalised guidance.", "☾", "sky", "/services.html?c=daily-astrology"),
]

MEMBERSHIP_FEATURES = [
    "All Kundali & birth chart reports",
    "Marriage & compatibility analysis",
    "Career & wealth reports",
    "Dosha analysis & remedies guidance",
    "AI Face Self-Discovery",
    "Complete numerology suite",
    "Daily / weekly / monthly horoscope",
    "AI astrology assistant",
    "Family member profiles",
    "Personalized dashboard & support",
]

CSS = r"""@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Outfit:wght@300;400;500;600&display=swap');
:root{--navy:#050814;--midnight:#0c1630;--deep:#121f3d;--gold:#f5c542;--gold-soft:#ffd76a;--gold-dark:#c9a227;--ivory:#f7f3ea;--ink:#0b1224;--muted:#64748b;--line:rgba(11,27,58,.1);--bg:#f4f5f7}
*{box-sizing:border-box}body{margin:0;font-family:Outfit,system-ui,sans-serif;color:var(--ink);background:var(--bg);min-height:100vh;display:flex;flex-direction:column}
.display{font-family:"Cormorant Garamond",Georgia,serif;letter-spacing:.01em}a{color:inherit;text-decoration:none}.muted{color:var(--muted)}
.wrap{width:100%;max-width:72rem;margin:0 auto;padding:0 1rem}@media(min-width:640px){.wrap{padding:0 1.5rem}}
.announce{background:var(--midnight);color:var(--ivory);font-size:11px;text-align:center;padding:.45rem 1rem;letter-spacing:.02em}
header.site{position:sticky;top:0;z-index:50;background:rgba(5,8,20,.95);color:#fff;border-bottom:1px solid rgba(255,255,255,.05);backdrop-filter:blur(10px)}
.nav{display:flex;align-items:center;justify-content:space-between;height:64px;gap:.75rem}
.logo{display:flex;align-items:center;gap:.5rem;font-family:"Cormorant Garamond",serif;font-size:1.25rem;font-weight:600;letter-spacing:.03em;color:#fff}
.logo-mark{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:rgba(245,197,66,.15);color:var(--gold);font-size:.85rem}
.nav-links{display:none;gap:1.25rem;font-size:.82rem}@media(min-width:900px){.nav-links{display:flex}}
.nav-links a{color:rgba(255,255,255,.8);transition:color .2s}.nav-links a:hover{color:var(--gold)}
.nav-actions{display:flex;align-items:center;gap:.5rem}
.nav-search{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;color:rgba(255,255,255,.8)}.nav-search:hover{background:rgba(255,255,255,.1)}
.btn{display:inline-flex;align-items:center;justify-content:center;height:44px;padding:0 1.15rem;border-radius:999px;border:1px solid transparent;font:inherit;font-weight:600;font-size:.875rem;cursor:pointer;transition:background .2s,transform .15s}
.btn.gold{background:var(--gold);color:var(--navy)}.btn.gold:hover{background:var(--gold-soft);transform:translateY(-1px)}
.btn.login-outline{background:transparent;border-color:rgba(255,255,255,.25);color:#fff;height:36px;padding:0 1rem;font-size:.82rem;font-weight:500}
.btn.login-outline:hover{background:rgba(255,255,255,.1)}
.btn.signup{background:var(--gold);color:var(--navy);height:36px;padding:0 1rem;font-size:.82rem}
.btn.ghost{background:transparent;border-color:rgba(255,255,255,.35);color:#fff}
.btn.outline{background:transparent;border-color:var(--line);color:var(--ink)}
.btn.sm{height:36px;padding:0 .9rem;font-size:.8rem}
.hero-astro{position:relative;overflow:hidden;color:var(--ivory);background:radial-gradient(ellipse 80% 60% at 70% 55%,rgba(245,197,66,.18),transparent 55%),radial-gradient(ellipse 50% 40% at 30% 70%,rgba(139,92,246,.2),transparent 50%),linear-gradient(180deg,#050814 0%,#0c1630 45%,#121f3d 100%)}
.hero-astro::before{content:"";position:absolute;inset:0;background-image:radial-gradient(1.5px 1.5px at 10% 20%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 30% 40%,rgba(255,255,255,.5),transparent),radial-gradient(1.5px 1.5px at 50% 15%,rgba(255,255,255,.6),transparent),radial-gradient(1px 1px at 70% 35%,rgba(255,255,255,.45),transparent),radial-gradient(1.5px 1.5px at 85% 25%,rgba(255,255,255,.55),transparent),radial-gradient(1px 1px at 20% 70%,rgba(255,255,255,.4),transparent),radial-gradient(1px 1px at 60% 80%,rgba(255,255,255,.35),transparent),radial-gradient(1.5px 1.5px at 90% 65%,rgba(255,255,255,.5),transparent);opacity:.9;pointer-events:none}
.hero-inner{position:relative;z-index:1;padding:3.5rem 0 4rem}@media(min-width:768px){.hero-inner{padding:5rem 0 5.5rem}}
.hero-accent{display:none;text-align:right;font-style:italic;font-size:.875rem;color:rgba(245,197,66,.9);margin-bottom:1rem}@media(min-width:1024px){.hero-accent{display:block}}
.hero-astro h1{font-family:"Cormorant Garamond",serif;font-size:clamp(2rem,5.5vw,3.75rem);font-weight:600;line-height:1.15;margin:0;max-width:20ch;color:#fff}
.hero-services{margin-top:1.25rem;font-size:.875rem;color:rgba(255,255,255,.75)}
.hero-chips{display:flex;flex-wrap:wrap;gap:.75rem 1.25rem;margin-top:1.5rem;font-size:.78rem;color:rgba(255,255,255,.7)}@media(min-width:640px){.hero-chips{font-size:.85rem}}
.hero-chip{display:inline-flex;align-items:center;gap:.4rem}.hero-chip .ic{color:var(--gold)}
.hero-form{display:flex;flex-direction:column;margin-top:2rem;max-width:36rem;background:#fff;border-radius:999px;padding:.35rem;box-shadow:0 20px 50px rgba(5,8,20,.35);overflow:hidden}@media(min-width:640px){.hero-form{flex-direction:row;align-items:center}}
.hero-form input{flex:1;height:44px;border:0;background:transparent;padding:0 1.25rem;font:inherit;font-size:.875rem;color:var(--ink);outline:none}
.hero-form input::placeholder{color:var(--muted)}
.hero-form .btn.gold{height:44px;padding:0 1.5rem;white-space:nowrap;border-radius:999px}
.trust-ribbon{background:#fff;border-bottom:1px solid var(--line)}
.trust-ribbon .wrap{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;padding:1.25rem 1rem}@media(min-width:640px){.trust-ribbon .wrap{grid-template-columns:repeat(3,1fr)}}@media(min-width:1024px){.trust-ribbon .wrap{grid-template-columns:repeat(5,1fr)}}
.trust-item{display:flex;align-items:center;gap:.65rem;font-size:.82rem;color:var(--ink)}
.trust-icon{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#f8fafc;font-size:1rem;flex-shrink:0}
.section{padding:3.5rem 0}.section-head{display:flex;justify-content:space-between;align-items:end;gap:1rem;margin-bottom:1.5rem}
.section-head h2{font-family:"Cormorant Garamond",serif;font-size:clamp(1.75rem,3vw,2.5rem);font-weight:600;margin:0}
.section-intro{text-align:center;max-width:36rem;margin:0 auto}.section-intro h2{margin-bottom:.5rem}.section-intro p{font-size:.875rem;color:var(--muted)}
.section-muted{background:var(--bg)}.section-white{background:#fff}
.service-grid{display:grid;grid-template-columns:1fr;gap:1rem;margin-top:2.5rem}@media(min-width:640px){.service-grid{grid-template-columns:repeat(2,1fr)}}@media(min-width:1024px){.service-grid{grid-template-columns:repeat(5,1fr)}}
.svc-card{display:flex;flex-direction:column;background:#fff;border:1px solid #fff;border-radius:16px;padding:1.25rem;box-shadow:0 1px 3px rgba(11,27,58,.06);transition:transform .2s,box-shadow .2s}
.svc-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(11,27,58,.08)}
.svc-icon{display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:50%;font-size:1.1rem;font-weight:600;margin-bottom:1rem}
.svc-icon.violet{background:#ede9fe;color:#7c3aed}.svc-icon.pink{background:#fce7f3;color:#db2777}.svc-icon.blue{background:#dbeafe;color:#2563eb}
.svc-icon.amber{background:#fef3c7;color:#b45309}.svc-icon.orange{background:#ffedd5;color:#ea580c}.svc-icon.fuchsia{background:#fae8ff;color:#c026d3}
.svc-icon.indigo{background:#e0e7ff;color:#4f46e5}.svc-icon.sky{background:#e0f2fe;color:#0284c7}.svc-icon.rose{background:#ffe4e6;color:#e11d48}
.svc-icon.emerald{background:#d1fae5;color:#059669}
.svc-card h3{font-size:1rem;font-weight:600;margin:0;line-height:1.3}
.svc-card p{flex:1;margin:.5rem 0 0;font-size:.82rem;line-height:1.55;color:var(--muted)}
.svc-foot{display:flex;align-items:center;justify-content:space-between;margin-top:1rem}
.svc-foot .price{font-size:.875rem;font-weight:700}
.svc-arrow{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#f1f5f9;font-size:.9rem;transition:background .2s}
.svc-card:hover .svc-arrow{background:var(--gold)}
.premium-banner{position:relative;overflow:hidden;border-radius:24px;padding:1.5rem;color:#fff;background:linear-gradient(135deg,#0a1428 0%,#152447 50%,#0f1c38 100%);border:1px solid rgba(245,197,66,.45);box-shadow:0 0 0 1px rgba(245,197,66,.15),0 20px 60px rgba(5,8,20,.45)}@media(min-width:640px){.premium-banner{padding:2.5rem}}
.premium-badge{display:inline-flex;align-items:center;gap:.5rem;margin-bottom:.75rem}
.premium-badge .tag{background:var(--gold);color:var(--navy);font-size:.7rem;font-weight:600;padding:.2rem .75rem;border-radius:999px}
.premium-banner h2{font-family:"Cormorant Garamond",serif;font-size:clamp(1.75rem,3vw,2.25rem);font-weight:600;margin:0;line-height:1.2}
.premium-banner .sub{margin-top:.75rem;color:rgba(255,255,255,.75);font-size:.9rem}
.premium-banner .sub strong{color:var(--gold)}
.premium-features{display:grid;gap:.5rem;margin-top:1.5rem}@media(min-width:640px){.premium-features{grid-template-columns:repeat(2,1fr)}}
.premium-features li{display:flex;align-items:flex-start;gap:.5rem;font-size:.82rem;color:rgba(255,255,255,.85);list-style:none}
.premium-features .ck{color:var(--gold);flex-shrink:0}
.grid{display:grid;grid-template-columns:1fr;gap:1rem}@media(min-width:640px){.grid{grid-template-columns:repeat(2,1fr)}}@media(min-width:960px){.grid{grid-template-columns:repeat(3,1fr)}}
.card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:1.25rem;display:flex;flex-direction:column;min-height:180px;box-shadow:0 8px 24px rgba(11,27,58,.04)}
.card .cat{font-size:.7rem;text-transform:uppercase;letter-spacing:.12em;color:var(--gold-dark)}
.card .title{font-family:"Cormorant Garamond",serif;font-size:1.25rem;margin:.4rem 0;line-height:1.25}
.card .price{font-weight:600;margin-top:auto;padding-top:1rem}
.panel{background:#fff;border:1px solid var(--line);border-radius:16px;padding:1.25rem;margin-bottom:1rem}
.pdp{display:grid;gap:1.5rem;padding:2rem 0}@media(min-width:900px){.pdp{grid-template-columns:1.2fr .8fr}}
.buybox{background:#fff;border:1px solid var(--line);border-radius:16px;padding:1.25rem;height:fit-content}
.buybox .price-big{font-size:1.75rem;font-weight:600;margin:.5rem 0}
.disclaimer{font-size:.75rem;color:var(--muted);line-height:1.5;margin-top:1rem}
.how-grid{display:grid;gap:1.5rem;margin-top:2.5rem}@media(min-width:640px){.how-grid{grid-template-columns:repeat(2,1fr)}}@media(min-width:1024px){.how-grid{grid-template-columns:repeat(4,1fr)}}
.how-step{text-align:center;position:relative}
.how-icon{position:relative;display:flex;align-items:center;justify-content:center;width:64px;height:64px;margin:0 auto 1rem;border-radius:50%;background:#ede9fe;color:#7c3aed;font-size:1.5rem}
.how-num{position:absolute;top:-4px;right:-4px;display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:var(--gold);color:var(--navy);font-size:.7rem;font-weight:700}
.how-step h3{font-size:.95rem;font-weight:600;margin:0}
.how-step p{margin:.35rem 0 0;font-size:.82rem;color:var(--muted);line-height:1.5}
.why-grid{display:grid;gap:2.5rem}@media(min-width:1024px){.why-grid{grid-template-columns:1fr 1fr;align-items:center}}
.why-icons{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-top:2rem}@media(min-width:640px){.why-icons{grid-template-columns:repeat(3,1fr)}}
.why-icon-card{background:#fff;border-radius:16px;padding:1rem;text-align:center;box-shadow:0 1px 3px rgba(11,27,58,.06)}
.why-icon-card .ic{font-size:1.5rem;color:#7c3aed;margin-bottom:.5rem}
.why-icon-card p{font-size:.75rem;font-weight:500;line-height:1.4;margin:0}
.testimonial{background:#fff;border-radius:24px;padding:1.5rem;box-shadow:0 4px 20px rgba(11,27,58,.08)}@media(min-width:640px){.testimonial{padding:2rem}}
.testimonial .label{font-size:.7rem;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}
.testimonial .stars{color:var(--gold);margin-top:.75rem;font-size:.9rem;letter-spacing:.15em}
.testimonial blockquote{margin:1rem 0 0;font-family:"Cormorant Garamond",serif;font-size:1.25rem;line-height:1.5;color:var(--ink)}
.testimonial .author{display:flex;align-items:center;gap:.75rem;margin-top:1.5rem}
.testimonial .avatar{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:50%;background:#ede9fe;color:#7c3aed;font-weight:600;font-size:.85rem}
.testimonial .author p{margin:0;font-size:.82rem}.testimonial .author .sub{font-size:.75rem;color:var(--muted);font-weight:400}
.cta-final{position:relative;padding:4rem 0;text-align:center;color:#fff;background:linear-gradient(180deg,rgba(5,8,20,.55),rgba(5,8,20,.85)),linear-gradient(145deg,#0c1630,#121f3d 60%,#1a2d4d)}
.cta-final .spark{font-size:2rem;color:var(--gold);margin-bottom:1rem}
.cta-final h2{font-family:"Cormorant Garamond",serif;font-size:clamp(1.75rem,4vw,3rem);font-weight:600;margin:0;line-height:1.2}
.cta-final p{margin:1rem auto 0;max-width:32rem;font-size:.875rem;color:rgba(255,255,255,.75)}
.cta-final .cta-row{display:flex;flex-wrap:wrap;justify-content:center;gap:.75rem;margin-top:2rem}
footer.site{background:var(--navy);color:var(--ivory);margin-top:auto;padding:2.5rem 0 1.5rem}
footer a{color:rgba(255,255,255,.7);font-size:.875rem}footer a:hover{color:var(--gold)}
footer .cols{display:grid;gap:1.5rem}@media(min-width:768px){footer .cols{grid-template-columns:2fr 1fr 1fr 1fr}}
footer .tagline{color:rgba(255,255,255,.65);font-size:.875rem;margin-top:.5rem}
footer .copy{border-top:1px solid rgba(255,255,255,.1);margin-top:2rem;padding-top:1rem;display:flex;flex-direction:column;gap:.5rem;font-size:12px;color:rgba(255,255,255,.5)}@media(min-width:640px){footer .copy{flex-direction:row;justify-content:space-between;align-items:center}}
footer .copy .motto{color:rgba(245,197,66,.8)}
.bottom-nav{position:fixed;inset:auto 0 0 0;display:flex;background:#fff;border-top:1px solid var(--line);z-index:40}@media(min-width:768px){.bottom-nav{display:none}}
.bottom-nav a{flex:1;text-align:center;padding:.65rem 0;font-size:11px;color:var(--ink)}
body.has-bottom{padding-bottom:3.75rem}@media(min-width:768px){body.has-bottom{padding-bottom:0}}
.steps{display:grid;gap:1rem}@media(min-width:768px){.steps{grid-template-columns:repeat(4,1fr)}}
.steps .step{background:#fff;border:1px solid var(--line);border-radius:14px;padding:1rem}
.steps .n{color:var(--gold-dark);font-weight:600;font-size:.8rem}
.page-hero{position:relative;overflow:hidden;color:var(--ivory);background:radial-gradient(ellipse 80% 60% at 70% 55%,rgba(245,197,66,.18),transparent 55%),radial-gradient(ellipse 50% 40% at 30% 70%,rgba(139,92,246,.2),transparent 50%),linear-gradient(180deg,#050814 0%,#0c1630 45%,#121f3d 100%)}
.page-hero::before{content:"";position:absolute;inset:0;background-image:radial-gradient(1.5px 1.5px at 10% 20%,rgba(255,255,255,.7),transparent),radial-gradient(1px 1px at 70% 35%,rgba(255,255,255,.45),transparent),radial-gradient(1px 1px at 60% 80%,rgba(255,255,255,.35),transparent);opacity:.9;pointer-events:none}
.page-hero .inner{position:relative;z-index:1;padding:3rem 0}@media(min-width:640px){.page-hero .inner{padding:4rem 0}}
.page-hero .eyebrow{margin:0;font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--gold)}
.page-hero h1{font-family:"Cormorant Garamond",serif;font-size:clamp(1.75rem,4vw,2.75rem);font-weight:600;line-height:1.15;margin:.5rem 0 0;max-width:20ch;color:#fff}
.page-hero .lead{margin:.75rem 0 0;max-width:40rem;font-size:.9rem;color:rgba(255,255,255,.7);line-height:1.55}
.page-hero .price-pill{display:inline-flex;margin-top:1.25rem;background:var(--gold);color:var(--navy);font-size:.875rem;font-weight:700;padding:.4rem 1rem;border-radius:999px}
.shell{padding:2.5rem 0 3.5rem}.shell.muted{background:var(--bg)}.shell.white{background:#fff}
.surface{background:#fff;border:1px solid var(--line);border-radius:16px;padding:1.25rem;box-shadow:0 1px 3px rgba(11,27,58,.06)}@media(min-width:640px){.surface{padding:1.5rem}}
.cat-pills{display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1.5rem}
.cat-pills a{display:inline-flex;align-items:center;padding:.45rem 1rem;border-radius:999px;border:1px solid var(--line);background:#fff;font-size:.82rem;font-weight:500;color:var(--ink)}.cat-pills a:hover{border-color:var(--gold)}
.cat-pills a.all{background:var(--navy);color:#fff;border-color:var(--navy)}
.buybox .btn.gold{width:100%;margin-top:1rem}
"""


def page_hero(eyebrow: str, title: str, lead: str = "", extra: str = "") -> str:
    lead_html = f'<p class="lead">{lead}</p>' if lead else ""
    return f"""<section class="page-hero"><div class="wrap inner">
  <p class="eyebrow">{eyebrow}</p>
  <h1>{title}</h1>
  {lead_html}
  {extra}
</div></section>"""


def layout(title: str, body: str) -> str:
    year = datetime.now().year
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate"/>
<title>{escape(title)}</title>
<meta name="description" content="JyotishKundali — Discover your true self through ancient wisdom and modern AI. Personalized Kundali, numerology and self-discovery tools."/>
<link rel="canonical" href="https://jyotishkundali.com/"/>
<meta property="og:title" content="JyotishKundali — Discover Your True Self"/>
<meta property="og:url" content="https://jyotishkundali.com/"/>
<style>body{{margin:0;background:#f4f5f7;color:#0b1224;font-family:system-ui,sans-serif}}header.site{{background:#050814;color:#fff}}</style>
<link rel="stylesheet" href="/assets/site.css?v={BUILD_VERSION}"/>
</head>
<body class="has-bottom">
<header class="site"><div class="wrap nav">
  <a class="logo" href="/"><span class="logo-mark" aria-hidden="true">✦</span> JyotishKundali</a>
  <nav class="nav-links" aria-label="Main">
    <a href="/">Home</a>
    <a href="/services.html">Astrology</a>
    <a href="/services.html?c=self-discovery">Self Discovery</a>
    <a href="/services.html?c=marriage">Compatibility</a>
    <a href="/membership.html">Membership</a>
    <a href="/legal.html">Legal</a>
  </nav>
  <div class="nav-actions">
    <a class="nav-search" href="/services.html" aria-label="Search services">⌕</a>
    <a class="btn login-outline" href="/login.html">Login</a>
    <a class="btn signup" href="/login.html">Sign Up</a>
  </div>
</div></header>
{body}
<nav class="bottom-nav" aria-label="Bottom"><a href="/">Home</a><a href="/services.html">Services</a><a href="/membership.html">Premium</a><a href="/login.html">Account</a></nav>
<footer class="site"><div class="wrap">
  <div class="cols">
    <div><div class="display" style="font-size:1.4rem;color:var(--gold)">JyotishKundali</div><p class="tagline">Discover your true self through ancient wisdom and modern AI.</p></div>
    <div><strong>Explore</strong><p><a href="/services.html">All services</a></p><p><a href="/membership.html">Membership</a></p></div>
    <div><strong>Help</strong><p><a href="/legal.html">Privacy &amp; Terms</a></p><p><a href="/contact.html">Contact</a></p></div>
    <div><strong>Note</strong><p style="color:rgba(255,255,255,.65);font-size:.85rem;line-height:1.5">Astrology reports are interpretive and for personal reflection. Not guarantees or professional advice.</p></div>
  </div>
  <div class="copy">
    <span>© {year} JyotishKundali · jyotishkundali.com · Build {BUILD_VERSION}</span>
    <span class="motto">Guided by the Stars. Built for You.</span>
  </div>
</div></footer>
</body></html>
"""


def service_card(p: dict) -> str:
    return f"""<article class="card">
  <div class="cat">{escape(p['category'].replace('-', ' '))}</div>
  <a class="title" href="/services/{escape(p['slug'])}.html">{escape(p['name'])}</a>
  <p class="muted" style="font-size:.875rem;line-height:1.5;margin:.35rem 0 0">{escape(p['desc'])}</p>
  <div class="price">₹{p['price']} · <a href="/services/{escape(p['slug'])}.html" style="color:var(--ink);text-decoration:underline">View</a></div>
</article>"""


def home_service_card(title: str, desc: str, icon: str, color: str, href: str) -> str:
    return f"""<a class="svc-card" href="{escape(href)}">
  <span class="svc-icon {escape(color)}" aria-hidden="true">{escape(icon)}</span>
  <h3>{escape(title)}</h3>
  <p>{escape(desc)}</p>
  <div class="svc-foot"><span class="price">View products</span><span class="svc-arrow" aria-hidden="true">→</span></div>
</a>"""


def build_homepage(product_count: int) -> str:
    service_cards = "".join(home_service_card(*s) for s in HOME_SERVICE_CARDS)
    membership_list = "".join(f'<li><span class="ck" aria-hidden="true">✓</span>{escape(f)}</li>' for f in MEMBERSHIP_FEATURES)
    return f"""
<section class="hero-astro"><div class="wrap hero-inner">
  <p class="hero-accent">Same Stars. A Brighter You.</p>
  <div style="max-width:42rem">
    <h1>Discover Your True Self Through Ancient Wisdom &amp; Modern AI</h1>
    <p class="hero-services">Astrology · Face Analysis · Numerology · Daily Guidance · And More</p>
    <div class="hero-chips">
      <span class="hero-chip"><span class="ic" aria-hidden="true">📄</span>{product_count}+ Detailed Reports</span>
      <span class="hero-chip"><span class="ic" aria-hidden="true">🔒</span>Secure &amp; Private</span>
      <span class="hero-chip"><span class="ic" aria-hidden="true">⚡</span>Instant PDF Download</span>
      <span class="hero-chip"><span class="ic" aria-hidden="true">🛡</span>Razorpay Checkout</span>
    </div>
    <form class="hero-form" action="/services/janam-kundali.html" method="get">
      <input name="q" type="text" placeholder="Enter your birth details to create your Kundali" aria-label="Birth details"/>
      <button class="btn gold" type="submit">Generate Now →</button>
    </form>
  </div>
</div></section>
<section class="trust-ribbon" aria-label="Trust highlights"><div class="wrap">
  <div class="trust-item"><span class="trust-icon" style="color:#7c3aed">🎁</span><span>Accurate Reports</span></div>
  <div class="trust-item"><span class="trust-icon" style="color:#d946ef">⚡</span><span>Instant PDF</span></div>
  <div class="trust-item"><span class="trust-icon" style="color:#3b82f6">🌐</span><span>Languages</span></div>
  <div class="trust-item"><span class="trust-icon" style="color:#0ea5e9">🔒</span><span>Secure Data</span></div>
  <div class="trust-item"><span class="trust-icon" style="color:#ec4899">♥</span><span>Built for Reflection</span></div>
</div></section>
<section class="section section-muted"><div class="wrap">
  <div class="section-intro">
    <h2 class="display">Explore by category</h2>
    <p class="muted" style="text-align:center;max-width:36rem;margin:.5rem auto 0">Eight clear categories — each product has a distinct job. Individual reports are ₹499.</p>
  </div>
  <div class="service-grid">{service_cards}</div>
</div></section>
<section class="section section-muted" style="padding-top:0"><div class="wrap">
  <div class="premium-banner">
    <div class="premium-badge"><span aria-hidden="true">👑</span><span class="tag">Most Popular</span></div>
    <h2>Complete Self-Discovery Premium Membership</h2>
    <p class="sub">Get access to premium features for just <strong>₹2,999/year</strong></p>
    <ul class="premium-features">{membership_list}</ul>
    <a class="btn gold" style="margin-top:1.5rem" href="/membership.html">Get Premium for ₹2,999/year →</a>
  </div>
</div></section>
<section class="section section-white"><div class="wrap">
  <h2 class="display" style="text-align:center;margin:0">How It Works</h2>
  <div class="how-grid">
    <div class="how-step"><div class="how-icon">📅<span class="how-num">1</span></div><h3>Enter Details</h3><p>Share your birth date, time, and place.</p></div>
    <div class="how-step"><div class="how-icon">💳<span class="how-num">2</span></div><h3>Make Payment</h3><p>Secure Razorpay checkout — ₹499 per report.</p></div>
    <div class="how-step"><div class="how-icon">📄<span class="how-num">3</span></div><h3>Get Your Report</h3><p>PDF ready in your dashboard when generated.</p></div>
    <div class="how-step"><div class="how-icon">★<span class="how-num">4</span></div><h3>Explore More</h3><p>Ask the AI assistant and unlock membership.</p></div>
  </div>
</div></section>
<section class="section section-muted"><div class="wrap why-grid">
  <div>
    <h2 class="display" style="margin:0">Why Choose JyotishKundali?</h2>
    <div class="why-icons">
      <div class="why-icon-card"><div class="ic">📖</div><p>Authentic Vedic Knowledge</p></div>
      <div class="why-icon-card"><div class="ic">🧠</div><p>AI-Powered Insights</p></div>
      <div class="why-icon-card"><div class="ic">⚡</div><p>Instant Results</p></div>
      <div class="why-icon-card"><div class="ic">😊</div><p>Easy to Use</p></div>
      <div class="why-icon-card"><div class="ic">🛡</div><p>Trusted &amp; Secure</p></div>
      <div class="why-icon-card"><div class="ic">🎧</div><p>Dedicated Support</p></div>
    </div>
  </div>
  <div class="testimonial">
    <p class="label">Sample stories · not verified reviews</p>
    <p class="muted" style="font-size:.75rem;margin:.5rem 0 0">Illustrative copy for layout only. Real testimonials appear only after verified purchases.</p>
    <blockquote style="font-size:1rem;margin-top:1rem">&ldquo;The chapters felt organised instead of vague. Clear disclaimers made me trust the tone more. Focus area: Complete Janam Kundali.&rdquo;</blockquote>
    <div class="author">
      <div class="avatar">A</div>
      <div><strong>Aarav · Mumbai</strong><span>Sample · not verified</span></div>
    </div>
    <p style="margin-top:1rem;font-size:.85rem"><a href="/services.html">Browse unique reports →</a></p>
  </div>
</div></section>
<section class="cta-final"><div class="wrap">
  <div class="spark" aria-hidden="true">✦</div>
  <h2>Your Journey to a Better Tomorrow Starts Today</h2>
  <p>Create your Kundali, explore self-discovery tools, and grow with interpretive guidance.</p>
  <div class="cta-row">
    <a class="btn gold" href="/services/janam-kundali.html">Create Your Kundali Now →</a>
    <a class="btn ghost" href="/services.html">Explore All Services</a>
  </div>
</div></section>
"""


def main() -> None:
    products = parse_products()
    categories = parse_categories()

    if OUT.exists():
        shutil.rmtree(OUT)
    (OUT / "services").mkdir(parents=True)
    (OUT / "assets").mkdir(parents=True)

    (OUT / "assets/site.css").write_text(CSS)
    (OUT / "assets/products.json").write_text(json.dumps(products, indent=2))

    home = layout(
        "JyotishKundali — Discover Your True Self Through Ancient Wisdom & Modern AI",
        build_homepage(len(products)),
    )
    (OUT / "index.html").write_text(home)

    # Services index
    cat_filters = '<a class="all" href="/services.html">All</a>' + "".join(
        f'<a href="/services.html?c={escape(c["slug"])}">{escape(c["name"])}</a>'
        for c in categories
    )
    services = layout(
        "Services — JyotishKundali",
        page_hero(
            "Astrology Services",
            "Explore all reports",
            f"Every individual report is ₹499. {len(products)} personalized readings available.",
        )
        + f"""<section class="shell muted"><div class="wrap">
  <div class="cat-pills">{cat_filters}</div>
  <div class="grid">{''.join(service_card(p) for p in products)}</div>
  <p class="disclaimer">Astrology reports are interpretive and intended for personal reflection and entertainment. They are not guarantees of future events.</p>
</div></section>""",
    )
    (OUT / "services.html").write_text(services)

    for p in products:
        page = layout(
            f"{p['name']} — JyotishKundali",
            page_hero(
                escape(p["category"].replace("-", " ")),
                escape(p["name"]),
                escape(p["desc"]),
                f'<span class="price-pill">₹{p["price"]}</span>',
            )
            + f"""<section class="shell muted"><div class="wrap pdp">
  <div>
    <div class="surface">
      <strong class="display" style="font-size:1.35rem">About this report</strong>
      <p class="muted" style="line-height:1.65;margin:.75rem 0 0">{escape(p['desc'])}</p>
      <p class="muted" style="line-height:1.65;margin:.75rem 0 0">Structured like leading astrology product pages: clear chapters, honest limits, and a detailed list of what you receive in the PDF — for reflection and entertainment, not guarantees.</p>
    </div>
    <div class="surface" style="margin-top:1rem">
      <strong class="display" style="font-size:1.2rem">What you will get</strong>
      <ul class="muted" style="font-size:.9rem;line-height:1.7;margin:.75rem 0 0;padding-left:1.1rem">
        <li>Long-form digital PDF with named chapters for this topic</li>
        <li>Plain-language explanations of traditional Jyotish terms</li>
        <li>Who-this-is-for guidance so you do not buy overlapping reports</li>
        <li>Dashboard archive access after payment</li>
        <li>Delivery usually within minutes of successful payment</li>
        <li>Clear entertainment / non-advice disclaimer</li>
      </ul>
    </div>
    <div class="surface" style="margin-top:1rem">
      <strong class="display" style="font-size:1.2rem">FAQ</strong>
      <p style="margin:.75rem 0 0;font-size:.9rem"><strong>Is this a prediction?</strong></p>
      <p class="muted" style="font-size:.9rem;margin:.35rem 0 0">No. Reports are interpretive guidance for personal reflection and entertainment.</p>
      <p style="margin:.75rem 0 0;font-size:.9rem"><strong>What birth details are needed?</strong></p>
      <p class="muted" style="font-size:.9rem;margin:.35rem 0 0">Date, time, and place of birth. Unknown time is supported with clear caveats.</p>
    </div>
    <p class="disclaimer">Astrology readings are interpretive and intended for personal reflection and entertainment. They should not be treated as certainty or professional advice.</p>
  </div>
  <div class="buybox surface">
    <div class="price-big">₹{p['price']}</div>
    <p class="muted" style="font-size:.85rem">One-time payment · Digital delivery</p>
    <a class="btn gold" href="/login.html">Get My Report — ₹{p['price']}</a>
    <p class="disclaimer">After payment, your JyotishKundali account is created automatically and your report is prepared.</p>
  </div>
</div></section>""",
        )
        (OUT / "services" / f"{p['slug']}.html").write_text(page)

    membership_list = "".join(
        f'<li><span class="ck" aria-hidden="true">✓</span>{escape(f)}</li>' for f in MEMBERSHIP_FEATURES
    )
    membership = layout(
        "Membership — JyotishKundali",
        page_hero(
            "Annual membership",
            "Complete Self-Discovery Premium Membership",
            "Unlock premium tools for ₹2,999/year — transparent renewal and cancellation.",
        )
        + f"""<section class="shell muted"><div class="wrap">
  <div class="premium-banner" style="max-width:56rem;margin:0 auto">
    <div class="premium-badge"><span aria-hidden="true">👑</span><span class="tag">Most Popular</span></div>
    <p style="font-size:2rem;font-weight:600;color:var(--gold);margin:0">₹2,999<span style="font-size:1rem;font-weight:400;color:rgba(255,255,255,.6)">/year</span></p>
    <ul class="premium-features">{membership_list}</ul>
    <a class="btn gold" style="margin-top:1.5rem" href="/login.html">Get Premium for ₹2,999/year →</a>
    <p class="disclaimer" style="color:rgba(255,255,255,.55)">Membership benefits activate after payment verification.</p>
  </div>
</div></section>""",
    )
    (OUT / "membership.html").write_text(membership)

    login = layout(
        "Login — JyotishKundali",
        page_hero("Account", "Sign in", "Access your Kundali reports and personalized dashboard.")
        + """<section class="shell muted"><div class="wrap">
  <div class="surface" style="max-width:420px;margin:0 auto">
    <p style="font-size:.7rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--gold-dark);margin:0">JyotishKundali</p>
    <h2 class="display" style="font-size:1.75rem;margin:.35rem 0 0">Welcome back</h2>
    <p class="muted" style="margin-top:.5rem">Full account login runs on the JyotishKundali app. This static mirror showcases the public catalogue.</p>
    <a class="btn gold" style="width:100%;margin-top:1.25rem" href="/services.html">Browse services</a>
  </div>
</div></section>""",
    )
    (OUT / "login.html").write_text(login)

    legal = layout(
        "Legal — JyotishKundali",
        page_hero("Legal", "Policies", "Privacy, terms, and interpretive-content disclaimers.")
        + """<section class="shell muted"><div class="wrap">
  <div class="surface" style="max-width:720px;margin:0 auto">
    <h2 class="display" style="font-size:1.35rem;margin:0">Disclaimer</h2>
    <p class="muted">Astrology reports are interpretive and intended for personal reflection and entertainment. They are not guarantees of future events and should not replace qualified professional advice.</p>
    <h2 class="display" style="font-size:1.35rem;margin-top:1.5rem">Face reading</h2>
    <p class="muted">Face self-discovery is an AI-powered interpretive experience for entertainment and self-reflection. It is not a scientifically validated personality or health assessment.</p>
    <h2 class="display" style="font-size:1.35rem;margin-top:1.5rem">Privacy</h2>
    <p class="muted">We store only required information for orders and reports. You may request data deletion.</p>
    <h2 class="display" style="font-size:1.35rem;margin-top:1.5rem">Refunds</h2>
    <p class="muted">Digital report refunds follow the published refund policy after purchase.</p>
  </div>
</div></section>""",
    )
    (OUT / "legal.html").write_text(legal)

    contact = layout(
        "Contact — JyotishKundali",
        page_hero("Support", "Contact", "Questions about reports, membership, or payments? Reach the JyotishKundali team.")
        + """<section class="shell muted"><div class="wrap" style="display:grid;gap:1rem;max-width:56rem;margin:0 auto">
  <div class="surface">
    <p style="font-size:.7rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-dark);margin:0">Email</p>
    <a href="mailto:hello@jyotishkundali.com" class="display" style="display:block;font-size:1.5rem;margin-top:.75rem;color:var(--navy)">hello@jyotishkundali.com</a>
    <p class="muted" style="margin-top:.75rem">We typically reply within one business day.</p>
  </div>
  <div class="surface">
    <p style="font-size:.7rem;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-dark);margin:0">Before you write</p>
    <ul class="muted" style="margin:.75rem 0 0;padding-left:1.1rem;line-height:1.7">
      <li>Include your order ID for payment issues.</li>
      <li>Birth-detail corrections can be updated in your profile.</li>
      <li>Reports are interpretive guidance, not professional advice.</li>
    </ul>
  </div>
</div></section>""",
    )
    (OUT / "contact.html").write_text(contact)

    (OUT / ".htaccess").write_text(
        f"""DirectoryIndex index.html

<IfModule mod_headers.c>
  <FilesMatch "\\.(html)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
  </FilesMatch>
  <FilesMatch "\\.(css|js)$">
    Header set Cache-Control "public, max-age=604800"
  </FilesMatch>
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{{REQUEST_FILENAME}} -f [OR]
  RewriteCond %{{REQUEST_FILENAME}} -d
  RewriteRule ^ - [L]
  RewriteRule ^services/?$ /services.html [L]
  RewriteRule ^membership/?$ /membership.html [L]
  RewriteRule ^login/?$ /login.html [L]
  RewriteRule ^legal/?$ /legal.html [L]
  RewriteRule ^contact/?$ /contact.html [L]
  RewriteRule ^services/([^/]+)/?$ /services/$1.html [L]
</IfModule>
"""
    )

    print(f"Built JyotishKundali static site with {len(products)} products → {OUT} (v{BUILD_VERSION})")


if __name__ == "__main__":
    main()

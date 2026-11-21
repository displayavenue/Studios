#!/usr/bin/env python3
"""Scrape Bakson, Bjain, and Wheezal storefront catalogues into import JSON."""

from __future__ import annotations

import argparse
import html as H
import json
import re
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMPORTS = ROOT / "storage" / "app" / "imports"
UA = {
    "User-Agent": "Mozilla/5.0 (compatible; HomeopathyPharmaCatalog/1.2)",
    "Accept": "application/json,text/html,*/*",
}
CTX = ssl.create_default_context()

# Prefer real pack sizes (ml/g/tabs). Avoid matching product codes like "B69 DROPS".
PACK_RE = re.compile(
    r"(?i)(\d+(?:\.\d+)?\s*(?:ml|m\.?l\.?|ltr|liter|litre|gm|kg|mg|tablets?|tabs?|capsules?))"
    r"|(?:pack\s*of\s*\d+)|(?:\d+\s*(?:pcs|pieces|nos|bottles))"
)


def fetch(url: str, timeout: int = 60, headers: dict | None = None) -> tuple[int, str, dict[str, str]]:
    h = dict(UA)
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=timeout, context=CTX) as resp:
            body = resp.read().decode("utf-8", "ignore")
            hdrs = {k.lower(): v for k, v in resp.headers.items()}
            return resp.status, body, hdrs
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", "ignore") if exc.fp else ""
        hdrs = {k.lower(): v for k, v in (exc.headers.items() if exc.headers else [])}
        return exc.code, body, hdrs


def fetch_json(url: str, timeout: int = 60, headers: dict | None = None):
    code, body, hdrs = fetch(url, timeout=timeout, headers=headers)
    if code != 200:
        raise RuntimeError(f"HTTP {code} for {url}: {body[:160]}")
    return json.loads(body), hdrs


def slugify(value: str) -> str:
    value = H.unescape(value or "").strip().lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-")


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    text = H.unescape(value)
    text = re.sub(r"(?is)<script[\s\S]*?</script>", " ", text)
    text = re.sub(r"(?is)<style[\s\S]*?</style>", " ", text)
    text = re.sub(r"(?i)<br\s*/?>", "\n", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n\s*\n+", "\n\n", text)
    return text.strip(" \n\t-•|")


def parse_package(*parts: str) -> str:
    haystack = " · ".join(p for p in parts if p)
    if not haystack:
        return ""
    bits: list[str] = []
    seen: set[str] = set()
    for match in PACK_RE.finditer(haystack):
        bit = re.sub(r"\s+", " ", match.group(0)).strip()
        key = bit.lower()
        if key and key not in seen:
            seen.add(key)
            bits.append(bit)
    # Prefer concise size labels; keep up to 3 unique fragments.
    return " · ".join(bits[:3])


def rupees_to_paise(value) -> int | None:
    try:
        amount = float(value)
    except (TypeError, ValueError):
        return None
    if amount <= 0:
        return None
    return int(round(amount * 100))


def write_catalog(name: str, rows: list[dict]) -> Path:
    IMPORTS.mkdir(parents=True, exist_ok=True)
    path = IMPORTS / f"{name}-catalog.json"
    path.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {path} ({len(rows)} products)")
    return path


def scrape_bakson(limit: int = 0) -> list[dict]:
    rows: list[dict] = []
    page = 1
    while True:
        url = f"https://www.buybakson.com/products.json?limit=250&page={page}"
        data, _ = fetch_json(url)
        products = data.get("products") or []
        if not products:
            break
        for product in products:
            title = clean_text(product.get("title") or "")
            handle = (product.get("handle") or "").strip()
            if not title or not handle:
                continue
            variants = product.get("variants") or []
            prices = [float(v.get("price") or 0) for v in variants]
            priced = [p for p in prices if p > 0]
            # Skip pure free-gift / zero-price clones.
            if not priced and ("100% off" in title.lower() or "freegift" in handle or "bogos" in str(product.get("tags") or "").lower()):
                continue
            pack_values = []
            for opt in product.get("options") or []:
                if "pack" in (opt.get("name") or "").lower() or "size" in (opt.get("name") or "").lower():
                    pack_values.extend(opt.get("values") or [])
            if not pack_values:
                pack_values = [v.get("title") for v in variants if v.get("title") and v.get("title") != "Default Title"]
            package_size = parse_package(title, " · ".join(str(v) for v in pack_values if v))
            images = []
            for img in product.get("images") or []:
                src = (img.get("src") or "").split("?")[0]
                if src:
                    images.append(src)
            min_price = min(priced) if priced else None
            max_compare = None
            compares = [float(v.get("compare_at_price") or 0) for v in variants if v.get("compare_at_price")]
            if compares:
                max_compare = max(compares)
            rows.append(
                {
                    "name": title,
                    "source_slug": handle,
                    "source_id": product.get("id"),
                    "image": images[0] if images else None,
                    "images": images,
                    "url": f"https://www.buybakson.com/products/{handle}",
                    "category": clean_text(product.get("product_type") or "") or None,
                    "package_size": package_size or None,
                    "price_paise": rupees_to_paise(min_price),
                    "sale_price_paise": None,
                    "mrp_paise": rupees_to_paise(max_compare) if max_compare and min_price and max_compare > min_price else None,
                    "description": clean_text(product.get("body_html") or "")[:4000] or None,
                    "tags": product.get("tags") or "",
                }
            )
            if limit > 0 and len(rows) >= limit:
                return rows
        print(f"  bakson page {page}: +{len(products)} (total {len(rows)})")
        page += 1
        time.sleep(0.15)
    return rows


def scrape_bjain(limit: int = 0) -> list[dict]:
    rows: list[dict] = []
    page = 1
    total_pages = None
    while True:
        url = f"https://bjainpharma.com/wp-json/wc/store/v1/products?per_page=100&page={page}"
        data, hdrs = fetch_json(url)
        if total_pages is None:
            try:
                total_pages = int(hdrs.get("x-wp-totalpages") or "0")
            except ValueError:
                total_pages = 0
        if not data:
            break
        for product in data:
            name = clean_text(product.get("name") or "")
            slug = (product.get("slug") or "").strip()
            if not name or not slug:
                continue
            images = []
            for img in product.get("images") or []:
                src = (img.get("src") or "").strip()
                if src:
                    images.append(src)
            pack_terms = []
            for attr in product.get("attributes") or []:
                aname = (attr.get("name") or "").lower()
                if "pack" in aname or "size" in aname:
                    for term in attr.get("terms") or []:
                        pack_terms.append(term.get("name") or term.get("slug") or "")
            package_size = parse_package(name, " · ".join(pack_terms))
            prices = product.get("prices") or {}
            # Store API amounts are in minor units already when currency_minor_unit=2,
            # but Bjain sometimes returns whole-rupee strings. Prefer INR semantics.
            minor = int(prices.get("currency_minor_unit") or 2)
            raw_price = prices.get("price") or prices.get("regular_price")
            raw_sale = prices.get("sale_price") if product.get("on_sale") else None
            raw_regular = prices.get("regular_price") or raw_price

            def to_paise(raw):
                if raw in (None, ""):
                    return None
                try:
                    num = float(raw)
                except (TypeError, ValueError):
                    return None
                if num <= 0:
                    return None
                # If minor unit is 2 and value looks like paise already (large int), keep.
                if minor == 2 and abs(num - int(num)) < 1e-9 and num >= 1000:
                    return int(num)
                return int(round(num * (10**minor)))

            price_paise = to_paise(raw_regular) or to_paise(raw_price)
            sale_paise = to_paise(raw_sale)
            if sale_paise and price_paise and sale_paise >= price_paise:
                sale_paise = None

            cats = [c.get("name") for c in (product.get("categories") or []) if c.get("name")]
            rows.append(
                {
                    "name": name,
                    "source_slug": slug,
                    "source_id": product.get("id"),
                    "image": images[0] if images else None,
                    "images": images,
                    "url": product.get("permalink") or f"https://bjainpharma.com/product/{slug}/",
                    "category": cats[0] if cats else None,
                    "categories": cats,
                    "package_size": package_size or None,
                    "price_paise": price_paise,
                    "sale_price_paise": sale_paise,
                    "description": clean_text(product.get("description") or product.get("short_description") or "")[:4000]
                    or None,
                    "short_description": clean_text(product.get("short_description") or "")[:500] or None,
                }
            )
            if limit > 0 and len(rows) >= limit:
                return rows
        print(f"  bjain page {page}/{total_pages or '?'}: +{len(data)} (total {len(rows)})")
        if total_pages and page >= total_pages:
            break
        page += 1
        time.sleep(0.12)
    return rows


def _wheezal_from_product_page(url: str) -> dict | None:
    code, body, _ = fetch(url, timeout=45)
    if code != 200:
        return None
    match = re.search(r'<script id="__NEXT_DATA__"[^>]*>(.*?)</script>', body)
    if not match:
        return None
    try:
        data = json.loads(match.group(1))
    except json.JSONDecodeError:
        return None
    product = (data.get("props") or {}).get("pageProps", {}).get("product")
    if not isinstance(product, dict):
        return None
    name = clean_text(product.get("name") or "")
    pid = product.get("id")
    if not name or not pid:
        return None
    images = []
    for img in product.get("images") or []:
        src = (img.get("image_url") or "").strip()
        if src:
            images.append(src)
    if not images and product.get("image_url"):
        images.append(product["image_url"])
    variant_names = []
    for variant in product.get("variants") or []:
        if variant.get("variant_name"):
            variant_names.append(str(variant["variant_name"]))
    package_size = parse_package(name, " · ".join(variant_names))
    price = product.get("discounted_price") or product.get("price")
    mrp = product.get("price")
    price_paise = rupees_to_paise(price)
    mrp_paise = rupees_to_paise(mrp)
    sale_paise = None
    if price_paise and mrp_paise and price_paise < mrp_paise:
        sale_paise = price_paise
        price_paise = mrp_paise
    slug_path = urllib.parse.urlparse(url).path.rstrip("/").split("/")[-1]
    source_slug = slugify(f"{pid}-{slug_path}") or str(pid)
    category = None
    cat = product.get("category") or {}
    if isinstance(cat, dict):
        category = clean_text(cat.get("name") or "") or None
    return {
        "name": name,
        "source_slug": source_slug,
        "source_id": pid,
        "image": images[0] if images else None,
        "images": images,
        "url": url,
        "category": category,
        "package_size": package_size or None,
        "price_paise": price_paise,
        "sale_price_paise": sale_paise,
        "description": clean_text(product.get("description_detail") or product.get("description") or "")[:4000] or None,
    }


def scrape_wheezal(limit: int = 0, workers: int = 16) -> list[dict]:
    code, body, _ = fetch("https://www.wheezalstore.com/sitemap_products.xml", timeout=90)
    if code != 200:
        raise RuntimeError(f"Wheezal sitemap HTTP {code}")
    urls = re.findall(r"<loc>(https://www\.wheezalstore\.com/product/[^<]+)</loc>", body)
    image_map = {}
    for block in re.findall(r"<url>(.*?)</url>", body, flags=re.S):
        loc = re.search(r"<loc>([^<]+)</loc>", block)
        img = re.search(r"<image:loc>([^<]+)</image:loc>", block)
        if loc and img:
            image_map[loc.group(1)] = img.group(1)
    if limit > 0:
        urls = urls[:limit]
    print(f"  wheezal sitemap urls: {len(urls)}")

    rows: list[dict] = []
    failed = 0

    def job(u: str):
        try:
            row = _wheezal_from_product_page(u)
            if row:
                if not row.get("image") and u in image_map:
                    row["image"] = image_map[u]
                    row["images"] = [image_map[u]]
                return row
        except Exception:
            return None
        # Fallback from URL + sitemap image when SSR fails.
        parts = urllib.parse.urlparse(u).path.strip("/").split("/")
        pid = parts[1] if len(parts) > 1 else ""
        name_slug = parts[2] if len(parts) > 2 else pid
        name = clean_text(name_slug.replace("-", " "))
        package_size = parse_package(name, name_slug)
        img = image_map.get(u)
        return {
            "name": name.title() if name else f"Wheezal {pid}",
            "source_slug": slugify(f"{pid}-{name_slug}") or pid,
            "source_id": int(pid) if pid.isdigit() else pid,
            "image": img,
            "images": [img] if img else [],
            "url": u,
            "category": None,
            "package_size": package_size or None,
            "price_paise": None,
            "sale_price_paise": None,
            "description": None,
        }

    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(job, u): u for u in urls}
        done = 0
        for fut in as_completed(futures):
            done += 1
            row = fut.result()
            if row:
                rows.append(row)
            else:
                failed += 1
            if done % 100 == 0 or done == len(urls):
                print(f"  wheezal fetched {done}/{len(urls)} ok={len(rows)} fail={failed}")
    rows.sort(key=lambda r: str(r.get("source_id") or r.get("source_slug")))
    return rows


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--brand",
        choices=["bakson", "bjain", "wheezal", "all"],
        default="all",
    )
    parser.add_argument("--limit", type=int, default=0, help="Limit products per brand (0=all)")
    parser.add_argument("--wheezal-workers", type=int, default=16)
    args = parser.parse_args()

    brands = ["bakson", "bjain", "wheezal"] if args.brand == "all" else [args.brand]
    for brand in brands:
        print(f"==> Scraping {brand}")
        if brand == "bakson":
            rows = scrape_bakson(limit=args.limit)
        elif brand == "bjain":
            rows = scrape_bjain(limit=args.limit)
        else:
            rows = scrape_wheezal(limit=args.limit, workers=args.wheezal_workers)
        write_catalog(brand, rows)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

#!/usr/bin/env python3
"""Scrape description / benefits / safety from SBL, Reckeweg, and Schwabe product pages."""

from __future__ import annotations

import html as H
import json
import re
import ssl
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMPORTS = ROOT / "storage" / "app" / "imports"
OUT = IMPORTS / "product-details.json"
DOSAGE = "As prescribed by the doctor."
UA = {"User-Agent": "Mozilla/5.0 (compatible; HomeopathyPharmaBot/1.1)"}
CTX = ssl.create_default_context()
SBL_KEY = "9906bf6e010b9381c6f6084eeda60923b051c75ca0b5ab5b9e79dec5"


def fetch(url: str, timeout: int = 45, headers: dict | None = None) -> str:
    h = dict(UA)
    if headers:
        h.update(headers)
    req = urllib.request.Request(url, headers=h)
    with urllib.request.urlopen(req, timeout=timeout, context=CTX) as resp:
        return resp.read().decode("utf-8", "ignore")


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    text = H.unescape(value)
    text = re.sub(r"(?is)<script[\s\S]*?</script>", " ", text)
    text = re.sub(r"(?is)<style[\s\S]*?</style>", " ", text)
    text = re.sub(r"(?i)<br\s*/?>", "\n", text)
    text = re.sub(r"(?i)</p>", "\n", text)
    text = re.sub(r"(?i)</li>", "\n", text)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n\s*\n+", "\n\n", text)
    return text.strip(" \n\t-•|")


def strip_trailing_q(text: str) -> str:
    text = re.sub(r"\s+Q$", "", text.strip())
    return text.strip()


def extract_section(text: str, labels: list[str]) -> str:
    if not text:
        return ""
    pattern = (
        r"(?is)\b(?:"
        + "|".join(re.escape(label) for label in labels)
        + r")\b\s*:?\s*(.*?)(?=(?:\n\s*)?\b(?:INDICATIONS?|DOSAGE|DOSE|MODE OF ACTION|REMARKS?|"
        r"PRESENTATION|PACKAGE|SIZE|WARNING|PRECAUTION|SIDE EFFECTS?|BENEFITS?|USES?|"
        r"COMPOSITION|INGREDIENTS?|CONTENTS?)\b|$)"
    )
    match = re.search(pattern, text)
    if not match:
        return ""
    return clean_text(match.group(1))


def load_catalog(name: str) -> list[dict]:
    path = IMPORTS / f"{name}-catalog.json"
    return json.loads(path.read_text())


def sbl_sort_descriptions() -> dict[str, str]:
    url = "https://admin.sblglobal.com/api/products"
    raw = fetch(url, headers={"X-Api-Key": SBL_KEY, "Accept": "application/json"})
    data = json.loads(raw)
    out: dict[str, str] = {}

    def walk(node):
        if isinstance(node, dict):
            slug = str(node.get("slug") or "").lower()
            desc = clean_text(node.get("sort_description") or "")
            if slug and desc:
                out[slug] = desc
            for v in node.values():
                walk(v)
        elif isinstance(node, list):
            for item in node:
                walk(item)

    walk(data)
    return out


def scrape_reckeweg(row: dict) -> dict | None:
    url = row.get("url") or f"https://www.reckeweg-india.com/product-details/{row['source_slug']}.html"
    try:
        html = fetch(url)
    except Exception:
        return None
    m = re.search(r'data-page="([^"]+)"', html)
    if not m:
        return None
    data = json.loads(H.unescape(m.group(1)))
    product = None

    def find(node):
        nonlocal product
        if product:
            return
        if isinstance(node, dict):
            if node.get("products_id") and node.get("products_name"):
                product = node
                return
            for v in node.values():
                find(v)
        elif isinstance(node, list):
            for item in node:
                find(item)

    find(data)
    if not product:
        return None

    description = clean_text(product.get("products_description") or product.get("brief_description") or "")
    indication = clean_text(product.get("indication") or "")
    if not indication and description:
        # Often indications are embedded in the HTML description.
        ind = re.search(r"(?is)INDICATIONS?\s*(.+?)(?:DOSAGE|COMPOSITION|MODE OF ACTION|$)", description)
        if ind:
            indication = clean_text(ind.group(1))

    safety_parts = []
    disclaimer = clean_text(product.get("faq_disclaimer") or "")
    if disclaimer:
        safety_parts.append(disclaimer)
    faqs = product.get("faqs") or []
    if isinstance(faqs, list):
        for faq in faqs:
            if not isinstance(faq, dict):
                continue
            q = clean_text(faq.get("question") or "").lower()
            a = clean_text(faq.get("answer") or "")
            if not a:
                continue
            if any(k in q for k in ["side effect", "safe", "precaution", "pregnancy", "children", "consult", "warning"]):
                safety_parts.append(f"{clean_text(faq.get('question'))}: {a}")

    benefits = indication
    if not benefits:
        # First FAQ "used for" often carries benefit language.
        for faq in faqs if isinstance(faqs, list) else []:
            if not isinstance(faq, dict):
                continue
            q = clean_text(faq.get("question") or "").lower()
            a = clean_text(faq.get("answer") or "")
            if a and ("used for" in q or "benefit" in q or "indication" in q):
                benefits = a
                break

    raw_desc = product.get("products_description") or product.get("brief_description") or ""
    ingredients = extract_section(
        raw_desc if isinstance(raw_desc, str) else "",
        ["INGREDIENTS", "INGREDIENT", "COMPOSITION", "CONTENTS", "FORMULA"],
    )
    if not ingredients:
        ingredients = extract_section(
            description,
            ["INGREDIENTS", "INGREDIENT", "COMPOSITION", "CONTENTS", "FORMULA"],
        )

    package_size = clean_text(str(product.get("products_size") or ""))
    if not package_size:
        package_size = parse_offer_package(
            " ".join(
                str(product.get(k) or "")
                for k in ["products_name", "products_size", "potency_name"]
            )
        )

    # Only keep distinct benefits copy.
    if benefits and description and benefits.strip().lower() == description.strip().lower():
        benefits = ""

    return {
        "brand": "dr-reckeweg",
        "source_slug": row["source_slug"],
        "url": url,
        "description": description,
        "benefits": benefits,
        "ingredients": ingredients,
        "package_size": package_size,
        "dosage": DOSAGE,
        "safety": "\n\n".join(p for p in safety_parts if p),
    }


def parse_offer_package(label: str, *, prefer_combo_pair: bool = False) -> str:
    text = clean_text(label)
    if not text:
        return ""
    bits: list[str] = []
    pack = re.search(
        r"(?i)\b(?:pack\s*of\s*|combo\s*of\s*|set\s*of\s*)(\d+)\b|\b(\d+)\s*(?:pcs|pieces|nos|bottles|units)\b",
        text,
    )
    if pack:
        n = pack.group(1) or pack.group(2)
        bits.append(f"Pack of {n}")
    elif prefer_combo_pair and re.search(r"(?i)\bcombo\s*pack\b", text):
        # Default Schwabe "Combo Pack" (no count) is the 2-item set.
        bits.append("Pack of 2")
    bogo = re.search(
        r"(?i)\b(?:buy\s*1\s*get\s*1|bogo|b1g1|buy\s*one\s*get\s*one(?:\s*free)?)\b",
        text,
    )
    if bogo:
        bits.append("Buy 1 Get 1")
    size = re.search(
        r"(?i)\b(\d+(?:\.\d+)?\s*(?:ml|mL|ML|g|gm|grams?|kg|l|ltr|litre|liter|oz))\b",
        text,
    )
    if size:
        bits.append(size.group(1).replace("  ", " "))
    # Keep order: size, pack, offer
    ordered: list[str] = []
    for item in bits:
        if item not in ordered:
            ordered.append(item)
    # Prefer size first
    ordered.sort(key=lambda v: 0 if re.search(r"(?i)ml|g\b|kg|l\b|oz", v) and not v.lower().startswith("pack") and not v.lower().startswith("buy") else 1)
    return " · ".join(ordered)


def parse_schwabe_json_ld(html: str) -> dict:
    out = {"description": "", "benefits": "", "safety": "", "ingredients": "", "package_size": ""}
    for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', html, re.S | re.I):
        try:
            data = json.loads(m.group(1))
        except Exception:
            continue
        if not isinstance(data, dict):
            continue
        types = data.get("@type")
        type_list = types if isinstance(types, list) else [types]
        if not any(t in {"Product", "Drug"} for t in type_list if isinstance(t, str)):
            continue
        description = clean_text(data.get("description") or "")
        # Marketing blurbs are not product descriptions.
        if re.search(r"(?i)^buy genuine\b", description):
            description = ""
        warning = clean_text(data.get("warning") or "")
        dose = data.get("doseSchedule") if isinstance(data.get("doseSchedule"), dict) else {}
        dose_note = clean_text(dose.get("frequency") or "")
        active = clean_text(data.get("activeIngredient") or "")
        nonprop = clean_text(data.get("nonProprietaryName") or "")
        prop_ingredient = ""
        for prop in data.get("additionalProperty") or []:
            if not isinstance(prop, dict):
                continue
            name = clean_text(prop.get("name") or "").lower()
            value = clean_text(prop.get("value") or "")
            if value and any(k in name for k in ["ingredient", "active substance", "composition", "contains"]):
                prop_ingredient = value
                break
        # Use the primary/first offer for pack count so a secondary
        # "Combo Pack of 4" variant does not override the default 2-item combo.
        package_bits: list[str] = []
        offers = [o for o in (data.get("offers") or []) if isinstance(o, dict)]
        variants = [v for v in (data.get("hasVariant") or []) if isinstance(v, dict)]
        primary = offers[0] if offers else (variants[0] if variants else None)
        if primary:
            parsed = parse_offer_package(str(primary.get("name") or ""), prefer_combo_pair=True)
            if parsed:
                package_bits.extend(part for part in parsed.split(" · ") if part)
        # Still collect extra bottle sizes from other offers, but ignore other pack counts.
        for offer in offers[1:] + variants[1:]:
            parsed = parse_offer_package(str(offer.get("name") or ""))
            for part in parsed.split(" · "):
                if not part or part in package_bits:
                    continue
                if re.match(r"(?i)^pack of \d+$", part):
                    continue
                package_bits.append(part)
        out["description"] = description
        # Benefits must come from real benefits/FAQ copy, never mirrored description.
        out["benefits"] = ""
        out["ingredients"] = active or prop_ingredient or nonprop
        out["package_size"] = " · ".join(package_bits[:4])
        safety_bits = []
        if warning:
            safety_bits.append(warning)
        if dose_note and "medical supervision" in dose_note.lower():
            safety_bits.append(dose_note)
        out["safety"] = "\n".join(safety_bits)
        if out["description"] or out["safety"] or out["ingredients"] or out["package_size"]:
            return out
    return out


def scrape_schwabe(row: dict) -> dict | None:
    url = row.get("url") or f"https://www.schwabeindia.com/product/{row['source_slug']}/"
    try:
        html = fetch(url)
    except Exception:
        return None
    if re.search(r"<title>\s*Remedy Not Found", html, re.I) or re.search(r"<title>\s*404", html, re.I):
        return None

    parts = re.split(r"(?i)<h3[^>]*>", html)
    qa: dict[str, str] = {}
    for part in parts[1:]:
        m = re.match(r"(.*?)</h3>([\s\S]*)", part, re.I)
        if not m:
            continue
        question = clean_text(m.group(1))
        body = m.group(2)
        body = re.split(r"(?i)<h3[^>]*>", body)[0]
        answer = strip_trailing_q(clean_text(body))
        # Keep answers reasonably bounded; cut at manufacturer footer markers.
        answer = re.split(r"(?i)\bMANUFACTURED IN INDIA BY\b", answer)[0].strip()
        if question and answer and (
            question.startswith("What")
            or question.startswith("How")
            or question.startswith("Is")
        ):
            qa[question] = answer

    def find_answer(*needles: str) -> str:
        for q, a in qa.items():
            ql = q.lower()
            if all(n in ql for n in needles):
                return a
        return ""

    description = find_answer("what is")
    benefits = find_answer("uses/benefits") or find_answer("benefits")
    side = find_answer("side effects")
    precaution = find_answer("precautions")
    children = next((a for q, a in qa.items() if "children" in q.lower()), "")
    pregnancy = next((a for q, a in qa.items() if "pregnancy" in q.lower()), "")
    ingredients = ""

    safety_bits = []
    if side:
        safety_bits.append(f"Side effects: {side}")
    if precaution:
        safety_bits.append(f"Precautions: {precaution}")
    if children:
        safety_bits.append(f"Children: {children}")
    if pregnancy:
        safety_bits.append(f"Pregnancy: {pregnancy}")

    ld = parse_schwabe_json_ld(html)
    if not description:
        description = ld.get("description") or ""
    # Never invent benefits from description / marketing JSON-LD.
    if not benefits:
        benefits = ""
    if not safety_bits and ld.get("safety"):
        safety_bits = [ld["safety"]]
    ingredients = ld.get("ingredients") or ""
    package_size = ld.get("package_size") or ""
    if not package_size:
        package_size = parse_offer_package(row.get("name") or "")
    if not ingredients and description:
        # e.g. "prepared from the herb Wolf's Bane"
        made = re.search(
            r"(?i)(?:prepared from|made from|source[:\s]+)\s*([^.;]+)",
            description,
        )
        if made:
            ingredients = clean_text(made.group(0))

    if benefits and description and benefits.strip().lower() == description.strip().lower():
        benefits = ""

    if not any([description, benefits, safety_bits, ingredients, package_size]):
        return None

    return {
        "brand": "schwabe",
        "source_slug": row["source_slug"],
        "url": url,
        "description": description,
        "benefits": benefits,
        "ingredients": ingredients,
        "package_size": package_size,
        "dosage": DOSAGE,
        "safety": "\n".join(b for b in safety_bits if b),
    }


def scrape_sbl(row: dict, sort_map: dict[str, str]) -> dict:
    slug = row["source_slug"].lower()
    sort_desc = sort_map.get(slug, "")
    # SBL public product pages are SPA shells; usable copy comes from their products API.
    description = sort_desc or ""
    package_size = parse_offer_package(row.get("name") or "")
    return {
        "brand": "sbl",
        "source_slug": row["source_slug"],
        "url": row.get("url") or f"https://sblglobal.com/product/{slug}",
        "description": description,
        "benefits": "",
        "ingredients": "",
        "package_size": package_size,
        "dosage": DOSAGE,
        "safety": "",
    }


def run_pool(label: str, rows: list[dict], worker, workers: int = 10) -> list[dict]:
    results: list[dict] = []
    total = len(rows)
    done = 0
    failed = 0
    with ThreadPoolExecutor(max_workers=workers) as ex:
        futs = {ex.submit(worker, row): row for row in rows}
        for fut in as_completed(futs):
            done += 1
            try:
                item = fut.result()
            except Exception:
                item = None
            if item:
                results.append(item)
            else:
                failed += 1
            if done % 50 == 0 or done == total:
                print(f"{label}: {done}/{total} ok={len(results)} fail={failed}", flush=True)
            time.sleep(0.01)
    return results


def main() -> None:
    print("Loading SBL sort descriptions…", flush=True)
    sort_map = sbl_sort_descriptions()
    print(f"SBL sort map: {len(sort_map)}", flush=True)

    sbl_rows = load_catalog("sbl")
    reck_rows = load_catalog("reckeweg")
    schw_rows = load_catalog("schwabe")

    out: list[dict] = []
    out.extend(scrape_sbl(row, sort_map) for row in sbl_rows)
    print(f"SBL details prepared: {len(sbl_rows)}", flush=True)

    out.extend(run_pool("Reckeweg", reck_rows, scrape_reckeweg, workers=8))
    out.extend(run_pool("Schwabe", schw_rows, scrape_schwabe, workers=8))

    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print(f"Wrote {OUT} rows={len(out)}", flush=True)


if __name__ == "__main__":
    main()

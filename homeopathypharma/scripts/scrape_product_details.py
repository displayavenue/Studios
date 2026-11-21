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

    return {
        "brand": "dr-reckeweg",
        "source_slug": row["source_slug"],
        "url": url,
        "description": description,
        "benefits": benefits,
        "dosage": DOSAGE,
        "safety": "\n\n".join(p for p in safety_parts if p),
    }


def parse_schwabe_json_ld(html: str) -> dict:
    out = {"description": "", "benefits": "", "safety": ""}
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
        warning = clean_text(data.get("warning") or "")
        dose = data.get("doseSchedule") if isinstance(data.get("doseSchedule"), dict) else {}
        dose_note = clean_text(dose.get("frequency") or "")
        out["description"] = description
        # Schema description usually encodes uses/benefits copy.
        out["benefits"] = description
        safety_bits = []
        if warning:
            safety_bits.append(warning)
        if dose_note and "medical supervision" in dose_note.lower():
            safety_bits.append(dose_note)
        out["safety"] = "\n".join(safety_bits)
        if out["description"] or out["safety"]:
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

    safety_bits = []
    if side:
        safety_bits.append(f"Side effects: {side}")
    if precaution:
        safety_bits.append(f"Precautions: {precaution}")
    if children:
        safety_bits.append(f"Children: {children}")
    if pregnancy:
        safety_bits.append(f"Pregnancy: {pregnancy}")

    if not any([description, benefits, safety_bits]):
        ld = parse_schwabe_json_ld(html)
        description = ld["description"]
        benefits = ld["benefits"]
        safety_bits = [ld["safety"]] if ld["safety"] else []

    if not any([description, benefits, safety_bits]):
        return None

    return {
        "brand": "schwabe",
        "source_slug": row["source_slug"],
        "url": url,
        "description": description,
        "benefits": benefits,
        "dosage": DOSAGE,
        "safety": "\n".join(b for b in safety_bits if b),
    }


def scrape_sbl(row: dict, sort_map: dict[str, str]) -> dict:
    slug = row["source_slug"].lower()
    sort_desc = sort_map.get(slug, "")
    # SBL public product pages are SPA shells; usable copy comes from their products API.
    description = sort_desc or ""
    return {
        "brand": "sbl",
        "source_slug": row["source_slug"],
        "url": row.get("url") or f"https://sblglobal.com/product/{slug}",
        "description": description,
        "benefits": "",
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

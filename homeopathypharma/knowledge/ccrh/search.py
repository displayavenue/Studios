#!/usr/bin/env python3
"""Search the CCRH Homoeopathy dossier text extract."""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
TEXT = (ROOT / "homoeopathy_gentle_healing_CCRH.txt").read_text(errors="replace")
PAGES = TEXT.split("\f")
MEDS = json.loads((ROOT / "medicines.json").read_text())


def search(query: str, limit: int = 12) -> list[dict]:
    q = query.strip()
    if not q:
        return []
    # Prefer medicine catalog hits
    catalog_hits = []
    ql = q.lower()
    for med in MEDS.get("medicines", []):
        names = [med["name"], *med.get("aliases", [])]
        if any(ql in n.lower() or n.lower() in ql for n in names):
            catalog_hits.append({"type": "catalog", "name": med["name"], "lists": med["lists"], "pages": med["pages"], "snippet": med.get("snippet", "")})

    pat = re.compile(re.escape(q), re.I)
    page_hits = []
    for i, page in enumerate(PAGES):
        if not pat.search(page):
            continue
        m = pat.search(page)
        a = max(0, m.start() - 140)
        b = min(len(page), m.end() + 180)
        snip = re.sub(r"\s+", " ", page[a:b]).strip()
        page_hits.append({"type": "page", "page": i + 1, "snippet": snip})
        if len(page_hits) >= limit:
            break
    return catalog_hits[:10] + page_hits


def main() -> None:
    parser = argparse.ArgumentParser(description="Search CCRH Homoeopathy dossier")
    parser.add_argument("query")
    parser.add_argument("--limit", type=int, default=12)
    args = parser.parse_args()
    hits = search(args.query, args.limit)
    if not hits:
        print("No hits.")
        return
    for h in hits:
        if h["type"] == "catalog":
            print(f"[catalog] {h['name']} | lists={','.join(h['lists'])} | pages={h['pages']}")
            if h.get("snippet"):
                print(f"  {h['snippet']}")
        else:
            print(f"[page {h['page']}] {h['snippet']}")


if __name__ == "__main__":
    main()

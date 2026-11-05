#!/usr/bin/env python3
"""Generate compact JPEG + WebP thumbs for awards/certs grids."""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "images"
DIRS = [ROOT / "awards", ROOT / "certs"]
MAX_W = 560
JPEG_Q = 72
WEBP_Q = 68


def optimize_one(src: Path) -> tuple[int, int, int]:
    if src.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        return (0, 0, 0)
    if src.parent.name == "thumbs":
        return (0, 0, 0)

    thumb_dir = src.parent / "thumbs"
    thumb_dir.mkdir(parents=True, exist_ok=True)
    stem = src.stem
    jpg_out = thumb_dir / f"{stem}.jpg"
    webp_out = thumb_dir / f"{stem}.webp"

    with Image.open(src) as im:
        im = im.convert("RGB")
        w, h = im.size
        if w > MAX_W:
            nh = int(round(h * (MAX_W / w)))
            im = im.resize((MAX_W, nh), Image.Resampling.LANCZOS)
        im.save(jpg_out, "JPEG", quality=JPEG_Q, optimize=True, progressive=True)
        im.save(webp_out, "WEBP", quality=WEBP_Q, method=6)

    return (src.stat().st_size, jpg_out.stat().st_size, webp_out.stat().st_size)


def main() -> None:
    total_src = total_jpg = total_webp = count = 0
    for d in DIRS:
        if not d.is_dir():
            print(f"skip missing {d}")
            continue
        for src in sorted(d.iterdir()):
            if not src.is_file():
                continue
            a, b, c = optimize_one(src)
            if a == 0:
                continue
            count += 1
            total_src += a
            total_jpg += b
            total_webp += c
            print(f"{src.name}: {a // 1024}KB → jpg {b // 1024}KB / webp {c // 1024}KB")
    print(
        f"\n{count} images | src {total_src / 1024:.0f}KB → "
        f"jpg thumbs {total_jpg / 1024:.0f}KB / webp thumbs {total_webp / 1024:.0f}KB"
    )


if __name__ == "__main__":
    main()

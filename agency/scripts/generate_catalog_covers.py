#!/usr/bin/env python3
"""Compose unique covers for industries, packages, and AI suite pages."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont

ROOT = Path(__file__).resolve().parents[1]
ASSETS = Path("/opt/cursor/artifacts/assets")
PUBLIC = ROOT / "public" / "images"

CATALOGS = {
  "industries": {
    "json": ROOT / "public" / "content" / "industries.json",
    "out": PUBLIC / "industries",
    "prefix": "ind-",
    "path_prefix": "/images/industries/",
  },
  "packages": {
    "json": ROOT / "public" / "content" / "packages.json",
    "out": PUBLIC / "packages",
    "prefix": "pkg-",
    "path_prefix": "/images/packages/",
  },
  "ai": {
    "json": ROOT / "public" / "content" / "ai.json",
    "out": PUBLIC / "ai",
    "prefix": "ai-",
    "path_prefix": "/images/ai/",
  },
}


def hex_to_rgb(h: str) -> tuple[int, int, int]:
  h = (h or "#0056ff").lstrip("#")
  return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def load_font(size: int) -> ImageFont.ImageFont:
  for path in (
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
  ):
    if Path(path).exists():
      return ImageFont.truetype(path, size=size)
  return ImageFont.load_default()


def find_base(prefix: str, slug: str) -> Path:
  candidates = [
    ASSETS / f"{prefix}{slug}.jpg",
    ASSETS / f"{prefix}{slug}.png",
    PUBLIC / "categories" / "digital-marketing.jpg",
  ]
  for c in candidates:
    if c.exists():
      return c
  # fallback any matching prefix
  matches = sorted(ASSETS.glob(f"{prefix}*.jpg"))
  if matches:
    return matches[0]
  raise FileNotFoundError(f"No base image for {prefix}{slug}")


def unique_crop(img: Image.Image, slug: str, size=(1600, 900)) -> Image.Image:
  h = sum(ord(c) for c in slug)
  w, ht = img.size
  tw, th = size
  scale = max(tw / w, th / ht) * 1.12
  nw, nh = int(w * scale), int(ht * scale)
  resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
  max_x = max(0, nw - tw)
  max_y = max(0, nh - th)
  x = (h * 37) % (max_x + 1) if max_x else 0
  y = (h * 91) % (max_y + 1) if max_y else 0
  return resized.crop((x, y, x + tw, y + th))


def tint(img: Image.Image, color: tuple[int, int, int], alpha: float) -> Image.Image:
  base = img.convert("RGBA")
  overlay = Image.new("RGBA", base.size, (*color, int(255 * alpha)))
  return Image.alpha_composite(base, overlay)


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont, max_width: int) -> list[str]:
  words = text.split()
  lines: list[str] = []
  cur = ""
  for w in words:
    trial = f"{cur} {w}".strip()
    if draw.textlength(trial, font=font) <= max_width:
      cur = trial
    else:
      if cur:
        lines.append(cur)
      cur = w
  if cur:
    lines.append(cur)
  return lines[:3]


def compose(item: dict, base: Path, out: Path) -> None:
  slug = item["slug"]
  title = item["title"]
  color = hex_to_rgb(item.get("color") or "#0056ff")
  chip = (item.get("category") or item.get("eyebrow") or "DisplayAvenue").upper()

  cover = unique_crop(Image.open(base).convert("RGB"), slug)
  h = sum(ord(c) for c in slug)
  cover = ImageEnhance.Color(cover).enhance(0.92 + (h % 15) / 100)
  cover = ImageEnhance.Contrast(cover).enhance(1.05 + (h % 8) / 100)
  cover = tint(cover, color, 0.20 + (h % 12) / 100).convert("RGBA")

  grad = Image.new("RGBA", cover.size, (0, 0, 0, 0))
  gdraw = ImageDraw.Draw(grad)
  w, ht = cover.size
  for y in range(ht // 2, ht):
    a = int(215 * ((y - ht // 2) / (ht // 2)))
    gdraw.line([(0, y), (w, y)], fill=(8, 18, 40, a))
  cover = Image.alpha_composite(cover, grad)

  draw = ImageDraw.Draw(cover)
  draw.rectangle([0, 0, 18, ht], fill=(*color, 255))
  font_sm = load_font(26)
  font_lg = load_font(52)
  chip_w = int(draw.textlength(chip, font=font_sm)) + 36
  draw.rounded_rectangle([48, ht - 210, 48 + chip_w, ht - 168], radius=10, fill=(*color, 230))
  draw.text((66, ht - 204), chip, font=font_sm, fill=(255, 255, 255, 255))
  y = ht - 145
  for line in wrap_text(draw, title, font_lg, w - 120):
    draw.text((48, y), line, font=font_lg, fill=(255, 255, 255, 255))
    y += 60

  out.parent.mkdir(parents=True, exist_ok=True)
  cover.convert("RGB").save(out, "JPEG", quality=86, optimize=True)


def main() -> None:
  for key, cfg in CATALOGS.items():
    data = json.loads(cfg["json"].read_text())
    items = data.get("items") or []
    for item in items:
      slug = item["slug"]
      base = find_base(cfg["prefix"], slug)
      out = cfg["out"] / f"{slug}.jpg"
      compose(item, base, out)
      item["coverImage"] = f"{cfg['path_prefix']}{slug}.jpg"
      item["coverAlt"] = f"{item['title']} | DisplayAvenue"
      print(f"{key}/{slug} <- {base.name}")
    cfg["json"].write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    print(f"{key}: {len(items)} covers")


if __name__ == "__main__":
  main()

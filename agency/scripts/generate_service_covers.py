#!/usr/bin/env python3
"""Create unique professional cover images for every service page."""

from __future__ import annotations

import colorsys
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SERVICES = ROOT / "public" / "content" / "services.json"
CAT_DIR = ROOT / "public" / "images" / "categories"
OUT_DIR = ROOT / "public" / "images" / "services"

CAT_FILE = {
  "Digital Marketing": "digital-marketing.jpg",
  "Paid Media": "paid-media.jpg",
  "Conversion": "conversion.jpg",
  "Analytics": "analytics.jpg",
  "Web Development": "web-development.jpg",
  "E-commerce": "ecommerce.jpg",
  "CMS": "cms.jpg",
  "Software": "software.jpg",
  "Mobile": "mobile.jpg",
  "Design": "design.jpg",
  "Branding": "branding.jpg",
  "AI Solutions": "ai-solutions.jpg",
  "Cloud & DevOps": "cloud-devops.jpg",
  "Creative Studio": "creative-studio.jpg",
  "Search": "search.jpg",
}


def hex_to_rgb(h: str) -> tuple[int, int, int]:
  h = h.lstrip("#")
  return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))  # type: ignore[return-value]


def load_font(size: int) -> ImageFont.ImageFont:
  for path in (
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
  ):
    p = Path(path)
    if p.exists():
      return ImageFont.truetype(str(p), size=size)
  return ImageFont.load_default()


def unique_crop(img: Image.Image, slug: str, size=(1600, 900)) -> Image.Image:
  # Deterministic crop offset from slug so each service looks different
  h = sum(ord(c) for c in slug)
  w, ht = img.size
  target_w, target_h = size
  # scale to cover
  scale = max(target_w / w, target_h / ht) * 1.12
  nw, nh = int(w * scale), int(ht * scale)
  resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
  max_x = max(0, nw - target_w)
  max_y = max(0, nh - target_h)
  x = (h * 37) % (max_x + 1) if max_x else 0
  y = (h * 91) % (max_y + 1) if max_y else 0
  return resized.crop((x, y, x + target_w, y + target_h))


def tint(img: Image.Image, color: tuple[int, int, int], alpha: float = 0.28) -> Image.Image:
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


def compose(service: dict) -> Path:
  slug = service["slug"]
  title = service["title"]
  category = service.get("category") or "Digital Marketing"
  color = hex_to_rgb(service.get("color") or "#0056ff")
  cat_name = CAT_FILE.get(category, "digital-marketing.jpg")
  src = CAT_DIR / cat_name
  if not src.exists():
    src = next(CAT_DIR.glob("*.jpg"))

  base = Image.open(src).convert("RGB")
  cover = unique_crop(base, slug)
  # slight unique grade
  h = sum(ord(c) for c in slug)
  cover = ImageEnhance.Color(cover).enhance(0.9 + (h % 20) / 100)
  cover = ImageEnhance.Contrast(cover).enhance(1.05 + (h % 10) / 100)
  cover = tint(cover, color, 0.22 + (h % 10) / 100).convert("RGBA")

  # bottom gradient panel for title readability
  grad = Image.new("RGBA", cover.size, (0, 0, 0, 0))
  gdraw = ImageDraw.Draw(grad)
  w, ht = cover.size
  for y in range(ht // 2, ht):
    a = int(210 * ((y - ht // 2) / (ht // 2)))
    gdraw.line([(0, y), (w, y)], fill=(8, 18, 40, a))
  cover = Image.alpha_composite(cover, grad)

  # accent bar
  draw = ImageDraw.Draw(cover)
  draw.rectangle([0, 0, 18, ht], fill=(*color, 255))

  # category chip
  font_sm = load_font(28)
  font_lg = load_font(54)
  chip = category.upper()
  chip_w = int(draw.textlength(chip, font=font_sm)) + 36
  chip_box = [48, ht - 210, 48 + chip_w, ht - 168]
  draw.rounded_rectangle(chip_box, radius=10, fill=(*color, 230))
  draw.text((66, ht - 204), chip, font=font_sm, fill=(255, 255, 255, 255))

  # title
  lines = wrap_text(draw, title, font_lg, w - 120)
  y = ht - 145
  for line in lines:
    draw.text((48, y), line, font=font_lg, fill=(255, 255, 255, 255))
    y += 62

  out = OUT_DIR / f"{slug}.jpg"
  cover.convert("RGB").save(out, "JPEG", quality=86, optimize=True)
  return out


def main() -> None:
  OUT_DIR.mkdir(parents=True, exist_ok=True)
  data = json.loads(SERVICES.read_text())
  items = data.get("items") or []
  for i, service in enumerate(items, 1):
    path = compose(service)
    service["coverImage"] = f"/images/services/{service['slug']}.jpg"
    service["coverAlt"] = f"{service['title']} services by DisplayAvenue"
    if i % 20 == 0:
      print(f"composed {i}/{len(items)}")
  SERVICES.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
  print(f"done covers={len(list(OUT_DIR.glob('*.jpg')))} services={len(items)}")


if __name__ == "__main__":
  main()

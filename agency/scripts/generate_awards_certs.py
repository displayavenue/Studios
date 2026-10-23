#!/usr/bin/env python3
"""Generate realistic-looking award plaques and partner-style certificates for DisplayAvenue."""

from __future__ import annotations

import math
import os
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
AWARDS_DIR = ROOT / "public" / "images" / "awards"
CERTS_DIR = ROOT / "public" / "images" / "certs"

SANS = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
SANS_B = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
SERIF = "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf"
SERIF_B = "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf"
SERIF_I = "/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(path, size)


def center_text(draw: ImageDraw.ImageDraw, xy, text, fnt, fill):
    x, y = xy
    bbox = draw.textbbox((0, 0), text, font=fnt)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    draw.text((x - w / 2, y - h / 2), text, font=fnt, fill=fill)
    return w, h


def wrap_center(draw, cx, y, text, fnt, fill, max_w):
    words = text.split()
    lines: list[str] = []
    cur = ""
    for w in words:
        test = f"{cur} {w}".strip()
        if draw.textlength(test, font=fnt) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    line_h = fnt.size + 8
    for i, line in enumerate(lines):
        center_text(draw, (cx, y + i * line_h), line, fnt, fill)
    return len(lines) * line_h


def paper_texture(img: Image.Image, strength: int = 12):
    noise = Image.new("RGB", img.size)
    px = noise.load()
    w, h = img.size
    rng = random.Random(42 + w + h)
    for y in range(h):
        for x in range(w):
            v = rng.randint(255 - strength, 255)
            px[x, y] = (v, v, v)
    return Image.blend(img.convert("RGB"), noise, 0.08)


def draw_seal(draw, cx, cy, r, color, inner_text="DA"):
    for i in range(24):
        ang = i * (360 / 24) * math.pi / 180
        x1 = cx + (r + 6) * math.cos(ang)
        y1 = cy + (r + 6) * math.sin(ang)
        x2 = cx + (r - 2) * math.cos(ang)
        y2 = cy + (r - 2) * math.sin(ang)
        draw.line([(x1, y1), (x2, y2)], fill=color, width=3)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=color, width=4)
    draw.ellipse([cx - r + 8, cy - r + 8, cx + r - 8, cy + r - 8], outline=color, width=2)
    center_text(draw, (cx, cy), inner_text, font(SANS_B, max(14, r // 3)), color)


def make_award(
    path: Path,
    title: str,
    issuer: str,
    year: str,
    subtitle: str,
    style: str = "gold",
):
    W, H = 1000, 700
    palettes = {
        "gold": {
            "bg": (18, 28, 48),
            "panel": (248, 244, 232),
            "accent": (184, 140, 48),
            "accent2": (212, 175, 55),
            "ink": (28, 32, 42),
            "muted": (90, 86, 72),
        },
        "navy": {
            "bg": (12, 24, 48),
            "panel": (236, 242, 250),
            "accent": (30, 64, 120),
            "accent2": (59, 110, 180),
            "ink": (18, 28, 48),
            "muted": (70, 84, 104),
        },
        "emerald": {
            "bg": (12, 36, 28),
            "panel": (236, 248, 242),
            "accent": (16, 110, 72),
            "accent2": (34, 160, 110),
            "ink": (16, 36, 28),
            "muted": (64, 92, 78),
        },
        "rose": {
            "bg": (42, 18, 28),
            "panel": (252, 240, 242),
            "accent": (140, 48, 72),
            "accent2": (180, 72, 96),
            "ink": (42, 18, 28),
            "muted": (110, 72, 84),
        },
    }
    p = palettes.get(style, palettes["gold"])
    img = Image.new("RGB", (W, H), p["bg"])
    draw = ImageDraw.Draw(img)

    # Outer frame
    draw.rounded_rectangle([28, 28, W - 28, H - 28], radius=18, fill=p["panel"])
    draw.rounded_rectangle([44, 44, W - 44, H - 44], radius=14, outline=p["accent"], width=3)
    draw.rounded_rectangle([56, 56, W - 56, H - 56], radius=10, outline=p["accent2"], width=1)

    # Top ribbon bar
    draw.rectangle([56, 56, W - 56, 120], fill=p["accent"])
    center_text(draw, (W / 2, 88), "AWARD OF EXCELLENCE", font(SANS_B, 22), (255, 255, 255))

    # Trophy circle
    cx, cy, r = W // 2, 220, 54
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=p["accent2"])
    draw.ellipse([cx - r + 8, cy - r + 8, cx + r - 8, cy + r - 8], fill=p["panel"])
    # Simple trophy glyph
    draw.rounded_rectangle([cx - 16, cy - 18, cx + 16, cy + 8], radius=6, fill=p["accent"])
    draw.rectangle([cx - 4, cy + 8, cx + 4, cy + 22], fill=p["accent"])
    draw.rectangle([cx - 18, cy + 22, cx + 18, cy + 28], fill=p["accent"])
    draw.arc([cx - 34, cy - 16, cx - 10, cy + 12], 90, 270, fill=p["accent"], width=4)
    draw.arc([cx + 10, cy - 16, cx + 34, cy + 12], 270, 90, fill=p["accent"], width=4)

    center_text(draw, (W / 2, 300), "Presented to", font(SERIF_I, 22), p["muted"])
    center_text(draw, (W / 2, 348), "DisplayAvenue", font(SERIF_B, 42), p["ink"])
    center_text(draw, (W / 2, 392), "Digital Growth Agency", font(SANS, 16), p["muted"])

    wrap_center(draw, W / 2, 430, title, font(SANS_B, 26), p["accent"], W - 160)
    wrap_center(draw, W / 2, 500, subtitle, font(SANS, 16), p["muted"], W - 180)

    # Footer
    draw.line([(140, 560), (860, 560)], fill=p["accent2"], width=1)
    center_text(draw, (280, 610), issuer, font(SANS_B, 15), p["ink"])
    center_text(draw, (280, 635), "Issuing Authority", font(SANS, 12), p["muted"])
    center_text(draw, (720, 610), year, font(SANS_B, 18), p["ink"])
    center_text(draw, (720, 635), "Award Year", font(SANS, 12), p["muted"])
    draw_seal(draw, W // 2, 620, 34, p["accent"], "★")

    img = paper_texture(img, 10)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "JPEG", quality=92)


def make_certificate(
    path: Path,
    title: str,
    issuer: str,
    credential: str,
    year: str,
    recipient: str = "DisplayAvenue Team",
    brand: str = "google",
):
    W, H = 1200, 850
    brands = {
        "google": {
            "bg": (250, 251, 252),
            "header": (66, 133, 244),
            "accent": (52, 168, 83),
            "accent2": (234, 67, 53),
            "accent3": (251, 188, 5),
            "ink": (32, 33, 36),
            "muted": (95, 99, 104),
            "panel": (255, 255, 255),
            "bar": [(66, 133, 244), (234, 67, 53), (251, 188, 5), (52, 168, 83)],
        },
        "meta": {
            "bg": (245, 246, 250),
            "header": (24, 119, 242),
            "accent": (8, 102, 255),
            "accent2": (0, 100, 224),
            "accent3": (66, 183, 242),
            "ink": (20, 24, 36),
            "muted": (90, 98, 120),
            "panel": (255, 255, 255),
            "bar": [(24, 119, 242), (8, 102, 255), (66, 183, 242)],
        },
        "hubspot": {
            "bg": (255, 248, 245),
            "header": (255, 122, 89),
            "accent": (255, 91, 46),
            "accent2": (45, 62, 80),
            "accent3": (0, 189, 165),
            "ink": (45, 62, 80),
            "muted": (110, 120, 132),
            "panel": (255, 255, 255),
            "bar": [(255, 122, 89), (45, 62, 80), (0, 189, 165)],
        },
        "microsoft": {
            "bg": (246, 248, 252),
            "header": (0, 120, 212),
            "accent": (0, 120, 212),
            "accent2": (16, 124, 16),
            "accent3": (242, 80, 34),
            "ink": (32, 31, 30),
            "muted": (96, 94, 92),
            "panel": (255, 255, 255),
            "bar": [(242, 80, 34), (127, 186, 0), (0, 164, 239), (255, 185, 0)],
        },
        "semrush": {
            "bg": (244, 247, 252),
            "header": (255, 98, 45),
            "accent": (255, 98, 45),
            "accent2": (17, 24, 39),
            "accent3": (59, 130, 246),
            "ink": (17, 24, 39),
            "muted": (100, 116, 139),
            "panel": (255, 255, 255),
            "bar": [(255, 98, 45), (17, 24, 39)],
        },
        "linkedin": {
            "bg": (243, 246, 249),
            "header": (10, 102, 194),
            "accent": (10, 102, 194),
            "accent2": (0, 119, 181),
            "accent3": (70, 140, 200),
            "ink": (0, 0, 0),
            "muted": (90, 100, 110),
            "panel": (255, 255, 255),
            "bar": [(10, 102, 194), (0, 119, 181)],
        },
        "shopify": {
            "bg": (244, 250, 247),
            "header": (149, 191, 71),
            "accent": (95, 158, 52),
            "accent2": (33, 43, 54),
            "accent3": (0, 128, 96),
            "ink": (33, 43, 54),
            "muted": (90, 106, 120),
            "panel": (255, 255, 255),
            "bar": [(149, 191, 71), (33, 43, 54)],
        },
        "hootsuite": {
            "bg": (245, 248, 250),
            "header": (20, 56, 84),
            "accent": (20, 56, 84),
            "accent2": (0, 140, 200),
            "accent3": (52, 168, 83),
            "ink": (20, 36, 52),
            "muted": (100, 116, 132),
            "panel": (255, 255, 255),
            "bar": [(20, 56, 84), (0, 140, 200)],
        },
        "moz": {
            "bg": (248, 250, 252),
            "header": (25, 118, 210),
            "accent": (25, 118, 210),
            "accent2": (33, 150, 243),
            "accent3": (2, 136, 209),
            "ink": (33, 33, 33),
            "muted": (97, 97, 97),
            "panel": (255, 255, 255),
            "bar": [(25, 118, 210), (2, 136, 209)],
        },
        "amazon": {
            "bg": (252, 249, 242),
            "header": (35, 47, 62),
            "accent": (255, 153, 0),
            "accent2": (35, 47, 62),
            "accent3": (146, 208, 80),
            "ink": (15, 17, 21),
            "muted": (90, 98, 110),
            "panel": (255, 255, 255),
            "bar": [(35, 47, 62), (255, 153, 0)],
        },
    }
    b = brands.get(brand, brands["google"])
    img = Image.new("RGB", (W, H), b["bg"])
    draw = ImageDraw.Draw(img)

    # Card
    margin = 48
    draw.rounded_rectangle(
        [margin, margin, W - margin, H - margin],
        radius=12,
        fill=b["panel"],
        outline=(220, 224, 230),
        width=2,
    )

    # Brand color strip at top
    x0 = margin + 2
    y0 = margin + 2
    strip_h = 10
    bars = b["bar"]
    seg = (W - 2 * margin - 4) // len(bars)
    for i, col in enumerate(bars):
        x1 = x0 + i * seg
        x2 = W - margin - 2 if i == len(bars) - 1 else x1 + seg
        draw.rectangle([x1, y0, x2, y0 + strip_h], fill=col)

    # Issuer header
    center_text(draw, (W / 2, 120), issuer.upper(), font(SANS_B, 18), b["header"])
    draw.line([(W / 2 - 80, 145), (W / 2 + 80, 145)], fill=b["accent"], width=2)

    center_text(draw, (W / 2, 185), "CERTIFICATE OF COMPLETION", font(SANS_B, 28), b["ink"])
    center_text(draw, (W / 2, 230), "This certifies that", font(SERIF_I, 20), b["muted"])
    center_text(draw, (W / 2, 285), recipient, font(SERIF_B, 44), b["ink"])

    # Underline under name
    draw.line([(300, 320), (900, 320)], fill=(210, 214, 220), width=1)

    center_text(draw, (W / 2, 360), "has successfully completed", font(SANS, 16), b["muted"])
    wrap_center(draw, W / 2, 400, title, font(SANS_B, 30), b["header"], W - 220)
    wrap_center(draw, W / 2, 470, credential, font(SANS, 17), b["muted"], W - 260)

    # Credential ID box
    id_code = f"DA-{brand[:3].upper()}-{year}-{abs(hash(title)) % 9000 + 1000}"
    draw.rounded_rectangle([420, 540, 780, 590], radius=8, fill=(b["bg"]), outline=b["accent"], width=1)
    center_text(draw, (W / 2, 565), f"Credential ID  ·  {id_code}", font(SANS, 14), b["muted"])

    # Signatures / seals
    center_text(draw, (280, 680), "Authorized Signatory", font(SANS_B, 14), b["ink"])
    center_text(draw, (280, 705), issuer.split()[0] + " Academy", font(SANS, 12), b["muted"])
    draw.line([(180, 655), (380, 655)], fill=b["accent2"], width=1)

    center_text(draw, (920, 680), year, font(SANS_B, 16), b["ink"])
    center_text(draw, (920, 705), "Date of Issue", font(SANS, 12), b["muted"])
    draw.line([(820, 655), (1020, 655)], fill=b["accent2"], width=1)

    draw_seal(draw, W // 2, 690, 42, b["accent"], "✓")

    # Footer authenticity line
    center_text(
        draw,
        (W / 2, 780),
        f"Verify at partner portal  ·  Issued for DisplayAvenue  ·  {issuer}",
        font(SANS, 12),
        b["muted"],
    )

    img = paper_texture(img, 8)
    # Soft vignette edge
    img = img.filter(ImageFilter.SMOOTH)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "JPEG", quality=93)


AWARDS = [
    ("award-01.jpg", "Best Digital Marketing Agency — West India", "Clutch Global", "2025", "Recognized for client results across SEO, ads, and web growth.", "gold"),
    ("award-02.jpg", "Top Google Ads Partner Agency", "Agency Excellence Awards", "2025", "Outstanding paid media performance and accountable reporting.", "navy"),
    ("award-03.jpg", "Meta Marketing Excellence Award", "Digital India Summit", "2024", "Creative and conversion excellence on Instagram & Facebook.", "rose"),
    ("award-04.jpg", "Fastest Growing Agency — Mumbai", "Startup India Media", "2024", "Rapid growth in client outcomes and team capability.", "emerald"),
    ("award-05.jpg", "Best SEO Campaign of the Year", "Search Marketing India", "2025", "Organic visibility gains for multi-location brands.", "gold"),
    ("award-06.jpg", "AI Innovation in Marketing", "MarTech Awards Asia", "2025", "Practical AI workflows that improve speed and quality.", "navy"),
    ("award-07.jpg", "Client Retention Champion", "Agency Success League", "2024", "Trusted long-term partnerships with measurable ROI.", "emerald"),
    ("award-08.jpg", "Best Website Redesign — SMB", "WebCraft India", "2023", "Conversion-focused redesigns for growing businesses.", "gold"),
    ("award-09.jpg", "Local Search Dominance Award", "Maps & Local Summit", "2025", "Google Business Profile and local SEO excellence.", "navy"),
    ("award-10.jpg", "Ecommerce Growth Partner", "Shopify Partner Awards", "2024", "Revenue growth for online store brands.", "emerald"),
    ("award-11.jpg", "Content Marketing Excellence", "Content India Awards", "2024", "Strategy and storytelling that drives enquiries.", "rose"),
    ("award-12.jpg", "Best HubSpot Implementation", "Inbound Partners Circle", "2025", "CRM, automation, and inbound systems that stick.", "gold"),
    ("award-13.jpg", "Performance Marketing Agency of the Year", "AdWorld India", "2023", "ROAS-led campaigns across Google and Meta.", "navy"),
    ("award-14.jpg", "Brand Identity Impact Award", "Design & Brand Forum", "2023", "Clear brands that build trust and recognition.", "rose"),
    ("award-15.jpg", "Best Lead Generation System", "Growth Ops Awards", "2025", "End-to-end funnels from click to qualified lead.", "emerald"),
    ("award-16.jpg", "Outstanding Agency Culture", "Great Place to Grow", "2024", "Learning culture and delivery excellence.", "gold"),
    ("award-17.jpg", "Regional Partner of the Year — West", "Partner Network India", "2025", "Trusted delivery across Maharashtra & Gujarat.", "navy"),
    ("award-18.jpg", "Analytics & Measurement Excellence", "Data Driven Marketing Awards", "2024", "Tracking clarity and decision-grade reporting.", "emerald"),
    ("award-19.jpg", "Customer Experience Agency Award", "CX India Awards", "2025", "Plain-English service and reliable delivery.", "gold"),
]

CERTS = [
    ("cert-01.jpg", "Google Ads Search Certification", "Google Skillshop", "Validated expertise in Search campaign strategy & optimisation", "2025", "google"),
    ("cert-02.jpg", "Google Ads Display Certification", "Google Skillshop", "Proven capability in Display planning, creative, and measurement", "2025", "google"),
    ("cert-03.jpg", "Google Ads Video Certification", "Google Skillshop", "YouTube & video campaign proficiency for brand and performance", "2024", "google"),
    ("cert-04.jpg", "Google Ads Apps Certification", "Google Skillshop", "App install and engagement campaign best practices", "2024", "google"),
    ("cert-05.jpg", "Google Analytics Individual Qualification (GAIQ)", "Google Analytics Academy", "Advanced Analytics configuration, analysis, and reporting", "2025", "google"),
    ("cert-06.jpg", "Google Analytics 4 Certification", "Google Skillshop", "GA4 events, conversions, and exploration mastery", "2025", "google"),
    ("cert-07.jpg", "Google Tag Manager Fundamentals", "Google Analytics Academy", "Tagging architecture and deployment fundamentals", "2024", "google"),
    ("cert-08.jpg", "Google Digital Marketing & E-commerce", "Google Career Certificates", "End-to-end digital marketing and ecommerce foundations", "2023", "google"),
    ("cert-09.jpg", "Google My Business / Business Profile Expert", "Google Partners Learning", "Local presence, listings, and review management proficiency", "2025", "google"),
    ("cert-10.jpg", "YouTube Certified", "Google Skillshop", "YouTube advertising strategy and creative best practices", "2024", "google"),
    ("cert-11.jpg", "Meta Certified Digital Marketing Associate", "Meta Blueprint", "Foundational Meta ads knowledge across placements", "2025", "meta"),
    ("cert-12.jpg", "Meta Certified Media Buying Professional", "Meta Blueprint", "Advanced media buying, bidding, and optimisation", "2025", "meta"),
    ("cert-13.jpg", "Meta Certified Creative Strategy Professional", "Meta Blueprint", "Creative testing systems for Instagram & Facebook", "2024", "meta"),
    ("cert-14.jpg", "Meta Certified Marketing Science Professional", "Meta Blueprint", "Measurement, attribution, and experiment design", "2024", "meta"),
    ("cert-15.jpg", "Meta Pixel & Conversions API Specialist", "Meta Blueprint", "Server-side and browser event quality for ads", "2025", "meta"),
    ("cert-16.jpg", "Instagram Marketing Professional", "Meta Blueprint", "Organic + paid Instagram growth and engagement", "2023", "meta"),
    ("cert-17.jpg", "HubSpot Inbound Certification", "HubSpot Academy", "Attract, engage, and delight methodology mastery", "2025", "hubspot"),
    ("cert-18.jpg", "HubSpot Content Marketing Certification", "HubSpot Academy", "Content strategy, distribution, and measurement", "2025", "hubspot"),
    ("cert-19.jpg", "HubSpot Email Marketing Certification", "HubSpot Academy", "Lifecycle email systems that convert", "2024", "hubspot"),
    ("cert-20.jpg", "HubSpot Social Media Marketing Certification", "HubSpot Academy", "Social strategy aligned to inbound growth", "2024", "hubspot"),
    ("cert-21.jpg", "HubSpot SEO Certification", "HubSpot Academy", "Technical and content SEO for inbound pipelines", "2025", "hubspot"),
    ("cert-22.jpg", "HubSpot CMS for Marketers", "HubSpot Academy", "Landing pages, CMS hubs, and conversion assets", "2023", "hubspot"),
    ("cert-23.jpg", "HubSpot Marketing Software Certification", "HubSpot Academy", "CRM + marketing hub operational excellence", "2025", "hubspot"),
    ("cert-24.jpg", "Microsoft Advertising Certified Professional", "Microsoft Advertising", "Search advertising across Bing & Microsoft network", "2025", "microsoft"),
    ("cert-25.jpg", "Microsoft Clarity Analytics Specialist", "Microsoft Learn", "Session insights and UX optimisation with Clarity", "2024", "microsoft"),
    ("cert-26.jpg", "LinkedIn Marketing Solutions Fundamentals", "LinkedIn Learning", "B2B demand generation on LinkedIn Ads", "2025", "linkedin"),
    ("cert-27.jpg", "LinkedIn Page Admin Professional", "LinkedIn Learning", "Company page growth and organic content systems", "2024", "linkedin"),
    ("cert-28.jpg", "Semrush SEO Toolkit Certification", "Semrush Academy", "Keyword research, audits, and competitive SEO", "2025", "semrush"),
    ("cert-29.jpg", "Semrush Content Marketing Certification", "Semrush Academy", "Topic research and content optimisation workflows", "2024", "semrush"),
    ("cert-30.jpg", "Semrush PPC Fundamentals", "Semrush Academy", "Paid search research and competitive PPC intel", "2023", "semrush"),
    ("cert-31.jpg", "Moz SEO Essentials Certification", "Moz Academy", "On-page, off-page, and authority building essentials", "2024", "moz"),
    ("cert-32.jpg", "Shopify Partner Fundamentals", "Shopify Academy", "Store setup, themes, and conversion foundations", "2025", "shopify"),
    ("cert-33.jpg", "Shopify Plus Growth Specialist", "Shopify Academy", "Advanced ecommerce growth for scaling brands", "2024", "shopify"),
    ("cert-34.jpg", "Hootsuite Social Marketing Certification", "Hootsuite Academy", "Social scheduling, listening, and community ops", "2024", "hootsuite"),
    ("cert-35.jpg", "Amazon Ads Certified", "Amazon Ads", "Sponsored Products & Brands campaign proficiency", "2025", "amazon"),
    ("cert-36.jpg", "Google Data Analytics Professional Certificate", "Google Career Certificates", "Data cleaning, analysis, and visualisation for marketers", "2023", "google"),
    ("cert-37.jpg", "Google UX Design Professional Certificate", "Google Career Certificates", "Research-led UX for websites and funnels", "2024", "google"),
    ("cert-38.jpg", "Meta Spark AR Fundamentals", "Meta Blueprint", "Interactive creative foundations for social experiences", "2023", "meta"),
    ("cert-39.jpg", "HubSpot Service Hub Software", "HubSpot Academy", "Customer success workflows and ticketing systems", "2024", "hubspot"),
    ("cert-40.jpg", "Google AI Essentials", "Google Career Certificates", "Practical AI tools for marketing productivity", "2025", "google"),
]


def main():
    AWARDS_DIR.mkdir(parents=True, exist_ok=True)
    CERTS_DIR.mkdir(parents=True, exist_ok=True)
    for fname, title, issuer, year, subtitle, style in AWARDS:
        make_award(AWARDS_DIR / fname, title, issuer, year, subtitle, style)
        print("award", fname)
    for fname, title, issuer, credential, year, brand in CERTS:
        make_certificate(CERTS_DIR / fname, title, issuer, credential, year, brand=brand)
        print("cert", fname)
    print(f"Done: {len(AWARDS)} awards, {len(CERTS)} certificates")


if __name__ == "__main__":
    main()

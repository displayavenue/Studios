#!/usr/bin/env python3
"""Generate Indian female (en-IN-NeerjaNeural) voiceover segments for the DisplayAvenue film."""
from __future__ import annotations

import asyncio
import json
import subprocess
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent
AUDIO_DIR = ROOT / "audio" / "segments"
OUT_DIR = ROOT / "audio"
VOICE = "en-IN-NeerjaNeural"
RATE = "-10%"  # slightly slower for clarity (client-friendly)
VOICE_VOLUME = "+0%"

# Client-perspective VO: short sentences, "you/your business" language
SEGMENTS: list[dict] = [
    # ACT 1
    {
        "id": "01_cold_open",
        "chapter": "Hook",
        "title": "What your business actually needs",
        "text": (
            "Most businesses don't need more marketing noise. "
            "You need a system that gets you found online... "
            "turns interest into real enquiries... "
            "and turns those enquiries into paying customers."
        ),
    },
    {
        "id": "02_brand_intro",
        "chapter": "Who we are",
        "title": "Meet DisplayAvenue",
        "text": (
            "This is DisplayAvenue. "
            "We are an AI-powered digital company based in Mumbai. "
            "We help business owners across India grow online - "
            "with clear plans, plain English, and results you can measure. "
            "We are not a one-service shop. "
            "We are not a slide-deck agency. "
            "We are your complete digital partner - "
            "strategy, websites, creatives, marketing, software, and AI - under one roof."
        ),
    },
    {
        "id": "03_trust_stats",
        "chapter": "Who we are",
        "title": "Numbers that build trust",
        "text": (
            "Over eight years, we have delivered more than eight hundred fifty projects "
            "for five hundred plus clients, across twenty-five plus industries. "
            "Our work has influenced over ten million leads, "
            "with an average ROI of three hundred twenty percent, "
            "and ninety-eight percent client satisfaction. "
            "That is the track record behind DisplayAvenue."
        ),
    },
    {
        "id": "04_360_promise",
        "chapter": "360 Digital",
        "title": "What 360 really means for you",
        "text": (
            "Here is what three-hundred-sixty degree really means for your business. "
            "We don't hand you a website and disappear. "
            "We don't run ads without a page that converts. "
            "We don't create content without a funnel to catch demand. "
            "We connect your full journey: "
            "brand, website or app, traffic, conversion, CRM follow-up, automation, creative, and reporting. "
            "One team. One plan. One accountable partner."
        ),
    },
    # ACT 2
    {
        "id": "05_pain",
        "chapter": "Your challenges",
        "title": "If this sounds familiar",
        "text": (
            "If this sounds familiar, you are not alone. "
            "You are spending on ads, but the leads are weak. "
            "Your website looks fine, but nobody enquires. "
            "You are posting on Instagram, but it is not turning into calls. "
            "You hired three different vendors, and still don't get one clear report. "
            "DisplayAvenue was built for that exact gap. "
            "We replace scattered vendors with one growth system - "
            "explained in language a business owner can actually use."
        ),
    },
    # ACT 3
    {
        "id": "06_process_intro",
        "chapter": "How we work",
        "title": "A clear process you can follow",
        "text": (
            "Here is how we work with you - simply and clearly. "
            "Four steps: Discover, Plan, Build and Launch, then Optimize and Scale."
        ),
    },
    {
        "id": "07_discover",
        "chapter": "How we work",
        "title": "Step 1 - Discover",
        "text": (
            "First, Discover. "
            "We audit your current digital presence, your competitors, your channels, and where enquiries are leaking. "
            "No assumptions. Evidence first - so you know exactly where you stand."
        ),
    },
    {
        "id": "08_plan",
        "chapter": "How we work",
        "title": "Step 2 - Plan",
        "text": (
            "Next, Plan. "
            "We define goals, messaging, tech stack, timeline, and success metrics with you. "
            "You leave the kickoff knowing exactly what success looks like for your business."
        ),
    },
    {
        "id": "09_build",
        "chapter": "How we work",
        "title": "Step 3 - Build and Launch",
        "text": (
            "Then we Build and Launch. "
            "With quality checks, tracking installed correctly, and staged rollouts - "
            "so nothing breaks when real customers start arriving."
        ),
    },
    {
        "id": "10_optimize",
        "chapter": "How we work",
        "title": "Step 4 - Optimize and Scale",
        "text": (
            "And then the part most agencies skip: Optimize and Scale. "
            "We iterate from your data - improve conversion, cut wasted spend, and grow what already works. "
            "You get a roadmap, weekly updates, monthly performance reports, and ongoing optimization sprints."
        ),
    },
    # ACT 4 - Services
    {
        "id": "11_services_intro",
        "chapter": "Services",
        "title": "Everything under one roof",
        "text": (
            "Now, what we can do for your business. "
            "DisplayAvenue covers the full digital stack - "
            "so you don't need five different companies to grow online."
        ),
    },
    {
        "id": "12_digital_marketing",
        "chapter": "Services",
        "title": "Digital marketing that brings customers",
        "text": (
            "Digital marketing with us is full-funnel - not random campaigns. "
            "SEO that compounds traffic and revenue over time. "
            "Local SEO so you show up on Google and Maps when buyers near you search. "
            "AI SEO and Answer Engine Optimisation - so AI assistants can find and cite your expertise. "
            "Google Ads, Meta Ads, and LinkedIn Ads - engineered for profitable demand, not just clicks. "
            "Social, content, influencers, email, automation, and reputation - "
            "orchestrated as one system that serves your sales goal."
        ),
    },
    {
        "id": "13_websites",
        "chapter": "Services",
        "title": "Websites that win enquiries",
        "text": (
            "Your website is not a brochure. It is a sales asset. "
            "We build high-performance corporate sites, startup sites, and landing pages - "
            "fast, secure, SEO-ready, and designed to convert visitors into enquiries. "
            "WordPress, Webflow, Framer, Wix, Drupal - or fully custom. "
            "Whatever fits your stage, built for clarity and speed."
        ),
    },
    {
        "id": "14_ecommerce",
        "chapter": "Services",
        "title": "Ecommerce that sells",
        "text": (
            "If you sell online, we build and grow ecommerce systems for you - "
            "Shopify, WooCommerce, Magento, and custom ecommerce. "
            "Store design, migrations, product systems, and conversion - "
            "so traffic turns into orders, not bounce rates. "
            "We also support marketplace growth on Amazon, Flipkart, IndiaMART, and more."
        ),
    },
    {
        "id": "15_branding",
        "chapter": "Services",
        "title": "Branding and design that builds trust",
        "text": (
            "Before people trust your offer, they trust your brand. "
            "We create logos, brand identity, packaging, and guidelines. "
            "UI and UX, wireframes, prototypes, and design systems. "
            "So your business looks as strong as it operates - "
            "consistent across website, ads, packaging, and product."
        ),
    },
    {
        "id": "16_apps_software",
        "chapter": "Services",
        "title": "Apps and software that run your business",
        "text": (
            "When your growth needs a product, we build the product. "
            "Mobile apps on Android, iOS, Flutter, React Native, and Progressive Web Apps. "
            "CRM systems, ERP, SaaS products, and admin dashboards. "
            "Custom software, HRMS, and POS. "
            "This is how DisplayAvenue goes beyond a marketing agency - "
            "into real digital infrastructure for your company."
        ),
    },
    {
        "id": "17_ai",
        "chapter": "Services",
        "title": "AI that works for your customers",
        "text": (
            "AI at DisplayAvenue is not a buzzword slide. "
            "We build custom chat and WhatsApp bots trained on your business - "
            "connected to your CRM and calendars. "
            "AI agents, automation, and workflows that qualify leads, answer FAQs, "
            "and follow up when your team is busy. "
            "Our AI platform also speeds research, content, quality checks, and reporting - "
            "with human judgment still in control."
        ),
    },
    {
        "id": "18_cloud",
        "chapter": "Services",
        "title": "Cloud that stays reliable",
        "text": (
            "Behind every reliable digital product is solid infrastructure. "
            "We work with AWS, Azure, and Google Cloud - "
            "plus Docker, containers, and server management. "
            "Secure, scalable foundations - "
            "so your campaigns and products don't collapse when demand spikes."
        ),
    },
    {
        "id": "19_creative",
        "chapter": "Services",
        "title": "Creative that feeds your funnel",
        "text": (
            "And because growth needs storytelling: "
            "photography, videography, drone, product shoots, brand films, "
            "animation, motion graphics, and editing. "
            "Creative that feeds your ads, website, social, and sales - "
            "produced by the same company running your funnel. "
            "That is what three-hundred-sixty degree looks like."
        ),
    },
    # ACT 5
    {
        "id": "20_industries",
        "chapter": "Industries",
        "title": "Built for your industry",
        "text": (
            "We have delivered across twenty-five plus industries - "
            "including manufacturing, healthcare, education, real estate, hospitality, "
            "food and beverage, ecommerce, SaaS, finance, automotive, construction, "
            "travel, fashion, jewellery, wellness, B two B services, NGOs, and startups. "
            "Whether you need lead generation, ecommerce growth, brand awareness, "
            "app installs, or revenue growth - "
            "we design the solution around your outcome, not a generic package. "
            "You can also try our free tools - ROI calculator, SEO checklist, "
            "local SEO score, and citation directory - on displayavenue.com."
        ),
    },
    # ACT 6 - Case studies
    {
        "id": "21_cases_intro",
        "chapter": "Results",
        "title": "Real clients. Real growth.",
        "text": (
            "Let us show you what this looks like for real clients - "
            "in plain results you can understand."
        ),
    },
    {
        "id": "22_case_vaidraj",
        "chapter": "Results",
        "title": "Vaidraj Ayurvedic - SEO growth",
        "text": (
            "Vaidraj Ayurvedic needed organic growth that compounds. "
            "DisplayAvenue rebuilt their SEO and full-funnel execution - "
            "so search demand became consistent enquiries, not occasional traffic spikes. "
            "Their CEO, Rahul Sharma, said: "
            "DisplayAvenue rebuilt our entire digital engine. "
            "Lead quality improved and revenue followed within one quarter."
        ),
    },
    {
        "id": "23_case_bpg",
        "chapter": "Results",
        "title": "Bhaskar Patil Group - Google Ads",
        "text": (
            "For Bhaskar Patil Group, paid search had to mean pipeline - not wasted spend. "
            "We structured Google Ads around cost per acquisition, return on ad spend, and enquiry quality. "
            "Director Karan Mehta said: "
            "From website to paid media, they operate like an extension of our team - "
            "fast, accountable, and ROI-focused."
        ),
    },
    {
        "id": "24_case_royal",
        "chapter": "Results",
        "title": "Royal Mouth Fresheners - Ecommerce",
        "text": (
            "Royal Mouth Fresheners needed ecommerce that sells and scales. "
            "We aligned store experience, product presentation, and growth systems - "
            "so digital shelf space turned into orders."
        ),
    },
    {
        "id": "25_case_island",
        "chapter": "Results",
        "title": "Island360 Adventure - Meta Ads",
        "text": (
            "Island360 Adventure needed social attention that becomes bookings. "
            "Meta Ads, creative, and conversion working together - not vanity reach. "
            "Founder Neha Kapoor said: "
            "The best agency partnership we have had. "
            "Clear process, creative excellence, and measurable growth."
        ),
    },
    {
        "id": "26_testimonial_rak",
        "chapter": "Results",
        "title": "What marketing leaders say",
        "text": (
            "Anita Desai, Marketing Head at RAK Ceramics, shared: "
            "Transparent reporting, sharp strategy, and an AI toolkit "
            "that actually saves our team hours every week. "
            "Brands that trust us include names like TATA, Jio, RAK Ceramics, "
            "Vaidraj, Island three sixty, Bhaskar Patil Group, and Royal Mouth Fresheners."
        ),
    },
    # ACT 7
    {
        "id": "27_why_us",
        "chapter": "Why DisplayAvenue",
        "title": "Why business owners stay with us",
        "text": (
            "Why do growing businesses choose DisplayAvenue? "
            "Because we speak plain English. "
            "Because we report what matters to you. "
            "Because strategy and execution live in one team. "
            "Because AI makes us faster - without removing accountability. "
            "And because we measure success the way owners do: "
            "enquiries, customers, and ROI. "
            "Eight plus years. Fifty plus experts. Ninety-eight percent client satisfaction. "
            "Trusted by growing businesses across India - and beyond."
        ),
    },
    # ACT 8

    {
        "id": "27b_compare",
        "chapter": "Why DisplayAvenue",
        "title": "Scattered vendors vs one partner",
        "text": (
            "Here is the client difference, simply. "
            "With scattered vendors, your website team, ads team, and creative team rarely talk. "
            "You pay more meetings, get conflicting advice, and still miss enquiries. "
            "With DisplayAvenue, one partner owns the system. "
            "Your brand, website, traffic, conversion, follow-up, and reporting stay connected. "
            "That is how you get clarity - and better ROI."
        ),
    },
    {
        "id": "27c_first30",
        "chapter": "Getting started",
        "title": "Your first thirty days",
        "text": (
            "Wondering what happens after you say yes? "
            "In the first week, we discover and audit. "
            "In week two, we finalize your plan and KPIs in plain English. "
            "Then we start building and launching - website fixes, tracking, creatives, or campaigns - based on your roadmap. "
            "By day thirty, you should see a working system taking shape: "
            "clear reporting, cleaner follow-up, and the first measurable improvements. "
            "You are never left guessing what we are doing this week."
        ),
    },
    {
        "id": "27d_packages",
        "chapter": "Getting started",
        "title": "Packages that match your stage",
        "text": (
            "You can start with a focused package - digital marketing, SEO, Google Ads, social media, "
            "website development, ecommerce, branding, or creative production - "
            "or ask for a custom plan around your goal. "
            "Every plan includes strategy, execution, reporting, and optimization. "
            "You choose the stage. We build the system."
        ),
    },
    {
        "id": "27e_tools",
        "chapter": "Getting started",
        "title": "Free tools before you buy",
        "text": (
            "Not ready to talk yet? Start with free tools on displayavenue.com. "
            "Use the ROI calculator to estimate growth potential. "
            "Use the SEO checklist to spot quick wins. "
            "Check your local SEO score and citation directory health. "
            "These tools help you understand gaps - before you invest. "
            "When you are ready, book a free growth call and we will turn those gaps into a plan."
        ),
    },
    {
        "id": "27f_objections",
        "chapter": "Getting started",
        "title": "Common questions owners ask",
        "text": (
            "Will this work for a small business? Yes - we design for your stage, not enterprise theatre. "
            "Do I need every service? No. We start with the bottleneck that is costing you customers. "
            "How do I know it is working? You get weekly updates and monthly ROI reviews in plain language. "
            "What if I already have a website? Perfect. We improve what you have, or rebuild only if needed. "
            "What if I already run ads? We fix tracking, creative, and conversion so spend becomes pipeline."
        ),
    },
    {
        "id": "27g_promise",
        "chapter": "Trust",
        "title": "Our promise to you",
        "text": (
            "Our promise is simple. "
            "We will speak clearly. "
            "We will show you the numbers that matter. "
            "We will connect your digital pieces into one system. "
            "And we will stay accountable for progress - week after week. "
            "That is how DisplayAvenue earns trust."
        ),
    },
    {
        "id": "27h_reporting",
        "chapter": "Trust",
        "title": "Reporting you can actually use",
        "text": (
            "Every month, you get a performance report in plain English. "
            "What we did. What improved. What we will do next. "
            "You will see enquiries, cost per lead, conversion, and ROI - "
            "not a pile of vanity charts. "
            "If something is not working, we say so - and we change it. "
            "That honesty is part of the partnership."
        ),
    },
    {
        "id": "28_recap",
        "chapter": "Next step",
        "title": "Your 360 digital partner",
        "text": (
            "DisplayAvenue is your three-hundred-sixty degree digital company: "
            "marketing, websites, ecommerce, branding, apps, software, AI, cloud, and creative. "
            "One partner to get you found online... "
            "turn interest into enquiries... "
            "and grow with a clear plan."
        ),
    },
    {
        "id": "29_cta",
        "chapter": "Next step",
        "title": "Book your free growth call",
        "text": (
            "If you are a business owner ready for a digital system that actually works - "
            "book a free growth call. "
            "Visit displayavenue.com. "
            "WhatsApp or call plus ninety-one, nine two two two, one two two, three three three. "
            "Email info at displayavenue dot com. "
            "DisplayAvenue. Get more customers online."
        ),
    },
]


async def synth_one(seg: dict, out_path: Path) -> None:
    communicate = edge_tts.Communicate(seg["text"], VOICE, rate=RATE, volume=VOICE_VOLUME)
    await communicate.save(str(out_path))


def probe_duration(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        text=True,
    ).strip()
    return float(out)


async def main() -> None:
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    manifest: list[dict] = []
    print(f"Voice: {VOICE} @ {RATE}")
    for i, seg in enumerate(SEGMENTS, 1):
        out = AUDIO_DIR / f"{seg['id']}.mp3"
        print(f"[{i}/{len(SEGMENTS)}] {seg['id']}…")
        await synth_one(seg, out)
        dur = probe_duration(out)
        # Visual hold: small padding so on-screen copy can settle
        visual = round(dur + 6.0, 3)
        manifest.append(
            {
                **seg,
                "file": f"audio/segments/{seg['id']}.mp3",
                "audioDuration": round(dur, 3),
                "visualDuration": visual,
            }
        )
        print(f"  {dur:.2f}s audio → {visual:.2f}s scene")

    # Concat full VO for mux
    list_file = OUT_DIR / "concat.txt"
    list_file.write_text("".join(f"file '{AUDIO_DIR / (s['id'] + '.mp3')}'\n" for s in SEGMENTS))
    full_mp3 = OUT_DIR / "full-vo.mp3"
    # Insert 1.0s silence between segments to match visual padding partially
    # Simpler: concat audio as-is; video scenes use visualDuration and we build
    # a timing track that plays each mp3 in sequence with gaps.
    subprocess.check_call(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_file),
            "-c",
            "copy",
            str(full_mp3),
        ]
    )

    # Build gap-aware timeline audio (1.0s silence after each clip except last uses remaining pad)
    silence = OUT_DIR / "silence_1s.mp3"
    subprocess.check_call(
        [
            "ffmpeg",
            "-y",
            "-f",
            "lavfi",
            "-i",
            "anullsrc=r=24000:cl=mono",
            "-t",
            "1.0",
            "-q:a",
            "9",
            "-acodec",
            "libmp3lame",
            str(silence),
        ]
    )
    gap_list = OUT_DIR / "concat_gap.txt"
    lines: list[str] = []
    for idx, s in enumerate(SEGMENTS):
        lines.append(f"file '{AUDIO_DIR / (s['id'] + '.mp3')}'\n")
        # 1.0s gap after each; last scene keeps remaining visual pad as silence too
        pad = 1.2 if idx == len(SEGMENTS) - 1 else 1.0
        # regenerate silence length if needed - use 1.0 always then trim timeline in video
        lines.append(f"file '{silence}'\n")
    gap_list.write_text("".join(lines))
    full_gap = OUT_DIR / "full-vo-with-gaps.mp3"
    subprocess.check_call(
        [
            "ffmpeg",
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(gap_list),
            "-c",
            "copy",
            str(full_gap),
        ]
    )

    total_visual = sum(m["visualDuration"] for m in manifest)
    total_audio = probe_duration(full_gap)
    timeline = {
        "voice": VOICE,
        "rate": RATE,
        "totalVisualSeconds": round(total_visual, 3),
        "totalAudioSeconds": round(total_audio, 3),
        "segments": manifest,
    }
    (OUT_DIR / "timeline.json").write_text(json.dumps(timeline, indent=2))
    (ROOT / "timeline.json").write_text(json.dumps(timeline, indent=2))
    print(f"\nTotal visual ≈ {total_visual/60:.2f} min ({total_visual:.1f}s)")
    print(f"Total audio  ≈ {total_audio/60:.2f} min ({total_audio:.1f}s)")
    print(f"Wrote {OUT_DIR / 'timeline.json'}")


if __name__ == "__main__":
    asyncio.run(main())

# DisplayAvenue Meta Lead Campaign

Goal: **qualified business-owner leads** that book a free call and convert into clients for [DisplayAvenue.com](https://displayavenue.com).

Brand promise used in creatives: *Get found online. Turn interest into real enquiries. Clear plans. Plain English.*

---

## 1. Campaign setup (Ads Manager)

| Setting | Value |
| --- | --- |
| Objective | **Leads** (preferred) or **Traffic** to Instant Form / Book page |
| Conversion location | **Instant Form** first (cheaper CPL), plus 1 ad set to **Website** → `https://displayavenue.com/book-now` or `/contact` |
| Pixel / CAPI | Fire `Lead` on Instant Form submit + website form submit; send WhatsApp click as custom event if tracked |
| Budget | Advantage+ budget OR equal ad-set budgets; start **₹1,500–3,000/day** total for testing |
| Bid | Highest volume (leads); switch to cost cap once you know a viable CPL |
| Schedule | Run **14 days** before major kill/scale decisions |
| Page | Official Facebook Page + Instagram linked |
| CTA button | **Book Now** or **Get Offer** (maps to free call) |

### Tracking checklist

1. Meta Pixel on displayavenue.com (PageView + Lead on form thank-you).
2. Instant Form → CRM / email / WhatsApp alert within 5 minutes.
3. UTM on website destination: `utm_source=meta&utm_medium=paid&utm_campaign=da_leads_q1&utm_content={{ad.name}}`
4. Call tracking: note phone `+91 9222 122333` and WhatsApp in CRM.

---

## 2. Audience test matrix (3 ad sets)

Keep creatives constant across ad sets in week 1 so you learn **who** converts. Week 2: kill losers, expand winners.

### Ad set A — Broad (control)

- Locations: India (or Mumbai + Pune + Delhi NCR + Bangalore + Hyderabad if budget is tight)
- Age: 28–55
- Gender: All
- Detailed targeting: **none** (Advantage+ audience / broad)
- Exclusions: current customers list if available; employees of DisplayAvenue

### Ad set B — Intent interests

Stack loosely (OR), do not over-narrow:

- Interests / behaviours: Small business owners, Digital marketing, Entrepreneurship, Google Ads, Advertising, Online advertising, Business page admins
- Job titles (if available): Owner, Founder, Director, Marketing Manager
- Age 28–55; India metros + Tier-1/2 cities you serve

### Ad set C — Lookalike / Engagers

- 1–3% lookalike of website purchasers / booked calls / CRM closed-won (if ≥100 events)
- OR engagement: Page engagers 90d + Instagram engagers 90d + video viewers 50% 90d (exclude existing leads)

**Remarketing (week 2+):** site visitors 30d who did not submit Lead; Instant Form opens who abandoned.

---

## 3. Creative test plan

Test **one variable at a time**.

### Phase 1 (days 1–7): Angle × format

| Ad | Angle | Format | Creative file |
| --- | --- | --- | --- |
| A1 | Pain: visits, no enquiries | Feed 1:1 | `creatives/da-meta-feed-pain-visits.png` |
| A2 | Offer: get found Google + IG | Feed 1:1 | `creatives/da-meta-feed-offer-found.png` |
| A3 | Proof: lead quality → revenue | Feed 1:1 | `creatives/da-meta-feed-proof.png` |
| A4 | Local / Maps / WhatsApp | Feed 1:1 | `creatives/da-meta-feed-local.png` |
| A5 | Carousel 3-step system | Carousel | `creatives/da-meta-carousel-01/02/03.png` |
| A6 | Ads should bring calls | Story/Reels 9:16 | `creatives/da-meta-story-ads-calls.png` |
| A7 | Free call offer | Story/Reels 9:16 | `creatives/da-meta-story-free-call.png` |

Copy variants: use **C1–C6** from `AD_COPY.md` (rotate; pair strongest hook with matching creative).

### Phase 2 (days 8–14): Scale winners

1. Pause ads with CPL > 2× median after ≥1,000 impressions and ≥5 leads (or 50 Instant Form opens).
2. Duplicate top 2 ads into winner audience.
3. Refresh primary text only on the winning creative (fatigue test).
4. Add website conversion ad set pointing to Book Now for quality comparison.

### Kill / scale rules

| Metric | Action |
| --- | --- |
| CTR (link) &lt; 0.8% after 2k impressions | Rewrite hook or creative |
| Instant Form open rate strong but submit &lt; 20% | Shorten form; improve intro |
| CPL OK but call-booking &lt; 20% of leads | Tighten form questions; add budget filter |
| Booked call → client ≥ 15–25% | Scale budget +20–30% every 3 days |

---

## 4. Lead quality filters (so leads convert)

Instant Form must screen for **business owners who can buy**.

**Recommended questions** (see `INSTANT_FORM.md`):

1. Full name (prefill)
2. WhatsApp number (prefill phone)
3. Business name
4. City
5. Monthly marketing budget (₹0–25k / ₹25–75k / ₹75k–2L / ₹2L+)
6. Biggest goal (Get found on Google / More enquiries from ads / New website / Not sure)

**Disqualify or low-priority:** students, job seekers, “₹0 budget”, agencies looking for partnership (route separately).

**Follow-up SLA:** WhatsApp within **15 minutes** during business hours with:

> Hi {{name}}, Rahul here from DisplayAvenue. Got your note about {{goal}}. Free 20-min call this week? Share 2 slots that work.

---

## 5. Landing destinations

| Path | Use when |
| --- | --- |
| Instant Form | Primary CPL test |
| `https://displayavenue.com/book-now` | Quality / intent check |
| `https://displayavenue.com/contact` | Longer form / higher intent |
| WhatsApp click-to-chat | Secondary; measure chat→call rate |

Primary CTA everywhere: **Book a free call** — match ad promise (no hard sell, plain English plan).

---

## 6. Compliance notes

- Do not promise guaranteed rankings, revenue, or “#1 on Google”.
- Prefer claims you can defend: clearer plans, more of the right enquiries, plain-English reporting.
- Use client quotes only with permission; the proof creative uses paraphrased outcome language aligned to site testimonials.
- India ads: include business identity on Page; avoid before/after medical or regulated claims if running industry verticals later.

---

## 7. Files in this folder

```
meta-ads/
  CAMPAIGN_BRIEF.md      ← this file
  AD_COPY.md             ← primary text, headlines, descriptions
  INSTANT_FORM.md        ← form + thank-you + CRM routing
  PREVIEW.md             ← how to open the visual preview
  creatives/             ← PNG assets ready to upload
  preview/index.html     ← offline creative board
```

# Meta Instant Form — DisplayAvenue Leads

Use with Campaign objective **Leads** → Instant Forms.

Form name: `DA Free Call — Business Owners`

---

## Intro

**Headline:** Book a free marketing call  
**Description:** Tell us about your business. We’ll share a clear plan in plain English — no hard sell.

**Background image:** `creatives/da-meta-feed-offer-found.png` (or winning feed creative)

---

## Questions

### Prefill (Meta)

- Full name  
- Email  
- Phone number (label as **WhatsApp number**)

### Custom questions

1. **Business name** (Short answer) — Required  
2. **City** (Short answer) — Required  
3. **What do you need help with?** (Multiple choice — pick one) — Required  
   - Get found on Google / Maps  
   - Ads that bring enquiries  
   - Website that converts  
   - Branding & creatives  
   - Not sure — need a plan  
4. **Monthly marketing budget** (Multiple choice) — Required  
   - Under ₹25,000  
   - ₹25,000 – ₹75,000  
   - ₹75,000 – ₹2,00,000  
   - ₹2,00,000+  
   - Not decided yet  
5. **Best time to call** (Multiple choice) — Optional  
   - Morning (10–1)  
   - Afternoon (1–5)  
   - Evening (5–8)

Keep the form to **≤6 fields** including prefills so submit rate stays high.

---

## Privacy & enrichment

- Link privacy policy: `https://displayavenue.com/privacy` (or your live legal URL)  
- Enable **Higher intent** form type if available (adds friction; better quality)  
- Turn on **Enrichment** carefully — test CPL vs show rate

---

## Thank-you screen

**Headline:** You’re booked for a callback  
**Description:** A DisplayAvenue teammate will WhatsApp or call you shortly with free-call slots. Prefer to pick a time now?  
**Button:** View website  
**Link:** `https://displayavenue.com/book-now?utm_source=meta&utm_medium=paid&utm_campaign=da_leads&utm_content=instant_form_ty`

Optional second CTA: WhatsApp deep link `https://wa.me/919222122333?text=Hi%20DisplayAvenue%2C%20I%20just%20submitted%20the%20free%20call%20form`

---

## CRM routing (convert leads)

| Budget answer | Priority | Owner action |
| --- | --- | --- |
| ₹75k+ or ₹2L+ | P0 | Call &lt; 15 min |
| ₹25–75k | P1 | Call &lt; 1 hour |
| Under ₹25k / Not decided | P2 | WhatsApp nurture + free tools links |
| Agency / job seeker (detect in notes) | Route | Partnership or careers reply |

**Script (first WhatsApp)**

> Hi {{name}}, this is DisplayAvenue. Got your note about {{need}} for {{business}} in {{city}}.  
> Free 20-min call — no hard sell. Share 2 slots this week that work, or book here: https://displayavenue.com/book-now

**Call agenda (20 min)**

1. What do you sell / who buys? (2 min)  
2. Current Google / IG / website status (5 min)  
3. Where enquiries get stuck (5 min)  
4. 2–3 fixes to do first (5 min)  
5. Next step: proposal or DIY checklist (3 min)

---

## Lead quality score (internal)

Score 0–5; only pursue ≥3 for sales calls.

| Signal | Points |
| --- | --- |
| Budget ≥ ₹25k | +2 |
| Budget ≥ ₹75k | +3 |
| Clear need (not “not sure” only) | +1 |
| Business name filled properly | +1 |
| Metro / serviceable city | +1 |
| Student / freelancers seeking job | −3 |

---

## Download / integrations

- Meta Leads → Zapier / Make → Google Sheet + Email + WhatsApp Business API  
- Or CRM (HubSpot / Zoho / Bitrix) with source = `meta_instant_form`  
- Sync daily: leads, CPL, booked calls, closed clients

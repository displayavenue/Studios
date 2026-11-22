# DisplayAvenue Strategy (`strategy.displayavenue.com`)

Interactive strategy maker for digital marketing, lead generation, and sales — covering Google Ads, Meta Ads, SEO, and every service listed on displayavenue.com.

## Features

- Industry + goal + budget inputs
- Channel mix (Google Ads, Meta Ads, LinkedIn, SEO, Local SEO, Social, Email, CRO, WhatsApp sales ops)
- Budget split, KPIs, funnel, sales cadence, 90-day roadmap
- Maps to full DisplayAvenue service catalogue
- Copy / print / WhatsApp handoff

## Local preview

```bash
cd agency/strategy-app
python3 -m http.server 8770
```

Open http://127.0.0.1:8770/

## Deploy

```bash
cd agency/strategy-app
export SSH_PASS='…'
bash scripts/deploy.sh
```

Live path while DNS is pending: https://displayavenue.com/strategy/

### Subdomain DNS (Hostinger hPanel)

1. Domains → displayavenue.com → Subdomains → create **`strategy`**
2. Document root: `domains/strategy.displayavenue.com/public_html`
3. Wait for SSL

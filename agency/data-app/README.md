# DisplayAvenue Data (`data.displayavenue.com`)

Industry-wise business lead extractor for DisplayAvenue sales.

## What it does

- Filter by **industry** + **Indian city**
- Extract public businesses from **OpenStreetMap** (Overpass)
- Score digital gaps (no website = hotter agency prospect)
- Export **CSV** + copy outreach packs
- Open directory shortcuts (Maps, IndiaMART, Justdial, LinkedIn)

## Local preview

Serve the folder with any static server that can run PHP for `/api`:

```bash
cd agency/data-app
php -S 127.0.0.1:8765
```

Open http://127.0.0.1:8765/

## Deploy (Hostinger)

```bash
cd agency/data-app
export SSH_PASS='…'
bash scripts/deploy.sh
```

Deploys to:

1. `domains/data.displayavenue.com/public_html` → **https://data.displayavenue.com/**
2. `domains/displayavenue.com/public_html/data` → **https://displayavenue.com/data/**

### Subdomain DNS (one-time in Hostinger hPanel)

If `data.displayavenue.com` does not resolve yet:

1. hPanel → Domains → displayavenue.com → **Subdomains**
2. Create subdomain **`data`**
3. Document root: `domains/data.displayavenue.com/public_html`
4. Wait for DNS / SSL (Let's Encrypt)

## Ethics

Uses open map data and public directory search links. For legitimate B2B outreach only.

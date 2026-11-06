# DisplayAvenue Agency (displayavenue.com)

Demo rebuild of the **DisplayAvenue** digital growth agency site — separate from DisplayAvenue Studios.

## Stack

- React 19 + TypeScript + Vite + React Router
- Design: Plus Jakarta Sans, navy / blue / white
- Static content in `src/data/` (CMS can be added later)

## Develop

```bash
cd agency
npm install
npm run dev
```

## Build

```bash
cd agency
npm run build
npm run preview
```

## Deploy to Hostinger (displayavenue.com)

### Live demo + CMS (recommended while WordPress still runs)

Deploys SPA + admin + content JSON to **https://displayavenue.com/demo/** (WordPress root untouched):

```bash
cd agency
export SSH_PASS='...'
bash scripts/deploy-ssh-demo.sh
```

- Website: https://displayavenue.com/demo/
- CMS: https://displayavenue.com/demo/admin/  
  Password in `public/admin/config.php` (`DisplayAgency@2026` — change it)

Remote `/demo/content/` edits are preserved across deploys.

## Live cutover (displayavenue.com root)

```bash
cd agency
export SSH_PASS='...'
bash scripts/deploy-ssh-live.sh
```

- Website: https://displayavenue.com/
- CMS: https://displayavenue.com/admin/
- Keeps `/demo` and `/os` folders; backs up previous root under `~/backups/`


## Pages

Home, What We Do / Services, Industries, Solutions, AI Platform, Packages, Free Tools, Case Studies, Portfolio, Resources, Why DisplayAvenue, Contact (+ detail stubs).

Domain: [displayavenue.com](https://displayavenue.com)


## Prerendering (SEO + link previews)

`npm run build` now runs `scripts/prerender.mjs` after Vite. It opens every URL in
`sitemap.xml` with the Chrome already installed on the machine and saves
`dist/<route>/index.html` with the real page text and that page's own title,
description, canonical, Open Graph and JSON-LD tags. Google, Facebook/Meta,
WhatsApp and LinkedIn previews then see real content instead of an empty page.

- No Chrome on the build machine? The step is skipped with a warning; set
  `CHROME_PATH=/path/to/chrome` to point at one. `PRERENDER=0` skips it.
- `public/.htaccess` serves the prerendered file for each URL and falls back to
  `spa-shell.html` for anything else.
- Visitors always get the live React app with live CMS content. After big CMS
  edits, rebuild and redeploy so the static copy that crawlers read stays current.

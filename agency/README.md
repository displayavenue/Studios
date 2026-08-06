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

### Live demo (recommended while WordPress still runs)

Deploys to **https://displayavenue.com/demo/** without replacing WordPress:

```bash
cd agency
export SSH_PASS='...'
bash scripts/deploy-ssh-demo.sh
```

### Full site cutover (later)

When ready to replace WordPress at the domain root, rebuild with `DEPLOY_BASE=/` and upload to `domains/displayavenue.com/public_html` (backup WordPress first).

Use a **separate** path from Studios (`displayavenuestudios.com`).


## Pages

Home, What We Do / Services, Industries, Solutions, AI Platform, Packages, Free Tools, Case Studies, Portfolio, Resources, Why DisplayAvenue, Contact (+ detail stubs).

Domain: [displayavenue.com](https://displayavenue.com)

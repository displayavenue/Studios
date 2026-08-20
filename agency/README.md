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


## Pages

Home, What We Do / Services, Industries, Solutions, AI Platform, Packages, Free Tools, Case Studies, Portfolio, Resources, Why DisplayAvenue, Contact (+ detail stubs).

Domain: [displayavenue.com](https://displayavenue.com)

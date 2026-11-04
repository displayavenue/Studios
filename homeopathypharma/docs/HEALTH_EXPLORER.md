# Human Health Explorer

Interactive anatomy & health explorer for HOMEOPATHY PHARMA.

## Public URLs

- Page: `/health-explorer`
- Catalogue API: `/api/health-explorer/catalog`
- Admin: `/admin/health-explorer`

## Architecture

- React island (`resources/js/health-explorer`) mounted on a Laravel Blade page.
- Medical content lives in structured JSON: `public/data/health-explorer/catalog.json` (not hardcoded in UI components).
- DB tables (`anatomy_*`) are migrated for future expansion; admin currently edits the JSON catalogue for organs and homeopathy products.
- Built assets are committed under `public/build` for Hostinger (no Node required on the server).

## Content rules

- Educational only — not diagnosis or prescription.
- Homeopathy entries always separate **traditional claims** from **evidence status**.
- Never claim homeopathy cures disease or replaces conventional care.

## Local rebuild

```bash
cd homeopathypharma
npm install
npm run build
```

## Extending

1. Add organs / diseases / mental topics / products to `catalog.json`.
2. Place hotspots as `{ cx, cy, r }` percentages on the `100×160` body viewBox.
3. Rebuild if React UI changes; JSON-only content updates need no rebuild.

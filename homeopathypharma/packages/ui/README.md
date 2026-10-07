# @homeopathypharma/ui

Shared React 19 UI primitives with a calm clinical-apothecary design direction.

## Design tokens

- **Primary**: deep forest teal `#0B3D3A`
- **Accent**: amber (CTAs only, used sparingly)
- **Typography**: Fraunces (display), Source Serif 4 (body)
- **Surface**: warm ivory with subtle paper gradient — not purple-on-white or cream/terracotta

Import styles in your app entry:

```ts
import "@homeopathypharma/ui/styles.css";
```

## Accessibility

WCAG 2.2 focus states, skip link, reduced-motion support, semantic form patterns. Layout shells are composition helpers — no hero cards.

## Assumptions

- Consumers provide React 19 and load Google Fonts for Fraunces + Source Serif 4.
- Shell components accept `header`, `nav`, `main`, `footer` slots as React nodes.

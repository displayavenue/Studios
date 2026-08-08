/** Deterministic pack / avatar artwork for the static storefront (no external CDN required). */

function hashHue(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i += 1) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h % 360;
}

export function productImageDataUrl(input: {
  name: string;
  form: string;
  brandName: string;
  potency?: string;
}): string {
  const hue = hashHue(input.name + input.form);
  const form = input.form.toLowerCase();
  const label = escapeXml((input.potency || input.form).slice(0, 12));
  const brand = escapeXml(input.brandName.slice(0, 18));
  const title = escapeXml(input.name.split("(")[0]?.trim().slice(0, 22) || "Remedy");

  let artwork = "";
  if (form.includes("ointment") || form.includes("cream")) {
    artwork = `
      <rect x="118" y="70" width="84" height="120" rx="14" fill="hsl(${hue} 28% 42%)"/>
      <rect x="128" y="82" width="64" height="40" rx="8" fill="#f7f3ea"/>
      <text x="160" y="108" text-anchor="middle" font-size="11" fill="#0b3d3a" font-family="Georgia,serif">${label}</text>
      <ellipse cx="160" cy="70" rx="42" ry="12" fill="hsl(${hue} 32% 32%)"/>`;
  } else if (form.includes("globule") || form.includes("tablet") || form.includes("biochemic")) {
    artwork = `
      <rect x="108" y="78" width="104" height="110" rx="16" fill="hsl(${hue} 30% 46%)"/>
      <rect x="120" y="92" width="80" height="58" rx="10" fill="#fffef8"/>
      <circle cx="140" cy="118" r="8" fill="hsl(${hue} 40% 70%)"/>
      <circle cx="160" cy="118" r="8" fill="hsl(${hue} 40% 70%)"/>
      <circle cx="180" cy="118" r="8" fill="hsl(${hue} 40% 70%)"/>
      <text x="160" y="168" text-anchor="middle" font-size="12" fill="#fff" font-family="Georgia,serif">${label}</text>`;
  } else if (form.includes("kit") || form.includes("pack") || form.includes("bundle")) {
    artwork = `
      <rect x="90" y="86" width="140" height="100" rx="12" fill="hsl(${hue} 26% 40%)"/>
      <rect x="102" y="98" width="116" height="56" rx="8" fill="#f4f7f5"/>
      <text x="160" y="132" text-anchor="middle" font-size="12" fill="#0b3d3a" font-family="Georgia,serif">KIT</text>
      <text x="160" y="172" text-anchor="middle" font-size="11" fill="#fff" font-family="Georgia,serif">${label}</text>`;
  } else {
    // dilution / mother tincture bottle
    artwork = `
      <rect x="140" y="48" width="40" height="28" rx="6" fill="hsl(${hue} 22% 30%)"/>
      <rect x="128" y="74" width="64" height="18" rx="4" fill="hsl(${hue} 18% 38%)"/>
      <path d="M120 92h80l8 110a18 18 0 0 1-18 18H130a18 18 0 0 1-18-18l8-110z" fill="hsl(${hue} 35% 48%)"/>
      <path d="M128 120h64l4 70a10 10 0 0 1-10 10h-52a10 10 0 0 1-10-10l4-70z" fill="hsl(${(hue + 40) % 360} 40% 72%)" opacity=".55"/>
      <text x="160" y="175" text-anchor="middle" font-size="13" fill="#0b3d3a" font-family="Georgia,serif" font-weight="700">${label}</text>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="hsl(${hue} 30% 94%)"/>
        <stop offset="100%" stop-color="hsl(${(hue + 30) % 360} 24% 88%)"/>
      </linearGradient>
    </defs>
    <rect width="320" height="320" fill="url(#bg)"/>
    <circle cx="260" cy="48" r="54" fill="hsl(${hue} 40% 70%)" opacity=".18"/>
    ${artwork}
    <text x="24" y="36" font-size="12" fill="#5c6663" font-family="Georgia,serif">${brand}</text>
    <text x="24" y="300" font-size="13" fill="#0b3d3a" font-family="Georgia,serif">${title}</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function doctorAvatarDataUrl(fullName: string, locality: string): string {
  const hue = hashHue(fullName);
  const initials = fullName
    .replace(/^Dr\.?\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
  const place = escapeXml(locality.slice(0, 18));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="hsl(${hue} 28% 42%)"/>
        <stop offset="100%" stop-color="hsl(${hue} 32% 28%)"/>
      </linearGradient>
    </defs>
    <rect width="320" height="320" fill="url(#g)"/>
    <circle cx="160" cy="128" r="58" fill="#f7f3ea"/>
    <text x="160" y="140" text-anchor="middle" font-size="42" fill="#0b3d3a" font-family="Georgia,serif" font-weight="700">${escapeXml(initials)}</text>
    <rect x="0" y="230" width="320" height="90" fill="rgb(5 40 38 / 35%)"/>
    <text x="160" y="268" text-anchor="middle" font-size="14" fill="#e3ede7" font-family="Georgia,serif">${place}</text>
    <text x="160" y="292" text-anchor="middle" font-size="12" fill="#a8c4b8" font-family="Georgia,serif">BHMS · Mumbai</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function categoryImageDataUrl(label: string, seed: string): string {
  const hue = hashHue(seed);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <rect width="160" height="160" rx="28" fill="hsl(${hue} 32% 92%)"/>
    <circle cx="80" cy="64" r="28" fill="hsl(${hue} 35% 42%)"/>
    <rect x="46" y="100" width="68" height="28" rx="10" fill="hsl(${hue} 28% 36%)"/>
    <text x="80" y="148" text-anchor="middle" font-size="11" fill="#0b3d3a" font-family="Georgia,serif">${escapeXml(label.slice(0, 14))}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

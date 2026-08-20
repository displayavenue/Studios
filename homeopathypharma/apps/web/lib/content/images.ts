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

/** Full-bleed apothecary shelf for the homepage hero — product atmosphere, not abstract wash. */
export function heroApothecaryImageDataUrl(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0.2" y2="1">
        <stop offset="0%" stop-color="#0b3d3a"/>
        <stop offset="55%" stop-color="#0f4f4b"/>
        <stop offset="100%" stop-color="#163f3a"/>
      </linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#d7ebe2" stop-opacity=".55"/>
        <stop offset="100%" stop-color="#7ea894" stop-opacity=".25"/>
      </linearGradient>
      <linearGradient id="amber" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#f0c27b"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
      <linearGradient id="shelf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#234844"/>
        <stop offset="100%" stop-color="#102826"/>
      </linearGradient>
      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8"/>
      </filter>
    </defs>
    <rect width="1600" height="1000" fill="url(#sky)"/>
    <ellipse cx="1280" cy="220" rx="340" ry="220" fill="#d97706" opacity=".16" filter="url(#soft)"/>
    <ellipse cx="420" cy="780" rx="420" ry="220" fill="#a8c4b8" opacity=".12" filter="url(#soft)"/>
    <g opacity=".9">
      <rect x="700" y="210" width="820" height="28" rx="6" fill="url(#shelf)"/>
      <rect x="700" y="470" width="820" height="28" rx="6" fill="url(#shelf)"/>
      <rect x="700" y="730" width="820" height="28" rx="6" fill="url(#shelf)"/>
    </g>
    <g>
      <rect x="760" y="70" width="70" height="140" rx="12" fill="#1f6b63"/>
      <rect x="772" y="40" width="46" height="36" rx="8" fill="#134843"/>
      <rect x="776" y="110" width="38" height="70" rx="8" fill="url(#glass)"/>
      <rect x="870" y="95" width="62" height="115" rx="10" fill="#245f58"/>
      <rect x="880" y="68" width="42" height="30" rx="7" fill="#163f3a"/>
      <rect x="884" y="125" width="34" height="55" rx="7" fill="url(#amber)" opacity=".85"/>
      <rect x="970" y="55" width="78" height="155" rx="14" fill="#1a5852"/>
      <rect x="986" y="28" width="46" height="34" rx="8" fill="#0f3d39"/>
      <rect x="990" y="100" width="38" height="80" rx="8" fill="url(#glass)"/>
      <rect x="1085" y="88" width="58" height="122" rx="11" fill="#2a6d64"/>
      <rect x="1095" y="60" width="38" height="32" rx="7" fill="#184843"/>
      <rect x="1099" y="120" width="30" height="60" rx="6" fill="#e3ede7" opacity=".5"/>
      <rect x="1180" y="70" width="72" height="140" rx="12" fill="#205c55"/>
      <rect x="1192" y="42" width="48" height="34" rx="8" fill="#123f3b"/>
      <rect x="1196" y="110" width="40" height="70" rx="8" fill="url(#amber)" opacity=".75"/>
      <rect x="1290" y="95" width="64" height="115" rx="10" fill="#274f4a"/>
      <rect x="1300" y="68" width="44" height="30" rx="7" fill="#163834"/>
      <rect x="1304" y="125" width="36" height="55" rx="7" fill="url(#glass)"/>
      <rect x="1390" y="60" width="80" height="150" rx="14" fill="#1d645c"/>
      <rect x="1406" y="32" width="48" height="34" rx="8" fill="#0f403c"/>
      <rect x="1410" y="105" width="40" height="78" rx="8" fill="#f3efe8" opacity=".45"/>
    </g>
    <g>
      <rect x="780" y="330" width="66" height="140" rx="12" fill="#215e57"/>
      <rect x="790" y="302" width="46" height="34" rx="8" fill="#134843"/>
      <rect x="794" y="370" width="38" height="70" rx="8" fill="url(#glass)"/>
      <rect x="890" y="350" width="90" height="120" rx="16" fill="#2b675e"/>
      <rect x="905" y="370" width="60" height="55" rx="10" fill="#f7f3ea"/>
      <circle cx="925" cy="398" r="8" fill="#c5d9cc"/>
      <circle cx="945" cy="398" r="8" fill="#c5d9cc"/>
      <rect x="1020" y="318" width="70" height="152" rx="12" fill="#1a5852"/>
      <rect x="1032" y="290" width="46" height="34" rx="8" fill="#0f3d39"/>
      <rect x="1036" y="360" width="38" height="80" rx="8" fill="url(#amber)" opacity=".8"/>
      <rect x="1135" y="340" width="64" height="130" rx="11" fill="#274f4a"/>
      <rect x="1145" y="314" width="44" height="30" rx="7" fill="#163834"/>
      <rect x="1149" y="375" width="36" height="65" rx="7" fill="url(#glass)"/>
      <rect x="1240" y="325" width="78" height="145" rx="14" fill="#1f6b63"/>
      <rect x="1254" y="296" width="50" height="34" rx="8" fill="#134843"/>
      <rect x="1258" y="365" width="42" height="75" rx="8" fill="#e3ede7" opacity=".48"/>
      <rect x="1355" y="348" width="110" height="122" rx="14" fill="#245f58"/>
      <rect x="1370" y="368" width="80" height="48" rx="8" fill="#f4f7f5"/>
      <text x="1410" y="398" text-anchor="middle" font-size="18" fill="#0b3d3a" font-family="Georgia,serif">SBL</text>
    </g>
    <g opacity=".95">
      <rect x="800" y="590" width="68" height="140" rx="12" fill="#1d645c"/>
      <rect x="812" y="562" width="44" height="34" rx="8" fill="#0f403c"/>
      <rect x="816" y="630" width="36" height="70" rx="8" fill="url(#glass)"/>
      <rect x="910" y="605" width="72" height="125" rx="12" fill="#215e57"/>
      <rect x="922" y="578" width="48" height="32" rx="7" fill="#134843"/>
      <rect x="926" y="640" width="40" height="60" rx="7" fill="url(#amber)" opacity=".78"/>
      <rect x="1025" y="585" width="64" height="145" rx="11" fill="#274f4a"/>
      <rect x="1035" y="558" width="44" height="32" rx="7" fill="#163834"/>
      <rect x="1039" y="620" width="36" height="75" rx="7" fill="url(#glass)"/>
      <rect x="1130" y="600" width="95" height="130" rx="16" fill="#2a6d64"/>
      <rect x="1145" y="620" width="65" height="55" rx="10" fill="#fffef8"/>
      <text x="1177" y="654" text-anchor="middle" font-size="16" fill="#0b3d3a" font-family="Georgia,serif">R1</text>
      <rect x="1270" y="575" width="74" height="155" rx="13" fill="#1a5852"/>
      <rect x="1282" y="546" width="50" height="34" rx="8" fill="#0f3d39"/>
      <rect x="1286" y="615" width="42" height="80" rx="8" fill="#e3ede7" opacity=".5"/>
      <rect x="1385" y="595" width="80" height="135" rx="14" fill="#205c55"/>
      <rect x="1398" y="568" width="54" height="32" rx="8" fill="#123f3b"/>
      <rect x="1402" y="630" width="44" height="70" rx="8" fill="url(#amber)" opacity=".7"/>
    </g>
    <rect x="700" y="0" width="320" height="1000" fill="url(#sky)" opacity=".35"/>
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

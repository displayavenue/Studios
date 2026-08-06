type Variant = "growth" | "product" | "ads" | "web" | "generic";

const accents: Record<Variant, { a: string; b: string; c: string }> = {
  growth: { a: "#0f766e", b: "#134e4a", c: "#99f6e4" },
  product: { a: "#0056ff", b: "#0039a6", c: "#bfdbfe" },
  ads: { a: "#ea580c", b: "#9a3412", c: "#fed7aa" },
  web: { a: "#7c3aed", b: "#5b21b6", c: "#ddd6fe" },
  generic: { a: "#0f766e", b: "#0c1a1a", c: "#ccfbf1" },
};

/** Lightweight SVG illustrations used when no CMS image is uploaded. */
export function VectorArt({
  variant = "generic",
  className = "",
  title = "Illustration",
}: {
  variant?: Variant;
  className?: string;
  title?: string;
}) {
  const c = accents[variant] || accents.generic;
  return (
    <svg
      className={className}
      viewBox="0 0 640 400"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`vg-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c.a} stopOpacity="0.95" />
          <stop offset="100%" stopColor={c.b} stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <rect width="640" height="400" fill={`url(#vg-${variant})`} />
      <circle cx="520" cy="70" r="90" fill={c.c} opacity="0.25" />
      <circle cx="80" cy="340" r="120" fill={c.c} opacity="0.18" />
      <path
        d="M70 280c40-70 110-90 170-70s110 20 160-30 120-50 170-10"
        fill="none"
        stroke={c.c}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.55"
      />
      <rect x="120" y="120" width="220" height="150" rx="18" fill="#fff" opacity="0.14" />
      <rect x="150" y="150" width="120" height="12" rx="6" fill="#fff" opacity="0.55" />
      <rect x="150" y="178" width="160" height="10" rx="5" fill="#fff" opacity="0.35" />
      <rect x="150" y="204" width="90" height="10" rx="5" fill="#fff" opacity="0.28" />
      <circle cx="430" cy="210" r="54" fill="#fff" opacity="0.16" />
      <path
        d="M410 210h40M430 190v40"
        stroke="#fff"
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.7"
      />
      <rect x="390" y="280" width="140" height="44" rx="12" fill="#fff" opacity="0.2" />
    </svg>
  );
}

export function vectorVariantFor(label = ""): Variant {
  const s = label.toLowerCase();
  if (/(ads|meta|google|paid|ppc)/.test(s)) return "ads";
  if (/(seo|growth|lead|market)/.test(s)) return "growth";
  if (/(web|app|software|saas|dev)/.test(s)) return "web";
  if (/(shop|product|ecom)/.test(s)) return "product";
  return "generic";
}

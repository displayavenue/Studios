import type { ReactNode } from "react";

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

const paths: Record<string, ReactNode> = {
  megaphone: (
    <>
      <path d="M3 11v2a1 1 0 0 0 1 1h1l6 4V6L5 10H4a1 1 0 0 0-1 1z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M18 6a8 8 0 0 1 0 12" />
    </>
  ),
  code: (
    <>
      <path d="M8 9l-3 3 3 3" />
      <path d="M16 9l3 3-3 3" />
      <path d="M13 6l-2 12" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </>
  ),
  brain: (
    <>
      <path d="M9.5 5a3 3 0 0 0-3 3v1a2.5 2.5 0 0 0-1 4.8V16a3 3 0 0 0 3 3h1" />
      <path d="M14.5 5a3 3 0 0 1 3 3v1a2.5 2.5 0 0 1 1 4.8V16a3 3 0 0 1-3 3h-1" />
      <path d="M12 8v10" />
    </>
  ),
  brand: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l2-2h6l2 2h3v11H4V8z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  ads: (
    <>
      <path d="M4 19V5l12 7-12 7z" />
      <path d="M16 8h4v8h-4" />
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="M8.2 10.8l7.6-4.6M8.2 13.2l7.6 4.6" />
    </>
  ),
  phone: (
    <>
      <rect x="8" y="3" width="8" height="18" rx="2" />
      <path d="M11 18h2" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 16l9 5 9-5" />
    </>
  ),
  cloud: (
    <>
      <path d="M7 18h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.7 1.5A3.5 3.5 0 0 0 7 18z" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1l2.1-2.1M17 7l2.1-2.1" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 19a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M15 19a4.5 4.5 0 0 1 6 0" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19h16" />
      <path d="M7 16V10" />
      <path d="M12 16V6" />
      <path d="M17 16v-4" />
    </>
  ),
  growth: (
    <>
      <path d="M4 18l6-6 4 4 6-8" />
      <path d="M14 8h6v6" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12l2.5 2.5L16 9" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  tag: (
    <>
      <path d="M3 12V4h8l9 9-8 8-9-9z" />
      <circle cx="8" cy="8" r="1.2" />
    </>
  ),
  chat: (
    <>
      <path d="M5 5h14v10H8l-3 3V5z" />
    </>
  ),
  whatsapp: (
    <>
      <path
        fill="currentColor"
        stroke="none"
        d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.99.58 3.85 1.6 5.43L2 22l4.89-1.6a9.86 9.86 0 0 0 5.15 1.42h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2zm5.76 13.99c-.24.67-1.18 1.22-1.93 1.38-.51.11-1.18.2-3.43-.74-2.88-1.2-4.74-4.14-4.88-4.33-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.38.26-.29.57-.36.76-.36h.55c.17 0 .4-.06.62.48.24.58.81 2 .88 2.14.07.15.12.32.02.51-.1.2-.15.32-.29.5-.15.17-.3.38-.43.51-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.07 1.32 2.36 1.47.3.15.47.12.64-.07.17-.2.74-.86.94-1.15.2-.3.4-.24.67-.14.27.1 1.72.81 2.01.96.3.15.49.22.56.34.08.13.08.74-.16 1.41z"
      />
    </>
  ),
  bolt: (
    <>
      <path d="M13 2L5 13h6l-1 9 9-13h-6l1-7z" />
    </>
  ),
  star: (
    <>
      <path d="M12 3l2.4 5.4L20 9.3l-4 4.2.9 5.8L12 16.8 7.1 19.3 8 13.5 4 9.3l5.6-.9L12 3z" />
    </>
  ),
  heart: (
    <>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </>
  ),
  dollar: (
    <>
      <path d="M12 3v18" />
      <path d="M16 8a3.5 3.5 0 0 0-4-2.5c-2.5 0-4 1.5-4 3.5s1.5 3 4 3.5 4 1.5 4 3.5-1.5 3.5-4 3.5a3.5 3.5 0 0 1-4-2.5" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 3c4 3 6 7 6 11-2 0-4-.5-6-1.5C10 12.5 8 13 6 13c0-4 2-8 6-10z" />
      <path d="M8 16l-3 5 5-3" />
      <path d="M16 16l3 5-5-3" />
      <circle cx="12" cy="10" r="1.2" />
    </>
  ),
  book: (
    <>
      <path d="M5 4h10a2 2 0 0 1 2 2v14H7a2 2 0 0 0-2 2V4z" />
      <path d="M5 20a2 2 0 0 1 2-2h12" />
    </>
  ),
  building: (
    <>
      <path d="M4 20V6l8-3 8 3v14" />
      <path d="M9 20v-6h6v6" />
      <path d="M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
    </>
  ),
  chip: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5 7l2 2M17 7l2-2M5 17l2-2M17 17l2 2" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </>
  ),
  doc: (
    <>
      <path d="M7 3h7l4 4v14H7V3z" />
      <path d="M14 3v4h4" />
      <path d="M9 12h6M9 16h6" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="M3 16l5-4 4 3 3-2 6 4" />
    </>
  ),
  gift: (
    <>
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M12 10v10M4 14h16" />
      <path d="M12 10c-2-3-5-3-5-1.5S9.5 10 12 10c2.5 0 5-.5 5-2S14 7 12 10z" />
    </>
  ),
  lock: (
    <>
      <rect x="6" y="11" width="12" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  handshake: (
    <>
      <path d="M8 12l-3 2 2 3 4-2" />
      <path d="M12 13l3-5 4 2-2 4" />
      <path d="M4 9l3-2 3 2" />
      <path d="M14 7l3-2 3 2" />
    </>
  ),
  nodes: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="18" r="2" />
      <path d="M7.5 7.5l3.5 8M16.5 7.5l-3.5 8M8 6h8" />
    </>
  ),
  robot: (
    <>
      <rect x="6" y="8" width="12" height="10" rx="2" />
      <path d="M12 4v4" />
      <circle cx="9.5" cy="12" r="1" />
      <circle cx="14.5" cy="12" r="1" />
      <path d="M9 15h6" />
    </>
  ),
  puzzle: (
    <>
      <path d="M8 4h4a2 2 0 1 1 0 4h4v4a2 2 0 1 1 0 4v4H8v-4a2 2 0 1 0 0-4V4z" />
    </>
  ),
  clipboard: (
    <>
      <rect x="6" y="5" width="12" height="16" rx="2" />
      <path d="M9 5V4h6v1" />
      <path d="M9 11h6M9 15h4" />
    </>
  ),
  path: (
    <>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M8 7c4 0 4 10 8 10" />
    </>
  ),
  factory: (
    <>
      <path d="M3 20V10l5 4V10l5 4V8h8v12H3z" />
    </>
  ),
  hotel: (
    <>
      <path d="M4 20V6h10v14" />
      <path d="M14 10h6v10" />
      <path d="M7 10h2M7 14h2M17 14h1" />
    </>
  ),
  utensils: (
    <>
      <path d="M7 3v8a2 2 0 0 0 2 2v8" />
      <path d="M7 3c0 3 2 3 2 6" />
      <path d="M15 3v18" />
      <path d="M15 3c3 0 4 3 4 6v2h-4" />
    </>
  ),
  cart: (
    <>
      <path d="M4 5h2l2 12h10l2-8H8" />
      <circle cx="10" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
    </>
  ),
  bank: (
    <>
      <path d="M3 10l9-6 9 6" />
      <path d="M5 10v8M9 10v8M15 10v8M19 10v8" />
      <path d="M3 18h18" />
    </>
  ),
  car: (
    <>
      <path d="M4 14l2-5h12l2 5" />
      <path d="M3 14h18v4H3z" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="16.5" cy="18" r="1.5" />
    </>
  ),
  hardhat: (
    <>
      <path d="M4 14h16v3H4z" />
      <path d="M5 14a7 7 0 0 1 14 0" />
      <path d="M12 7v3" />
    </>
  ),
  plane: (
    <>
      <path d="M3 13l18-7-3 14-6-4-3 4-1-4-5-3z" />
    </>
  ),
  shirt: (
    <>
      <path d="M8 5l4 3 4-3 4 2-3 4v10H7V11L4 7l4-2z" />
    </>
  ),
  gem: (
    <>
      <path d="M6 9l6-5 6 5-6 11L6 9z" />
      <path d="M6 9h12" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z" />
      <path d="M5 19c3-3 7-6 11-8" />
    </>
  ),
  hands: (
    <>
      <path d="M8 12V7a2 2 0 0 1 4 0v5" />
      <path d="M12 12V6a2 2 0 0 1 4 0v7" />
      <path d="M16 13v-2a2 2 0 0 1 4 0v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5v-3a2 2 0 0 1 4 0" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  searchIcon: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6L6 18" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8l6 4-6 4V8z" />
    </>
  ),
};

export function Icon({
  name,
  size = 20,
  color = "currentColor",
  strokeWidth = 1.6,
  className,
}: IconProps) {
  const content = paths[name] ?? paths.grid;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {content}
    </svg>
  );
}

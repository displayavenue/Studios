import { findCity, seoCities } from "../data/locations";

/** Resolve a city name from location routes or ?city= query. */
export function cityFromPathAndSearch(pathname: string, search: string): string {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const q = (params.get("city") || "").trim();
  if (q) return q;

  const m = pathname.match(/\/locations\/([^/]+)/);
  if (m?.[1]) {
    const city = findCity(decodeURIComponent(m[1]));
    if (city) return city.name;
  }
  return "";
}

export function matchSeoCityByName(name: string) {
  const n = name.trim().toLowerCase();
  if (!n) return undefined;
  return seoCities.find(
    (c) => c.name.toLowerCase() === n || c.slug === n.replace(/\s+/g, "-"),
  );
}

export function whatsappWithText(baseHref: string, text: string) {
  if (baseHref.includes("wa.me")) {
    try {
      const url = new URL(baseHref);
      url.searchParams.set("text", text);
      return url.toString();
    } catch {
      /* fall through */
    }
  }
  return `${baseHref}${baseHref.includes("?") ? "&" : "?"}text=${encodeURIComponent(text)}`;
}

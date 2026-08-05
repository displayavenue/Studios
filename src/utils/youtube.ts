/** Extract a YouTube video ID from common URL formats. */
export function getYoutubeId(url?: string | null): string | null {
  if (!url) return null;
  const raw = url.trim();
  if (!raw) return null;

  // Already a bare ID
  if (/^[\w-]{11}$/.test(raw)) return raw;

  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^[\w-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const v = u.searchParams.get("v");
      if (v && /^[\w-]{11}$/.test(v)) return v;

      const parts = u.pathname.split("/").filter(Boolean);
      // /embed/ID, /shorts/ID, /live/ID, /v/ID
      if (
        parts.length >= 2 &&
        ["embed", "shorts", "live", "v"].includes(parts[0]) &&
        /^[\w-]{11}$/.test(parts[1])
      ) {
        return parts[1];
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getYoutubeEmbedUrl(url?: string | null): string | null {
  const id = getYoutubeId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0` : null;
}

type Props = {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  /** First visible row can use eager; default lazy */
  loading?: "lazy" | "eager";
};

/** Resolve grid-friendly thumb paths for awards/certs images. */
export function credentialThumbPaths(image: string): {
  webp: string;
  jpg: string;
  fallback: string;
} {
  const fallback = image || "";
  const m = fallback.match(
    /^(.*\/images\/(?:awards|certs)\/)([^/?#]+)\.(jpe?g|png|webp)$/i,
  );
  if (!m) {
    return { webp: fallback, jpg: fallback, fallback };
  }
  const [, dir, stem] = m;
  return {
    webp: `${dir}thumbs/${stem}.webp`,
    jpg: `${dir}thumbs/${stem}.jpg`,
    fallback,
  };
}

/** Compact WebP/JPEG thumbs for awards & certifications grids. */
export function CredentialImage({
  src,
  alt = "",
  width = 560,
  height = 392,
  className,
  loading = "lazy",
}: Props) {
  const thumbs = credentialThumbPaths(src);
  return (
    <picture>
      <source srcSet={thumbs.webp} type="image/webp" />
      <source srcSet={thumbs.jpg} type="image/jpeg" />
      <img
        className={className}
        src={thumbs.jpg || thumbs.fallback}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding="async"
      />
    </picture>
  );
}

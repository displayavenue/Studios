import { useCms } from "../cms/CmsProvider";
import "./ClientLogoWall.css";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function ClientLogoWall({ label }: { label?: string }) {
  const { company, home } = useCms();
  const brands = company.brandLogos || [];
  const heading = label || home.brands?.label || "Trusted by brands across India";

  return (
    <section className="client-wall section">
      <div className="container">
        <p className="client-wall__label reveal">{heading}</p>
        <p className="client-wall__sub reveal">
          Weddings, hospitality, FMCG, fintech, real estate, healthcare and more —
          one studio standard for every brief.
        </p>
        <div className="client-wall__grid reveal">
          {brands.map((brand) => (
            <div key={brand} className="client-logo" title={brand}>
              <span className="client-logo__mark" aria-hidden>
                {initials(brand)}
              </span>
              <span className="client-logo__name">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

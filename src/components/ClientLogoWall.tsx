import { useCms } from "../cms/CmsProvider";
import "./ClientLogoWall.css";

export function ClientLogoWall({ label }: { label?: string }) {
  const { company, home } = useCms();
  const brands = company.brandLogos || [];
  const heading = label || home.brands?.label || "Trusted by brands across India";

  return (
    <section className="client-wall section">
      <div className="container">
        <p className="client-wall__label reveal">{heading}</p>
        <p className="client-wall__line reveal">{brands.join(" · ")}</p>
      </div>
    </section>
  );
}

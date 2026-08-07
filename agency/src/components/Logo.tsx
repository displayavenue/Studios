import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./Logo.css";

export function Logo({ light = false }: { light?: boolean }) {
  const { company } = useCms();
  const logoSrc = (company as { logoImage?: string }).logoImage || "";
  return (
    <Link to="/" className={`logo ${light ? "logo-light" : ""}`}>
      {logoSrc ? (
        <img className="logo-mark" src={logoSrc} alt={`${company.name} logo`} width={40} height={40} />
      ) : null}
      <span className="logo-text">
        <strong>{company.name}</strong>
        <small>{company.tagline}</small>
      </span>
    </Link>
  );
}

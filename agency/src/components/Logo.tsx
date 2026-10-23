import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./Logo.css";

export function Logo({ light = false }: { light?: boolean }) {
  const { company } = useCms();
  return (
    <Link to="/" className={`logo ${light ? "logo-light" : ""}`}>
      <span className="logo-text">
        <strong>{company.name}</strong>
        <small>{company.tagline}</small>
      </span>
    </Link>
  );
}

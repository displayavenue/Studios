import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./Logo.css";

/** Mark: a "D" for Display with a marigold signal dot at its heart. */
function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 40 40" width="36" height="36" aria-hidden>
      <rect width="40" height="40" rx="12" className="logo-mark__tile" />
      <path d="M12 10h7.5a10 10 0 0 1 0 20H12z" className="logo-mark__d" />
      <circle cx="19.5" cy="20" r="3.6" className="logo-mark__dot" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  const { company } = useCms();
  const name = company.name || "DisplayAvenue";
  const split = name.match(/^(Display)(.*)$/i);
  return (
    <Link to="/" className={`logo ${light ? "logo-light" : ""}`} aria-label={`${name} home`}>
      <LogoMark />
      <span className="logo-text">
        <strong>
          {split ? (
            <>
              {split[1]}
              <span className="logo-text__soft">{split[2]}</span>
            </>
          ) : (
            name
          )}
        </strong>
        <small>{company.tagline}</small>
      </span>
    </Link>
  );
}

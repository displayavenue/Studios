import { NavLink } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./MobileBottomNav.css";

export function MobileBottomNav() {
  const { company } = useCms();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile shortcuts">
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/buy">Buy</NavLink>
      <NavLink to="/rent">Rent</NavLink>
      <a href={company.whatsappHref} target="_blank" rel="noreferrer" className="mobile-bottom-nav__wa">
        WhatsApp
      </a>
      <NavLink to="/contact">More</NavLink>
    </nav>
  );
}

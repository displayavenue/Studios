import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./Footer.css";

export function Footer() {
  const { company } = useCms();

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Link to="/" className="logo">
            <span className="logo__mark">DA</span>
            <span className="logo__text">
              DisplayAvenue
              <small>Realty</small>
            </span>
          </Link>
          <p>Buy, Sell, Rent, Redevelop in Dahisar, Mira Road and Bhayandar.</p>
          <div className="footer-social">
            <a href={company.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={company.phoneHref}>Call</a>
            <a href={company.emailHref}>Email</a>
          </div>
        </div>

        <div>
          <h4>Properties</h4>
          <ul>
            <li>
              <Link to="/buy">Buy</Link>
            </li>
            <li>
              <Link to="/rent">Rent</Link>
            </li>
            <li>
              <Link to="/commercial">Commercial</Link>
            </li>
            <li>
              <Link to="/sell">Sell</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            <li>
              <Link to="/localities">Localities</Link>
            </li>
            <li>
              <Link to="/societies">Societies</Link>
            </li>
            <li>
              <Link to="/guides">Guides</Link>
            </li>
            <li>
              <Link to="/blog">Insights</Link>
            </li>
            <li>
              <Link to="/faqs">FAQs</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li>
              <a href={company.phoneHref}>{company.phone}</a>
            </li>
            <li>
              <a href={company.emailHref}>{company.email}</a>
            </li>
            <li>
              <span>Mira Road East, Mumbai</span>
            </li>
          </ul>
          <address>
            {company.address.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} DisplayAvenue Realty</p>
        <div>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}

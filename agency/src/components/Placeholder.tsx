import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import "./Placeholder.css";
import { useCms } from "../cms/CmsProvider";

export function WhatsAppFloat() {
  const { company } = useCms();
  return (
    <a
      className="wa-float"
      href={company.whatsappHref}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <svg
        className="wa-float__icon"
        viewBox="0 0 24 24"
        width="28"
        height="28"
        aria-hidden
      >
        <path
          fill="#fff"
          d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.99.58 3.85 1.6 5.43L2 22l4.89-1.6a9.86 9.86 0 0 0 5.15 1.42h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2zm5.76 13.99c-.24.67-1.18 1.22-1.93 1.38-.51.11-1.18.2-3.43-.74-2.88-1.2-4.74-4.14-4.88-4.33-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.38.26-.29.57-.36.76-.36h.55c.17 0 .4-.06.62.48.24.58.81 2 .88 2.14.07.15.12.32.02.51-.1.2-.15.32-.29.5-.15.17-.3.38-.43.51-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.07 1.32 2.36 1.47.3.15.47.12.64-.07.17-.2.74-.86.94-1.15.2-.3.4-.24.67-.14.27.1 1.72.81 2.01.96.3.15.49.22.56.34.08.13.08.74-.16 1.41z"
        />
      </svg>
    </a>
  );
}

export function PlaceholderPage({
  title,
  desc,
}: {
  title: string;
  desc?: string;
}) {
  return (
    <div className="placeholder-page container">
      <p className="badge">Demo</p>
      <h1 className="section-title">{title}</h1>
      <p className="section-sub">
        {desc ??
          "This detail page is a demo stub. Full content will be connected when we replace WordPress."}
      </p>
      <div className="placeholder-actions">
        <Link to="/contact" className="btn btn-primary">
          Get Free Proposal <Icon name="arrow" size={16} color="#fff" />
        </Link>
        <Link to="/" className="btn btn-outline">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

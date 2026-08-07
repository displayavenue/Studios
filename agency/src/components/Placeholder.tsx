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
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <Icon name="chat" size={24} color="#fff" />
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

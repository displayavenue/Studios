import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { industries } from "../../data/industries";
import "./menus.css";

export function IndustriesMenu({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`mega ${compact ? "mega-compact" : ""}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          gap: "1rem",
          marginBottom: "0.85rem",
        }}
      >
        <div>
          <h3 className="section-title" style={{ fontSize: "1.15rem" }}>
            Industries We Serve
          </h3>
          <p className="section-sub" style={{ fontSize: "0.85rem" }}>
            Tailored digital growth strategies for every vertical.
          </p>
        </div>
        <Link to="/industries" className="btn btn-outline btn-sm">
          View All Industries →
        </Link>
      </div>
      <div className="industries-mega-grid">
        {industries.map((item) => (
          <Link key={item.slug} to={`/industries/${item.slug}`}>
            <Icon name={item.icon} size={16} color="#0056ff" />
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

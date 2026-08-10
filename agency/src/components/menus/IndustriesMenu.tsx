import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { useCms } from "../../cms/CmsProvider";
import { industries as fallbackIndustries } from "../../data/industries";
import "./menus.css";

function comboHref(industrySlug?: string, serviceSlug?: string) {
  if (!industrySlug || !serviceSlug) return "/industry-solutions";
  return `/industries/${industrySlug}/${serviceSlug}`;
}

export function IndustriesMenu({ compact = false }: { compact?: boolean }) {
  const { industries: cmsIndustries, combos } = useCms();
  const industries =
    cmsIndustries?.length > 0
      ? cmsIndustries.map((i) => ({
          slug: i.slug,
          title: i.title,
          icon: i.icon || "briefcase",
        }))
      : fallbackIndustries;

  const featuredCombos = (combos || []).slice(0, compact ? 6 : 10);

  return (
    <div className={`mega ${compact ? "mega-compact" : ""}`}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
          gap: "1rem",
          marginBottom: "0.85rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h3 className="section-title" style={{ fontSize: "1.15rem" }}>
            Industries & solutions
          </h3>
          <p className="section-sub" style={{ fontSize: "0.85rem" }}>
            Industry overviews plus dedicated industry × service landing pages.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Link to="/industries" className="btn btn-outline btn-sm">
            All industries →
          </Link>
          <Link to="/industry-solutions" className="btn btn-primary btn-sm">
            Industry solutions →
          </Link>
        </div>
      </div>

      <div className="mega-two-col">
        <div>
          <p className="mega-cat-label">Industries</p>
          <div className="industries-mega-grid">
            {industries.map((item) => (
              <Link key={item.slug} to={`/industries/${item.slug}`}>
                <Icon name={item.icon} size={16} color="#0056ff" />
                {item.title}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mega-cat-label">Industry solutions</p>
          <div className="industries-mega-grid industries-mega-grid--solutions">
            {featuredCombos.map((item) => (
              <Link
                key={item.slug}
                to={comboHref(item.industrySlug, item.serviceSlug)}
              >
                <Icon name={item.icon || "target"} size={16} color="#0d9488" />
                {item.title}
              </Link>
            ))}
            <Link to="/industry-solutions" className="mega-view-all">
              View all industry solutions →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

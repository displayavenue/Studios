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

  const featuredCombos = (combos || []).slice(0, compact ? 4 : 8);

  return (
    <div className={`mega industries-mega ${compact ? "mega-compact" : ""}`}>
      <div className="industries-mega__head">
        <div>
          <h3 className="section-title" style={{ fontSize: "1.15rem" }}>
            Industries we serve
          </h3>
          <p className="section-sub" style={{ fontSize: "0.85rem", marginTop: "0.35rem" }}>
            Pick your industry for a plain-English growth plan, or open a dedicated
            industry × service page.
          </p>
        </div>
        <div className="industries-mega__head-actions">
          <Link to="/industries" className="btn btn-primary btn-sm">
            All industries →
          </Link>
          <Link to="/industry-solutions" className="btn btn-outline btn-sm">
            Industry solutions →
          </Link>
        </div>
      </div>

      <div className="industries-mega-grid">
        {industries.map((item) => (
          <Link key={item.slug} to={`/industries/${item.slug}`}>
            <Icon name={item.icon} size={16} color="#0056ff" />
            <span>{item.title}</span>
          </Link>
        ))}
      </div>

      {featuredCombos.length > 0 ? (
        <div className="industries-mega__solutions">
          <div className="industries-mega__solutions-head">
            <p className="mega-cat-label">Featured industry solutions</p>
            <Link to="/industry-solutions" className="mega-view-all">
              View all industry solutions →
            </Link>
          </div>
          <div className="industries-mega__solutions-grid">
            {featuredCombos.map((item) => (
              <Link
                key={item.slug}
                to={comboHref(item.industrySlug, item.serviceSlug)}
                className="industries-mega__solution"
              >
                <Icon name={item.icon || "target"} size={15} color="#0d9488" />
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

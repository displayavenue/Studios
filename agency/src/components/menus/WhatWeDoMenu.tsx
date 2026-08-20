import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import {
  marketingServices,
  webDevGroups,
  designMobile,
  aiSoftware,
  creativeStudio,
  whyChoose,
  trustBar,
} from "../../data/services";
import "./menus.css";

export function WhatWeDoMenu({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`mega ${compact ? "mega-compact" : ""}`}>
      <div className="what-we-do-grid">
        <div className="mega-col">
          <div className="mega-col-title">
            <span className="icon-box" style={{ background: "#e8f0ff" }}>
              <Icon name="megaphone" color="#0056ff" size={18} />
            </span>
            Digital Marketing
          </div>
          <ul className="mega-links">
            {marketingServices.map((item) => (
              <li key={item.href}>
                <Link to={item.href}>
                  {item.label}
                  <Icon name="chevron" size={12} />
                </Link>
              </li>
            ))}
          </ul>
          <Link className="mega-view-all" to="/services/digital-marketing">
            View All Marketing Services →
          </Link>
        </div>

        <div className="mega-col">
          <div className="mega-col-title">
            <span className="icon-box" style={{ background: "#e6fbf5" }}>
              <Icon name="code" color="#0d9488" size={18} />
            </span>
            Web Development
          </div>
          {webDevGroups.map((group) => (
            <div key={group.title}>
              <div className="mega-subhead">{group.title}</div>
              <ul className="mega-links">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href}>
                      {item.label}
                      <Icon name="chevron" size={12} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Link className="mega-view-all" to="/services/web-development">
            View All Web Development →
          </Link>
        </div>

        <div className="mega-col">
          {designMobile.map((block) => (
            <div key={block.title} style={{ marginBottom: "0.85rem" }}>
              <div className="mega-col-title">
                <span
                  className="icon-box"
                  style={{ background: `${block.color}18` }}
                >
                  <Icon name={block.icon} color={block.color} size={18} />
                </span>
                {block.title}
              </div>
              <ul className="mega-links">
                {block.links.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href}>
                      {item.label}
                      <Icon name="chevron" size={12} />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                className="mega-view-all"
                to={block.viewAll.href}
                style={{ color: block.color }}
              >
                {block.viewAll.label} →
              </Link>
            </div>
          ))}
        </div>

        <div className="mega-col">
          {aiSoftware.map((block) => (
            <div key={block.title} style={{ marginBottom: "0.85rem" }}>
              <div className="mega-col-title">
                <span
                  className="icon-box"
                  style={{ background: `${block.color}18` }}
                >
                  <Icon name={block.icon} color={block.color} size={18} />
                </span>
                {block.title}
              </div>
              <ul className="mega-links">
                {block.links.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href}>
                      {item.label}
                      <Icon name="chevron" size={12} />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                className="mega-view-all"
                to={block.viewAll.href}
                style={{ color: block.color }}
              >
                {block.viewAll.label} →
              </Link>
            </div>
          ))}
        </div>

        <div className="mega-col">
          <div className="mega-col-title">
            <span className="icon-box" style={{ background: "#fce7f3" }}>
              <Icon name="camera" color="#e11d8c" size={18} />
            </span>
            Creative Studio
          </div>
          <ul className="mega-links">
            {creativeStudio.map((item) => (
              <li key={item.href}>
                <Link to={item.href}>
                  {item.label}
                  <Icon name="chevron" size={12} />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            className="mega-view-all"
            to="/services/creative"
            style={{ color: "#e11d8c" }}
          >
            View All Creative Services →
          </Link>
        </div>

        <div className="mega-col">
          <div className="mega-side-card">
            <h4>Looking for something specific?</h4>
            <p>300+ services tailored to your goals and industry.</p>
            <Link to="/contact" className="btn btn-primary btn-sm">
              Request Custom Solution →
            </Link>
          </div>
          <div className="mega-side-dark" style={{ marginTop: "0.75rem" }}>
            <h4>Why Choose DisplayAvenue?</h4>
            <ul className="mega-check-list" style={{ color: "#fff" }}>
              {whyChoose.map((item) => (
                <li key={item}>
                  <Icon name="check" size={14} color="#7dd3fc" />
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ fontSize: "0.75rem", opacity: 0.8, marginTop: "0.5rem" }}>
              ★★★★★ Rated on Google · Clutch · GoodFirms
            </div>
          </div>
        </div>
      </div>

      {!compact && (
        <div className="mega-trust">
          {trustBar.map((item) => (
            <div key={item.label} className="mega-trust-item">
              <Icon name={item.icon} size={16} color="#0056ff" />
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

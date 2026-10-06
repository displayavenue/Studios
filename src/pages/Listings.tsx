import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { PropertyCard } from "../components/PropertyCard";
import type { ListingIntent, PropertyCategory } from "../data/properties";
import "./Listings.css";

type Props = {
  intent?: ListingIntent | "all";
  category: PropertyCategory;
  title: string;
  heading: string;
  description: string;
  path: string;
};

function ListingsPage({
  intent = "all",
  category,
  title,
  heading,
  description,
  path,
}: Props) {
  const { properties } = useCms();
  const [params, setParams] = useSearchParams();
  const locality = params.get("locality") || "all";
  const bhk = params.get("bhk") || "all";
  const q = params.get("q") || "";
  const intentFilter = params.get("intent") || intent;

  const results = useMemo(() => {
    return properties.filter((p) => {
      if (p.status !== "available" && p.status !== "under-offer") return false;
      if (p.category !== category) return false;
      if (intentFilter !== "all" && p.intent !== intentFilter) return false;
      if (locality !== "all" && p.locality !== locality) return false;
      if (category === "residential" && bhk !== "all" && p.bhk !== Number(bhk))
        return false;
      if (q) {
        const hay = `${p.title} ${p.society || ""} ${p.localityLabel} ${p.type}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [properties, category, intentFilter, locality, bhk, q]);

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === "all") next.delete(key);
    else next.set(key, value);
    setParams(next);
  };

  return (
    <div>
      <SEO title={title} description={description} path={path} />
      <section className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">Listings</span>
          <h1>{heading}</h1>
          <p>{description}</p>
        </div>
      </section>

      <section className="section section--tight">
        <div className="container">
          <div className="listing-filters">
            {category === "commercial" || intent === "all" ? (
              <label>
                Type
                <select
                  value={intentFilter}
                  onChange={(e) => update("intent", e.target.value)}
                >
                  <option value="all">Sale & rent</option>
                  <option value="sale">For sale</option>
                  <option value="rent">For rent</option>
                </select>
              </label>
            ) : null}
            <label>
              Locality
              <select
                value={locality}
                onChange={(e) => update("locality", e.target.value)}
              >
                <option value="all">All</option>
                <option value="mira-road">Mira Road</option>
                <option value="dahisar">Dahisar</option>
                <option value="bhayandar">Bhayandar</option>
              </select>
            </label>
            {category === "residential" ? (
              <label>
                BHK
                <select value={bhk} onChange={(e) => update("bhk", e.target.value)}>
                  <option value="all">Any</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </label>
            ) : null}
            <label className="listing-filters__search">
              Search
              <input
                value={q}
                placeholder="Society, keyword…"
                onChange={(e) => update("q", e.target.value)}
              />
            </label>
          </div>

          <p className="listing-count">{results.length} properties</p>

          {results.length ? (
            <div className="property-grid">
              {results.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No matches right now</h3>
              <p>WhatsApp us your brief, we often have off-market options.</p>
              <Link className="btn btn--brass" to="/contact">
                Contact us
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export function Buy() {
  return (
    <ListingsPage
      intent="sale"
      category="residential"
      heading="Homes for sale"
      title="Homes for sale in Dahisar, Mira Road & Bhayandar | DisplayAvenue"
      description="Browse residential flats for sale across Mira Road, Dahisar and Bhayandar. Filter by locality and BHK, then book a site visit on WhatsApp."
      path="/buy"
    />
  );
}

export function Rent() {
  return (
    <ListingsPage
      intent="rent"
      category="residential"
      heading="Homes for rent"
      title="Flats for rent in Mira Road, Dahisar & Bhayandar | DisplayAvenue"
      description="Find rental homes in Mira Road, Dahisar and Bhayandar. Semi-furnished and fully furnished options with fast visit coordination."
      path="/rent"
    />
  );
}

export function Commercial() {
  return (
    <ListingsPage
      intent="all"
      category="commercial"
      heading="Commercial spaces"
      title="Commercial property | Shops, offices & warehouses"
      description="Shops, offices and warehouses for sale or rent across Dahisar, Mira Road and Bhayandar."
      path="/commercial"
    />
  );
}

import { useNavigate } from "react-router-dom";
import { useState, type FormEvent } from "react";
import "./PropertySearch.css";

type Props = {
  compact?: boolean;
  defaultIntent?: "sale" | "rent" | "commercial";
};

export function PropertySearch({ compact, defaultIntent = "sale" }: Props) {
  const navigate = useNavigate();
  const [intent, setIntent] = useState(defaultIntent);
  const [locality, setLocality] = useState("all");
  const [bhk, setBhk] = useState("all");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locality !== "all") params.set("locality", locality);
    if (bhk !== "all" && intent !== "commercial") params.set("bhk", bhk);

    if (intent === "commercial") {
      navigate(`/commercial?${params.toString()}`);
    } else if (intent === "rent") {
      navigate(`/rent?${params.toString()}`);
    } else {
      navigate(`/buy?${params.toString()}`);
    }
  };

  return (
    <form
      className={`property-search ${compact ? "property-search--compact" : ""}`}
      onSubmit={onSubmit}
    >
      <div className="property-search__field">
        <label htmlFor="intent">I want to</label>
        <select
          id="intent"
          value={intent}
          onChange={(e) => setIntent(e.target.value as typeof intent)}
        >
          <option value="sale">Buy a home</option>
          <option value="rent">Rent a home</option>
          <option value="commercial">Find commercial</option>
        </select>
      </div>
      <div className="property-search__field">
        <label htmlFor="locality">Locality</label>
        <select
          id="locality"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
        >
          <option value="all">All areas</option>
          <option value="mira-road">Mira Road</option>
          <option value="dahisar">Dahisar</option>
          <option value="bhayandar">Bhayandar</option>
        </select>
      </div>
      {intent !== "commercial" ? (
        <div className="property-search__field">
          <label htmlFor="bhk">BHK</label>
          <select id="bhk" value={bhk} onChange={(e) => setBhk(e.target.value)}>
            <option value="all">Any</option>
            <option value="1">1 BHK</option>
            <option value="2">2 BHK</option>
            <option value="3">3 BHK</option>
          </select>
        </div>
      ) : null}
      <button className="btn btn--brass property-search__submit" type="submit">
        Search
      </button>
    </form>
  );
}

import { useCms } from "../cms/CmsProvider";
import "./TrustStats.css";

export type TrustStat = {
  value: string;
  label: string;
};

const fallbackStats: TrustStat[] = [
  { value: "850+", label: "Projects delivered" },
  { value: "120+", label: "Brand & wedding clients" },
  { value: "11", label: "Industry verticals" },
  { value: "18", label: "Cities across India" },
  { value: "4.9★", label: "Average client rating" },
];

export function TrustStats({ compact = false }: { compact?: boolean }) {
  const { company } = useCms();
  const stats = ((company as { stats?: TrustStat[] }).stats?.length
    ? (company as { stats?: TrustStat[] }).stats
    : fallbackStats) as TrustStat[];

  return (
    <div className={`trust-stats ${compact ? "trust-stats--compact" : ""}`}>
      {stats.map((stat) => (
        <div key={stat.label} className="trust-stats__item reveal">
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

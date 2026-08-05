import type { ServiceTip } from "../data/services";
import "./ServiceTips.css";

type Props = {
  serviceTitle: string;
  tips: ServiceTip[];
};

export function ServiceTips({ serviceTitle, tips }: Props) {
  const list = (tips || []).filter((t) => t?.title && t?.text);
  if (!list.length) return null;

  return (
    <section className="section service-tips" aria-label={`${serviceTitle} tips and facts`}>
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow">Tips &amp; facts</p>
          <h2>Smart notes before you book {serviceTitle}</h2>
          <p>
            Practical guidance from our Mumbai studio team — use these to plan
            better shoots and get more from your investment.
          </p>
        </div>

        <ol className="service-tips__grid">
          {list.map((tip, i) => (
            <li key={`${tip.title}-${i}`} className="service-tip-card">
              <span className="service-tip-card__num" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{tip.title}</h3>
                <p>{tip.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

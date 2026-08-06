import type { ReactNode } from "react";
import { useCms } from "../cms/CmsProvider";
import "./SiteLoader.css";

export function SiteLoader({ children }: { children: ReactNode }) {
  const { ready } = useCms();

  if (!ready) {
    return (
      <div className="site-loader" role="status" aria-live="polite">
        <div className="site-loader__mark">DA</div>
        <p>Loading DisplayAvenue Studios…</p>
      </div>
    );
  }

  return children;
}

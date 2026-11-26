/**
 * Build-time prerender entry. Renders a route to static HTML so search engines and
 * AI crawlers (GPTBot, ClaudeBot, PerplexityBot…) that do not run JavaScript see the
 * full page content. The browser app still mounts normally on top of it.
 */
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import "./styles/tokens.css";
import "./styles/motion.css";
import { CmsProvider, buildCms, type RawCms } from "./cms/CmsProvider";
import { AppRoutes } from "./App";
import { collectJsonLd, type JsonLdSink } from "./components/SEO";

export function render(url: string, raw: RawCms) {
  const cms = buildCms(raw);
  const sink: JsonLdSink = new Map();
  const html = collectJsonLd(sink, () =>
    renderToString(
      <StrictMode>
        <CmsProvider initial={cms}>
          <StaticRouter location={url}>
            <AppRoutes />
          </StaticRouter>
        </CmsProvider>
      </StrictMode>,
    ),
  );
  return { html, jsonLd: [...sink.entries()].map(([id, data]) => ({ id, data })) };
}

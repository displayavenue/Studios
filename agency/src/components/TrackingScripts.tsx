import { useEffect } from "react";
import { useCms } from "../cms/CmsProvider";

function injectHtmlFragment(html: string, target: HTMLElement, markerId: string) {
  if (!html.trim()) return;
  if (document.querySelector(`[data-cms-tracking="${markerId}"]`)) return;

  const tpl = document.createElement("template");
  tpl.innerHTML = html.trim();

  tpl.content.querySelectorAll("script").forEach((script) => {
    const el = document.createElement("script");
    el.setAttribute("data-cms-tracking", markerId);
    script.getAttributeNames().forEach((name) => {
      const value = script.getAttribute(name);
      if (value != null) el.setAttribute(name, value);
    });
    el.textContent = script.textContent;
    target.appendChild(el);
  });

  tpl.content.childNodes.forEach((node) => {
    if (node.nodeName === "SCRIPT") return;
    const clone = node.cloneNode(true);
    if (clone instanceof HTMLElement) clone.setAttribute("data-cms-tracking", markerId);
    target.appendChild(clone);
  });
}

function injectGoogleTagManager(containerId: string, gtmId: string) {
  if (document.getElementById(containerId)) return;

  window.dataLayer = window.dataLayer || [];
  const script = document.createElement("script");
  script.id = containerId;
  script.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`;
  document.head.appendChild(script);
}

function injectGtmNoscript(markerId: string, gtmId: string) {
  if (document.querySelector(`[data-cms-tracking="${markerId}"]`)) return;

  const noscript = document.createElement("noscript");
  noscript.setAttribute("data-cms-tracking", markerId);
  noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  document.body.insertBefore(noscript, document.body.firstChild);
}

function injectGoogleAnalytics(markerId: string, measurementId: string, adsId?: string) {
  if (document.querySelector(`script[data-cms-tracking="${markerId}"]`)) return;

  const loader = document.createElement("script");
  loader.async = true;
  loader.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  loader.setAttribute("data-cms-tracking", markerId);
  document.head.appendChild(loader);

  const config = document.createElement("script");
  config.setAttribute("data-cms-tracking", markerId);
  const adsLine = adsId ? `gtag('config', '${adsId}');` : "";
  config.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}');${adsLine}`;
  document.head.appendChild(config);
}

function injectMetaPixel(markerId: string, pixelId: string) {
  if (document.querySelector(`script[data-cms-tracking="${markerId}"]`)) return;

  const script = document.createElement("script");
  script.setAttribute("data-cms-tracking", markerId);
  script.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`;
  document.head.appendChild(script);

  const noscript = document.createElement("noscript");
  noscript.setAttribute("data-cms-tracking", `${markerId}-ns`);
  noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" alt="" />`;
  document.body.insertBefore(noscript, document.body.firstChild);
}

function ensureSiteVerification(content: string) {
  const value = content.trim();
  if (!value) return;
  let meta = document.querySelector('meta[name="google-site-verification"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "google-site-verification");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", value);
}

export function TrackingScripts() {
  const { tracking, ready } = useCms();

  useEffect(() => {
    if (!ready) return;
    if (tracking.enabled === false) return;

    const gtmId = tracking.googleTagManagerId?.trim();
    if (gtmId) {
      injectGoogleTagManager("cms-gtm", gtmId);
      injectGtmNoscript("cms-gtm-noscript", gtmId);
    }

    const gaId = tracking.googleAnalyticsId?.trim();
    const adsId = tracking.googleAdsId?.trim();
    if (gaId) {
      injectGoogleAnalytics("cms-ga", gaId, adsId || undefined);
    } else if (adsId) {
      injectGoogleAnalytics("cms-ga", adsId, adsId);
    }

    const metaId = tracking.metaPixelId?.trim();
    if (metaId) injectMetaPixel("cms-meta", metaId);

    ensureSiteVerification(tracking.googleSiteVerification || "");

    injectHtmlFragment(tracking.headScripts || "", document.head, "cms-head-custom");
    injectHtmlFragment(tracking.bodyStartHtml || "", document.body, "cms-body-custom");
  }, [ready, tracking]);

  return null;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

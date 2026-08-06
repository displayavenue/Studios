const API = "./api.php";

const state = {
  authed: false,
  collections: {},
  current: null,
  data: null,
  dirty: false,
};

const $ = (sel) => document.querySelector(sel);

async function api(action, payload = null) {
  const opts = {
    method: payload ? "POST" : "GET",
    credentials: "include",
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify({ action, ...payload }) : undefined,
  };
  const url = payload
    ? API
    : `${API}?action=${encodeURIComponent(action)}${
        payload?.collection
          ? `&collection=${encodeURIComponent(payload.collection)}`
          : ""
      }`;
  const res = await fetch(url, opts);
  const json = await res.json().catch(() => ({ ok: false, error: "Invalid response" }));
  if (!res.ok || json.ok === false) {
    const err = new Error(json.error || "Request failed");
    err.status = res.status;
    throw err;
  }
  return json;
}

function toast(msg, type = "ok") {
  const el = $("#toast");
  el.hidden = false;
  el.className = `toast ${type}`;
  el.textContent = msg;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.hidden = true;
  }, 2800);
}

function setDirty(v) {
  state.dirty = v;
  const btn = $("#save-btn");
  btn.disabled = !v;
  btn.textContent = v ? "Save changes *" : "Save changes";
  document.body.classList.toggle("is-dirty", !!v);
}

function showLogin(show) {
  $("#login-view").hidden = !show;
  $("#cms-view").hidden = show;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
function escapeAttr(s) {
  return escapeHtml(s).replaceAll('"', "&quot;");
}

function getByPath(obj, path) {
  return path.split(".").reduce((a, k) => (a == null ? a : a[k]), obj);
}

function setByPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const k = parts[i];
    if (cur[k] == null || typeof cur[k] !== "object") cur[k] = {};
    cur = cur[k];
  }
  cur[parts[parts.length - 1]] = value;
}

function field(label, path, value, type = "text") {
  const id = path.replace(/[^a-z0-9]/gi, "_");
  const isArea =
    type === "textarea" || (typeof value === "string" && value.length > 90);
  const control = isArea
    ? `<textarea data-path="${path}" id="${id}">${escapeHtml(value ?? "")}</textarea>`
    : type === "checkbox"
      ? `<input type="checkbox" data-path="${path}" id="${id}" ${value ? "checked" : ""} />`
      : `<input type="${type}" data-path="${path}" id="${id}" value="${escapeAttr(value ?? "")}" />`;
  return `<div class="field ${isArea ? "full" : ""}"><label for="${id}">${label}</label>${control}</div>`;
}

function bindFields(root = $("#editor-wrap")) {
  root.querySelectorAll("[data-path]").forEach((el) => {
    const handler = () => {
      const path = el.getAttribute("data-path");
      let value;
      if (el.type === "checkbox") value = el.checked;
      else if (el.getAttribute("data-array") === "true") {
        value = el.value
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      } else if (el.getAttribute("data-json") === "true") {
        try {
          value = JSON.parse(el.value);
          el.classList.remove("invalid");
        } catch {
          el.classList.add("invalid");
          return;
        }
      } else value = el.value;
      setByPath(state.data, path, value);
      setDirty(true);
    };
    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
  });
}

function renderNav() {
  const nav = $("#nav");
  nav.innerHTML = Object.entries(state.collections)
    .map(
      ([key, label]) =>
        `<button type="button" data-key="${key}" class="${
          state.current === key ? "active" : ""
        }">${escapeHtml(label)}</button>`,
    )
    .join("");
  nav.querySelectorAll("button").forEach((btn) => {
    btn.onclick = () => openCollection(btn.dataset.key);
  });
}

async function openCollection(key) {
  if (state.dirty && !confirm("Discard unsaved changes?")) return;
  try {
    const url = `${API}?action=get&collection=${encodeURIComponent(key)}`;
    const r = await fetch(url, { credentials: "include" });
    const json = await r.json();
    if (!r.ok || json.ok === false) throw new Error(json.error || "Load failed");
    state.current = key;
    state.data = json.data;
    setDirty(false);
    $("#panel-title").textContent = state.collections[key] || key;
    $("#panel-sub").textContent = `Editing ${key}.json - Save to publish.`;
    renderNav();
    renderEditor();
  } catch (e) {
    toast(e.message, "err");
  }
}

function renderEditor() {
  const wrap = $("#editor-wrap");
  const d = state.data;
  const key = state.current;
  if (!d || !key) {
    wrap.innerHTML = `<p class="empty">Select a collection from the left.</p>`;
    return;
  }
  const map = {
    company: renderCompany,
    home: renderHome,
    services: () => renderCatalog(d, "Service"),
    industries: () => renderCatalog(d, "Industry"),
    packages: () => renderCatalog(d, "Package"),
    solutions: () => renderCatalog(d, "Solution"),
    ai: () => renderCatalog(d, "AI Suite"),
    tools: () => renderCatalog(d, "Tool category"),
    cases: () => renderCatalog(d, "Case study"),
    projects: () => renderCatalog(d, "Project"),
    resources: () => renderCatalog(d, "Resource"),
    content: renderContent,
    tracking: renderTracking,
    settings: renderSettings,
  };
  wrap.innerHTML = (map[key] || (() => `<pre>${escapeHtml(JSON.stringify(d, null, 2))}</pre>`))(d);
  bindFields(wrap);
  wrap.querySelectorAll("[data-action]").forEach((btn) => {
    btn.onclick = () => handleAction(btn.dataset.action, btn.dataset.index);
  });
}

function card(title, body) {
  return `<section class="card"><h3>${title}</h3><div class="grid">${body}</div></section>`;
}

function renderCompany(d) {
  const nav = (d.navItems || [])
    .map(
      (item, i) => `
      <div class="list-item">
        <div class="list-item-head">
          <strong>${escapeHtml(item.label || "Nav item")}</strong>
          <button type="button" class="btn btn-ghost" data-action="del-nav" data-index="${i}">Delete</button>
        </div>
        <div class="grid">
          ${field("Label", `navItems.${i}.label`, item.label)}
          ${field("Href", `navItems.${i}.href`, item.href)}
          ${field("Mega key (false or whatWeDo/industries/solutions/aiPlatform)", `navItems.${i}.mega`, item.mega === false ? "false" : item.mega || "")}
        </div>
      </div>`,
    )
    .join("");

  const stats = Object.keys(d.stats || {})
    .map((k) => field(k, `stats.${k}`, d.stats[k]))
    .join("");

  return `
    ${card(
      "Brand & contact",
      `
      ${field("Name", "name", d.name)}
      ${field("Short name", "shortName", d.shortName)}
      ${field("Tagline", "tagline", d.tagline)}
      ${field("Website", "website", d.website)}
      ${field("Phone", "phone", d.phone)}
      ${field("Phone href", "phoneHref", d.phoneHref)}
      ${field("WhatsApp", "whatsapp", d.whatsapp)}
      ${field("WhatsApp href", "whatsappHref", d.whatsappHref)}
      ${field("Email", "email", d.email)}
      ${field("Email href", "emailHref", d.emailHref)}
      ${field("Client login URL", "clientLogin", d.clientLogin)}
      ${field("Announcement bar", "announcement", d.announcement, "textarea")}
    `,
    )}
    ${card(
      "Address",
      `
      ${field("City", "address.city", d.address?.city)}
      ${field("Hours", "address.hours", d.address?.hours)}
      <div class="field full"><label>Address lines (one per line)</label>
        <textarea data-path="address.lines" data-array="true">${escapeHtml((d.address?.lines || []).join("\n"))}</textarea>
      </div>
    `,
    )}
    ${card(
      "Google Maps / GMB",
      `
      ${field("Business name on Google", "googleMaps.name", d.googleMaps?.name || "")}
      ${field("Share / GMB link", "googleMaps.shareUrl", d.googleMaps?.shareUrl || "")}
      ${field("Google profile / search URL", "googleMaps.profileUrl", d.googleMaps?.profileUrl || "")}
      ${field("Maps embed URL", "googleMaps.embedUrl", d.googleMaps?.embedUrl || "", "textarea")}
      ${field("Knowledge Graph ID (kgmid)", "googleMaps.kgmid", d.googleMaps?.kgmid || "")}
    `,
    )}
    ${card(
      "Socials",
      `
      ${field("Facebook", "socials.facebook", d.socials?.facebook)}
      ${field("Instagram", "socials.instagram", d.socials?.instagram)}
      ${field("LinkedIn", "socials.linkedin", d.socials?.linkedin)}
      ${field("YouTube", "socials.youtube", d.socials?.youtube)}
    `,
    )}
    ${card("Stats (header / trust)", stats)}
    <section class="card">
      <div class="list-item-head">
        <h3>Header navigation</h3>
        <button type="button" class="btn btn-gold" data-action="add-nav">Add nav item</button>
      </div>
      ${nav || "<p class='empty'>No nav items</p>"}
    </section>
  `;
}

function renderHome(d) {
  return `
    ${card(
      "SEO",
      `
      ${field("SEO title", "seo.title", d.seo?.title || "")}
      ${field("SEO description", "seo.description", d.seo?.description || "", "textarea")}
    `,
    )}
    ${card(
      "Hero",
      `
      ${field("Eyebrow", "hero.eyebrow", d.hero?.eyebrow)}
      ${field("Title (before accent)", "hero.titleBefore", d.hero?.titleBefore)}
      ${field("Title accent", "hero.titleAccent", d.hero?.titleAccent)}
      ${field("Lead", "hero.lead", d.hero?.lead, "textarea")}
      ${field("Primary CTA label", "hero.primaryCta", d.hero?.primaryCta)}
      ${field("Primary CTA link", "hero.primaryCtaHref", d.hero?.primaryCtaHref || "/contact")}
      ${field("Secondary CTA label", "hero.secondaryCta", d.hero?.secondaryCta)}
      ${field("Secondary CTA link", "hero.secondaryCtaHref", d.hero?.secondaryCtaHref || "/contact")}
      ${field("Showreel label", "hero.showreelLabel", d.hero?.showreelLabel || "")}
      ${field("Showreel link", "hero.showreelHref", d.hero?.showreelHref || "/portfolio")}
      ${field("Portfolio label", "hero.portfolioLabel", d.hero?.portfolioLabel || "")}
      ${field("Portfolio link", "hero.portfolioHref", d.hero?.portfolioHref || "/portfolio")}
    `,
    )}
    ${card(
      "Hero dashboard + AI assist",
      `
      <div class="field full"><label>Hero dashboard JSON</label>
        <textarea data-path="heroDashboard" data-json="true">${escapeHtml(JSON.stringify(d.heroDashboard || {}, null, 2))}</textarea>
      </div>
      <div class="field full"><label>AI assist JSON (actions with href)</label>
        <textarea data-path="aiAssist" data-json="true">${escapeHtml(JSON.stringify(d.aiAssist || {}, null, 2))}</textarea>
      </div>
    `,
    )}
    ${card(
      "Trust & partners",
      `
      ${field("Trust label", "trustLabel", d.trustLabel)}
      <div class="field full"><label>Partners (one per line)</label>
        <textarea data-path="partners" data-array="true">${escapeHtml((d.partners || []).join("\n"))}</textarea>
      </div>
    `,
    )}
    ${card(
      "Services section",
      `
      ${field("Services title", "servicesTitle", d.servicesTitle)}
      ${field("Services subtitle", "servicesSub", d.servicesSub)}
      <div class="field full"><label>Service cards JSON (title, desc, icon, color, href)</label>
        <textarea data-path="services" data-json="true">${escapeHtml(JSON.stringify(d.services || [], null, 2))}</textarea>
      </div>
      <div class="field full"><label>All-services card JSON</label>
        <textarea data-path="allServicesCard" data-json="true">${escapeHtml(JSON.stringify(d.allServicesCard || {}, null, 2))}</textarea>
      </div>
    `,
    )}
    ${card(
      "AI banner",
      `
      <div class="field full"><label>AI banner JSON</label>
        <textarea data-path="aiBanner" data-json="true">${escapeHtml(JSON.stringify(d.aiBanner || {}, null, 2))}</textarea>
      </div>
    `,
    )}
    ${card(
      "Industries",
      `
      ${field("Industries title", "industriesTitle", d.industriesTitle || "")}
      ${field("CTA label", "industriesCtaLabel", d.industriesCtaLabel || "")}
      ${field("CTA link", "industriesCtaHref", d.industriesCtaHref || "/industries")}
      <div class="field full"><label>Industry slugs (one per line - must exist in Industries CMS)</label>
        <textarea data-path="industrySlugs" data-array="true">${escapeHtml((d.industrySlugs || []).join("\n"))}</textarea>
      </div>
    `,
    )}
    ${card(
      "Challenges & packages",
      `
      ${field("Challenges title", "challengesTitle", d.challengesTitle || "")}
      <div class="field full"><label>Challenge links JSON (label, desc, href, icon)</label>
        <textarea data-path="challengeLinks" data-json="true">${escapeHtml(JSON.stringify(d.challengeLinks || [], null, 2))}</textarea>
      </div>
      ${field("Packages title", "packagesTitle", d.packagesTitle || "")}
      ${field("Packages subtitle", "packagesSub", d.packagesSub || "")}
      <div class="field full"><label>Featured packages JSON (include href to /packages/...)</label>
        <textarea data-path="packages" data-json="true">${escapeHtml(JSON.stringify(d.packages || [], null, 2))}</textarea>
      </div>
      <div class="field full"><label>Package pills (one per line)</label>
        <textarea data-path="packagePills" data-array="true">${escapeHtml((d.packagePills || []).join("\n"))}</textarea>
      </div>
    `,
    )}
    ${card(
      "Tools, cases, testimonials, insights",
      `
      ${field("Tools title", "toolsTitle", d.toolsTitle || "")}
      ${field("Tools CTA label", "toolsCtaLabel", d.toolsCtaLabel || "")}
      ${field("Tools CTA link", "toolsCtaHref", d.toolsCtaHref || "/free-tools")}
      <div class="field full"><label>Tool category slugs (one per line)</label>
        <textarea data-path="toolCategorySlugs" data-array="true">${escapeHtml((d.toolCategorySlugs || []).join("\n"))}</textarea>
      </div>
      ${field("Cases title", "casesTitle", d.casesTitle || "")}
      <div class="field full"><label>Case study slugs (one per line)</label>
        <textarea data-path="caseSlugs" data-array="true">${escapeHtml((d.caseSlugs || []).join("\n"))}</textarea>
      </div>
      ${field("Testimonials title", "testimonialsTitle", d.testimonialsTitle || "")}
      ${field("Insights title", "insightsTitle", d.insightsTitle || "")}
      ${field("Insights CTA label", "insightsCtaLabel", d.insightsCtaLabel || "")}
      ${field("Insights CTA link", "insightsCtaHref", d.insightsCtaHref || "/resources")}
      <div class="field full"><label>Insight cards JSON (title, date, href, gradient)</label>
        <textarea data-path="insightLinks" data-json="true">${escapeHtml(JSON.stringify(d.insightLinks || [], null, 2))}</textarea>
      </div>
    `,
    )}
    ${card(
      "Google location / GMB section",
      `
      <div class="field full"><label>Location section JSON (enabled, title, sub, ctaLabel, directionsLabel)</label>
        <textarea data-path="location" data-json="true">${escapeHtml(JSON.stringify(d.location || {}, null, 2))}</textarea>
      </div>
      <p class="hint">Map URLs themselves are edited under Header/Company → Google Maps / GMB.</p>
    `,
    )}
  `;
}

function blankCatalogItem(kind) {
  const slug = `new-${kind.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;
  return {
    slug,
    kind: kind.toLowerCase().includes("service")
      ? "service"
      : kind.toLowerCase().includes("industry")
        ? "industry"
        : "service",
    title: `New ${kind}`,
    category: kind,
    icon: "grid",
    color: "#0056ff",
    eyebrow: kind,
    headline: `New ${kind} headline`,
    summary: "Edit this summary in the CMS.",
    benefits: [
      { title: "Benefit 1", desc: "Describe the benefit." },
      { title: "Benefit 2", desc: "Describe the benefit." },
    ],
    deliverables: ["Deliverable 1", "Deliverable 2", "Deliverable 3"],
    process: [
      { title: "Discover", desc: "Step description" },
      { title: "Plan", desc: "Step description" },
      { title: "Launch", desc: "Step description" },
      { title: "Optimize", desc: "Step description" },
    ],
    faqs: [{ q: "Sample question?", a: "Sample answer." }],
    intro: "Edit this longer intro in the CMS. Write like a human explaining the service.",
    sections: [
      { title: "How we work", body: "Describe your approach." },
      { title: "What clients get", body: "Describe outcomes." },
    ],
    whoItsFor: ["Founders", "Marketing teams"],
    longTailKeywords: ["service in mumbai", "best agency india"],
    locations: [
      { city: "Mumbai", region: "Maharashtra", country: "India", note: "HQ & workshops" },
    ],
    reviews: [
      {
        name: "Sample Client",
        role: "Founder",
        company: "Example brand",
        city: "Mumbai",
        rating: 5,
        quote: "Replace with a real client review.",
      },
    ],
    seo: {
      title: "",
      description: "",
      keywords: [],
    },
    related: [
      { label: "Contact", href: "/contact" },
      { label: "Packages", href: "/packages" },
    ],
    metrics: [
      { value: "850+", label: "Projects" },
      { value: "98%", label: "Satisfaction" },
    ],
    ctaLabel: "Get Free Proposal",
  };
}

function renderCatalog(d, kindLabel) {
  if (!Array.isArray(d.items)) d.items = [];
  const items = d.items
    .map((item, i) => {
      const benefits = (item.benefits || [])
        .map(
          (b, bi) => `
        <div class="grid">
          ${field("Benefit title", `items.${i}.benefits.${bi}.title`, b.title)}
          ${field("Benefit desc", `items.${i}.benefits.${bi}.desc`, b.desc, "textarea")}
        </div>`,
        )
        .join("");
      const faqs = (item.faqs || [])
        .map(
          (f, fi) => `
        <div class="grid">
          ${field("FAQ question", `items.${i}.faqs.${fi}.q`, f.q)}
          ${field("FAQ answer", `items.${i}.faqs.${fi}.a`, f.a, "textarea")}
        </div>`,
        )
        .join("");
      return `
      <details class="list-item" ${i < 3 ? "open" : ""}>
        <summary class="list-item-head">
          <strong>${escapeHtml(item.title || item.slug || kindLabel)}</strong>
          <span style="display:flex;gap:.5rem;align-items:center">
            <code>${escapeHtml(item.slug || "")}</code>
            <button type="button" class="btn btn-ghost" data-action="del-item" data-index="${i}">Delete</button>
          </span>
        </summary>
        <div class="grid" style="margin-top:.75rem">
          ${field("Slug (URL)", `items.${i}.slug`, item.slug)}
          ${field("Title", `items.${i}.title`, item.title)}
          ${field("Category", `items.${i}.category`, item.category)}
          ${field("Icon key", `items.${i}.icon`, item.icon)}
          ${field("Color", `items.${i}.color`, item.color, "color")}
          ${field("Eyebrow", `items.${i}.eyebrow`, item.eyebrow)}
          ${field("Headline", `items.${i}.headline`, item.headline, "textarea")}
          ${field("Summary", `items.${i}.summary`, item.summary, "textarea")}
          ${field("Long intro", `items.${i}.intro`, item.intro || "", "textarea")}
          ${field("CTA label", `items.${i}.ctaLabel`, item.ctaLabel)}
          ${field("SEO title", `items.${i}.seo.title`, item.seo?.title || "")}
          ${field("SEO description", `items.${i}.seo.description`, item.seo?.description || "", "textarea")}
          <div class="field full"><label>Long-tail keywords (one per line)</label>
            <textarea data-path="items.${i}.longTailKeywords" data-array="true">${escapeHtml((item.longTailKeywords || item.seo?.keywords || []).join("\n"))}</textarea>
          </div>
          <div class="field full"><label>Who it's for (one per line)</label>
            <textarea data-path="items.${i}.whoItsFor" data-array="true">${escapeHtml((item.whoItsFor || []).join("\n"))}</textarea>
          </div>
          <div class="field full"><label>Deliverables (one per line)</label>
            <textarea data-path="items.${i}.deliverables" data-array="true">${escapeHtml((item.deliverables || []).join("\n"))}</textarea>
          </div>
        </div>
        <h4 style="margin:1rem 0 .5rem">Benefits</h4>
        ${benefits || "<p class='empty'>No benefits</p>"}
        <button type="button" class="btn btn-ghost" data-action="add-benefit" data-index="${i}">+ Benefit</button>
        <h4 style="margin:1rem 0 .5rem">FAQs (unique per service)</h4>
        ${faqs || "<p class='empty'>No FAQs</p>"}
        <button type="button" class="btn btn-ghost" data-action="add-faq" data-index="${i}">+ FAQ</button>
        <div class="field full" style="margin-top:1rem"><label>Content sections JSON</label>
          <textarea data-path="items.${i}.sections" data-json="true">${escapeHtml(JSON.stringify(item.sections || [], null, 2))}</textarea>
        </div>
        <div class="field full"><label>Locations JSON (cities you serve)</label>
          <textarea data-path="items.${i}.locations" data-json="true">${escapeHtml(JSON.stringify(item.locations || [], null, 2))}</textarea>
        </div>
        <div class="field full"><label>Reviews JSON (20+ recommended)</label>
          <textarea data-path="items.${i}.reviews" data-json="true">${escapeHtml(JSON.stringify(item.reviews || [], null, 2))}</textarea>
        </div>
        <div class="field full"><label>Related links JSON</label>
          <textarea data-path="items.${i}.related" data-json="true">${escapeHtml(JSON.stringify(item.related || [], null, 2))}</textarea>
        </div>
        <div class="field full"><label>Process JSON</label>
          <textarea data-path="items.${i}.process" data-json="true">${escapeHtml(JSON.stringify(item.process || [], null, 2))}</textarea>
        </div>
        <div class="field full"><label>Metrics JSON</label>
          <textarea data-path="items.${i}.metrics" data-json="true">${escapeHtml(JSON.stringify(item.metrics || [], null, 2))}</textarea>
        </div>
        <div class="field full"><label>SEO object JSON</label>
          <textarea data-path="items.${i}.seo" data-json="true">${escapeHtml(JSON.stringify(item.seo || {}, null, 2))}</textarea>
        </div>
      </details>`;
    })
    .join("");

  return `
    <section class="card">
      <div class="list-item-head">
        <div>
          <h3>${escapeHtml(kindLabel)} pages (${d.items.length})</h3>
          <p class="hint">Each item is a full website page. Slug becomes the URL. Edit intro, FAQs, reviews, locations, and keywords - Save updates the live JSON instantly.</p>
        </div>
        <button type="button" class="btn btn-gold" data-action="add-item" data-index="${escapeAttr(kindLabel)}">Add ${escapeHtml(kindLabel)}</button>
      </div>
      ${items || "<p class='empty'>No items yet</p>"}
    </section>
  `;
}

function renderContent(d) {
  const testimonials = (d.testimonials || [])
    .map(
      (t, i) => `
      <div class="list-item">
        <div class="list-item-head">
          <strong>${escapeHtml(t.name || "Testimonial")}</strong>
          <button type="button" class="btn btn-ghost" data-action="del-testimonial" data-index="${i}">Delete</button>
        </div>
        <div class="grid">
          ${field("Quote", `testimonials.${i}.quote`, t.quote, "textarea")}
          ${field("Name", `testimonials.${i}.name`, t.name)}
          ${field("Title", `testimonials.${i}.title`, t.title)}
          ${field("Rating", `testimonials.${i}.rating`, t.rating, "number")}
        </div>
      </div>`,
    )
    .join("");

  return `
    <section class="card">
      <div class="list-item-head">
        <h3>Testimonials</h3>
        <button type="button" class="btn btn-gold" data-action="add-testimonial">Add testimonial</button>
      </div>
      ${testimonials}
    </section>
    ${card(
      "Client logos & footer CTA",
      `
      <div class="field full"><label>Client logos (one per line)</label>
        <textarea data-path="clientLogos" data-array="true">${escapeHtml((d.clientLogos || []).join("\n"))}</textarea>
      </div>
      ${field("Footer CTA title", "footerCta.title", d.footerCta?.title)}
      ${field("Footer CTA sub", "footerCta.sub", d.footerCta?.sub, "textarea")}
    `,
    )}
  `;
}

function renderTracking(d) {
  return `
  <div class="card">
    <h3>Tracking &amp; ad pixels</h3>
    <p style="color:var(--muted);font-size:.92rem;line-height:1.55;margin:0 0 1rem">
      Google Tag Manager, Google Analytics, Google Ads, Meta (Facebook) Pixel, and custom scripts from any ad or AI platform.
      Leave IDs blank until you have them - then <strong>Save changes</strong> and refresh the website (no rebuild needed).
    </p>
    <div class="grid">
      ${field("Enable all tracking", "enabled", d.enabled !== false, "checkbox")}
      ${field("Google Tag Manager ID (GTM-…)", "googleTagManagerId", d.googleTagManagerId || d.gtmId || "")}
      ${field("Google Analytics ID (G-…)", "googleAnalyticsId", d.googleAnalyticsId || d.gaId || "")}
      ${field("Google Ads tag ID (AW-…)", "googleAdsId", d.googleAdsId || "")}
      ${field("Meta Pixel ID", "metaPixelId", d.metaPixelId || "")}
      ${field("Google Search Console verification", "googleSiteVerification", d.googleSiteVerification || "")}
    </div>
    <div class="field full" style="margin-top:1rem">
      <label for="tracking_head_scripts">Additional &lt;head&gt; scripts</label>
      <textarea data-path="headScripts" id="tracking_head_scripts" rows="8" placeholder="Paste full &lt;script&gt; tags from Google Ads, LinkedIn, Microsoft, TikTok, AI ad platforms, etc.">${escapeHtml(d.headScripts || "")}</textarea>
      <p class="hint" style="color:#888;font-size:.85rem;margin-top:.5rem">Paste complete <code>&lt;script&gt;…&lt;/script&gt;</code> blocks exactly as your platform provides.</p>
    </div>
    <div class="field full" style="margin-top:1rem">
      <label for="tracking_body_html">Additional body snippets (noscript / pixels)</label>
      <textarea data-path="bodyStartHtml" id="tracking_body_html" rows="6" placeholder="Paste &lt;noscript&gt; or pixel fallback HTML">${escapeHtml(d.bodyStartHtml || "")}</textarea>
    </div>
  </div>`;
}

function renderSettings(d) {
  return `
  ${card(
    "Settings",
    `
    ${field("Site name", "siteName", d.siteName)}
    ${field("Site URL", "siteUrl", d.siteUrl)}
    ${field("Demo base path", "demoBasePath", d.demoBasePath)}
    ${field("Notes", "notes", d.notes, "textarea")}
  `,
  )}
  <div class="card">
    <h3>Marketing tags</h3>
    <p style="color:var(--muted);font-size:.92rem;line-height:1.55;margin:0">
      Add GTM, GA, Google Ads, Meta Pixel, and custom scripts under
      <strong>Tracking &amp; Pixels</strong> in the left sidebar. You can fill them in anytime later.
    </p>
  </div>`;
}

function handleAction(action, index) {
  const d = state.data;
  if (action === "add-nav") {
    d.navItems = d.navItems || [];
    d.navItems.push({ label: "New Link", href: "/", mega: false });
  } else if (action === "del-nav") {
    d.navItems.splice(Number(index), 1);
  } else if (action === "add-item") {
    d.items = d.items || [];
    d.items.unshift(blankCatalogItem(index || "Item"));
  } else if (action === "del-item") {
    if (!confirm("Delete this page item?")) return;
    d.items.splice(Number(index), 1);
  } else if (action === "add-benefit") {
    const item = d.items[Number(index)];
    item.benefits = item.benefits || [];
    item.benefits.push({ title: "New benefit", desc: "" });
  } else if (action === "add-faq") {
    const item = d.items[Number(index)];
    item.faqs = item.faqs || [];
    item.faqs.push({ q: "New question?", a: "" });
  } else if (action === "add-testimonial") {
    d.testimonials = d.testimonials || [];
    d.testimonials.push({ quote: "", name: "", title: "", rating: 5 });
  } else if (action === "del-testimonial") {
    d.testimonials.splice(Number(index), 1);
  } else return;

  // Normalize mega fields on nav when typed as "false"
  if (d.navItems) {
    d.navItems.forEach((n) => {
      if (n.mega === "false" || n.mega === "") n.mega = false;
    });
  }

  setDirty(true);
  renderEditor();
}

async function save() {
  if (!state.current || !state.data) return;
  // Coerce nav mega strings
  if (state.data.navItems) {
    state.data.navItems.forEach((n) => {
      if (n.mega === "false" || n.mega === "") n.mega = false;
    });
  }
  try {
    await api("save", { collection: state.current, data: state.data });
    setDirty(false);
    toast("Saved - refresh the website to see changes");
  } catch (e) {
    toast(e.message, "err");
  }
}

async function init() {
  $("#login-form").onsubmit = async (e) => {
    e.preventDefault();
    $("#login-error").hidden = true;
    try {
      await api("login", { password: $("#password").value });
      state.authed = true;
      const status = await api("status");
      state.collections = status.collections || {};
      showLogin(false);
      renderNav();
      const first = Object.keys(state.collections)[0];
      if (first) openCollection(first);
    } catch (err) {
      $("#login-error").hidden = false;
      $("#login-error").textContent = err.message;
    }
  };

  $("#logout-btn").onclick = async () => {
    await api("logout", {});
    state.authed = false;
    state.current = null;
    state.data = null;
    setDirty(false);
    showLogin(true);
  };

  $("#save-btn").onclick = save;
  $("#reload-btn").onclick = () => state.current && openCollection(state.current);

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      if (state.dirty) save();
    }
  });

  try {
    const status = await api("status");
    state.collections = status.collections || {};
    if (status.authenticated) {
      state.authed = true;
      showLogin(false);
      renderNav();
      const first = Object.keys(state.collections)[0];
      if (first) openCollection(first);
    } else showLogin(true);
  } catch {
    showLogin(true);
  }
}

init();

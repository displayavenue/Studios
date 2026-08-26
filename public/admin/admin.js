const API = "./api.php";

const state = {
  authed: false,
  collections: {},
  current: null,
  data: null,
  dirty: false,
};

const $ = (sel) => document.querySelector(sel);

async function api(action, payload = null, method = "GET") {
  const opts = {
    method: payload ? "POST" : method,
    credentials: "include",
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify({ action, ...payload }) : undefined,
  };
  const url = payload ? API : `${API}?action=${encodeURIComponent(action)}${payload?.collection ? `&collection=${encodeURIComponent(payload.collection)}` : ""}`;
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
  toast._t = setTimeout(() => { el.hidden = true; }, 2800);
}

function setDirty(v) {
  state.dirty = v;
  const btn = $("#save-btn");
  btn.disabled = !v;
  btn.textContent = v ? "Save changes *" : "Save changes";
  document.body.classList.toggle("is-dirty", !!v);
}

function showLogin(show) {
  const login = $("#login-view");
  const cms = $("#cms-view");
  if (!login || !cms) return;
  // show=true → login visible; show=false → CMS visible
  login.hidden = !show;
  cms.hidden = !!show;
  login.classList.toggle("is-hidden", !show);
  cms.classList.toggle("is-hidden", !!show);
  document.body.classList.toggle("is-authed", !show);
}

function field(label, path, value, type = "text") {
  const id = path.replace(/[^a-z0-9]/gi, "_");
  const isArea = type === "textarea" || (typeof value === "string" && value.length > 80);
  const control = isArea
    ? `<textarea data-path="${path}" id="${id}">${escapeHtml(value ?? "")}</textarea>`
    : type === "checkbox"
      ? `<input type="checkbox" data-path="${path}" id="${id}" ${value ? "checked" : ""} />`
      : `<input type="${type}" data-path="${path}" id="${id}" value="${escapeAttr(value ?? "")}" />`;
  return `<div class="field ${isArea ? "full" : ""}"><label for="${id}">${label}</label>${control}</div>`;
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
    const p = parts[i];
    if (cur[p] == null || typeof cur[p] !== "object") cur[p] = {};
    cur = cur[p];
  }
  cur[parts[parts.length - 1]] = value;
}

function bindFields(root, data) {
  root.querySelectorAll("[data-path]").forEach((el) => {
    const apply = () => {
      const path = el.getAttribute("data-path");
      let val;
      if (el.type === "checkbox") val = el.checked;
      else val = el.value;
      // arrays of strings from newline textareas with data-array
      if (el.dataset.array === "true") {
        val = el.value.split("\n").map((s) => s.trim()).filter(Boolean);
      }
      setByPath(data, path, val);
      setDirty(true);
    };
    el.addEventListener("input", apply);
    el.addEventListener("change", apply);
  });
}

function renderNav() {
  const nav = $("#nav");
  nav.innerHTML = Object.entries(state.collections)
    .map(([key, label]) => `<button type="button" data-col="${key}">${label}</button>`)
    .join("");
  nav.querySelectorAll("button").forEach((btn) => {
    btn.onclick = () => loadCollection(btn.dataset.col);
  });
}

async function loadCollection(key) {
  if (state.dirty && !confirm("Discard unsaved changes?")) return;
  try {
    const r = await fetch(`${API}?action=get&collection=${encodeURIComponent(key)}`, {
      credentials: "include",
    }).then((x) => x.json());
    if (!r.ok) return toast(r.error || "Failed to load", "err");
    state.current = key;
    state.data = r.data;
    setDirty(false);
    $("#panel-title").textContent = state.collections[key] || key;
    $("#panel-sub").textContent = `Editing /content/${key}.json — save to update the live website.`;
    $("#nav").querySelectorAll("button").forEach((b) =>
      b.classList.toggle("active", b.dataset.col === key),
    );
    renderEditor();
  } catch (e) {
    toast(e.message || "Failed to load", "err");
  }
}

function renderEditor() {
  const wrap = $("#editor-wrap");
  const key = state.current;
  const data = state.data;
  if (!key || !data) {
    wrap.innerHTML = `<p class="empty">Select a collection from the left.</p>`;
    return;
  }

  if (key === "home") wrap.innerHTML = renderHome(data);
  else if (key === "menu") wrap.innerHTML = renderMenu(data);
  else if (key === "company") wrap.innerHTML = renderCompany(data);
  else if (key === "services") wrap.innerHTML = renderServices(data);
  else if (key === "packages") wrap.innerHTML = renderPackages(data);
  else if (key === "portfolio") wrap.innerHTML = renderPortfolio(data);
  else if (key === "content") wrap.innerHTML = renderContent(data);
  else if (key === "extras") wrap.innerHTML = renderExtras(data);
  else if (key === "settings") wrap.innerHTML = renderSettings(data);
  else wrap.innerHTML = `<div class="card"><p>Unknown collection.</p></div>`;

  bindFields(wrap, data);

  wrap.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => handleAction(btn.dataset.action, btn));
  });

  const search = wrap.querySelector("#service-search");
  if (search) {
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      wrap.querySelectorAll(".item-card[data-search]").forEach((card) => {
        const hay = card.getAttribute("data-search") || "";
        card.hidden = q !== "" && !hay.includes(q);
      });
    });
  }
}

function renderHome(d) {
  const hero = d.hero || {};
  const seo = d.seo || {};
  const brands = d.brands || {};
  const services = d.services || {};
  const portfolio = d.portfolio || {};
  const packages = d.packages || {};
  const whyChoose = d.whyChoose || {};
  const process = d.process || {};
  const testimonials = d.testimonials || {};
  const faqs = d.faqs || {};
  const blogs = d.blogs || {};
  const cta = d.ctaBanner || {};
  return `
  <div class="card">
    <h3>SEO (homepage)</h3>
    <div class="grid-2">
      ${field("Page title", "seo.title", seo.title)}
      ${field("Meta description", "seo.description", seo.description, "textarea")}
    </div>
  </div>
  <div class="card">
    <h3>Hero section</h3>
    <div class="grid-2">
      ${field("Brand name", "hero.brand", hero.brand)}
      ${field("Eyebrow / label", "hero.eyebrow", hero.eyebrow)}
      ${field("Headline", "hero.headline", hero.headline, "textarea")}
      ${field("Supporting text", "hero.description", hero.description, "textarea")}
      ${field("Primary button label", "hero.primaryCtaLabel", hero.primaryCtaLabel)}
      ${field("Primary button path", "hero.primaryCtaPath", hero.primaryCtaPath)}
      ${field("Secondary button label", "hero.secondaryCtaLabel", hero.secondaryCtaLabel)}
      ${field("Secondary button path", "hero.secondaryCtaPath", hero.secondaryCtaPath)}
      ${field("Hero image URL", "hero.image", hero.image)}
      ${field("Hero image alt text", "hero.imageAlt", hero.imageAlt, "textarea")}
    </div>
    ${hero.image ? `<p style="margin-top:1rem"><img class="preview" style="max-width:280px;border-radius:8px" src="${escapeAttr(hero.image)}" alt="" /></p>` : ""}
  </div>
  <div class="card">
    <h3>Brands strip</h3>
    ${field("Label", "brands.label", brands.label)}
    <p class="hint" style="margin-top:.75rem;color:#888;font-size:.85rem">Brand names themselves are edited under <strong>Company &amp; Contact</strong>.</p>
  </div>
  <div class="card">
    <h3>Services section</h3>
    <div class="grid-2">
      ${field("Eyebrow", "services.eyebrow", services.eyebrow)}
      ${field("Title", "services.title", services.title)}
      ${field("Supporting text", "services.text", services.text, "textarea")}
      ${field("CTA label", "services.ctaLabel", services.ctaLabel)}
      ${field("CTA path", "services.ctaPath", services.ctaPath)}
    </div>
    <p class="hint" style="margin-top:.75rem;color:#888;font-size:.85rem">Which services appear on the homepage is set under <strong>Services</strong> → featured slugs.</p>
  </div>
  <div class="card">
    <h3>Portfolio section</h3>
    <div class="grid-2">
      ${field("Eyebrow", "portfolio.eyebrow", portfolio.eyebrow)}
      ${field("Title", "portfolio.title", portfolio.title)}
      ${field("Supporting text", "portfolio.text", portfolio.text, "textarea")}
      ${field("CTA label", "portfolio.ctaLabel", portfolio.ctaLabel)}
      ${field("CTA path", "portfolio.ctaPath", portfolio.ctaPath)}
    </div>
  </div>
  <div class="card">
    <h3>Packages section</h3>
    <div class="grid-2">
      ${field("Eyebrow", "packages.eyebrow", packages.eyebrow)}
      ${field("Title", "packages.title", packages.title)}
      ${field("Supporting text", "packages.text", packages.text, "textarea")}
      ${field("Featured badge text", "packages.featuredBadge", packages.featuredBadge)}
      ${field("Primary CTA label", "packages.ctaLabel", packages.ctaLabel)}
      ${field("Primary CTA path", "packages.ctaPath", packages.ctaPath)}
      ${field("Secondary CTA label", "packages.secondaryCtaLabel", packages.secondaryCtaLabel)}
      ${field("Secondary CTA path", "packages.secondaryCtaPath", packages.secondaryCtaPath)}
    </div>
  </div>
  <div class="card">
    <h3>Why choose us</h3>
    <div class="grid-2">
      ${field("Eyebrow", "whyChoose.eyebrow", whyChoose.eyebrow)}
      ${field("Title", "whyChoose.title", whyChoose.title)}
      ${field("Supporting text", "whyChoose.text", whyChoose.text, "textarea")}
    </div>
    <p class="hint" style="margin-top:.75rem;color:#888;font-size:.85rem">Card items are edited under <strong>FAQs, Blog, Team, Industries</strong>.</p>
  </div>
  <div class="card">
    <h3>Process section</h3>
    <div class="grid-2">
      ${field("Eyebrow", "process.eyebrow", process.eyebrow)}
      ${field("Title", "process.title", process.title)}
      ${field("Supporting text", "process.text", process.text, "textarea")}
    </div>
  </div>
  <div class="card">
    <h3>Testimonials section</h3>
    <div class="grid-2">
      ${field("Eyebrow", "testimonials.eyebrow", testimonials.eyebrow)}
      ${field("Title", "testimonials.title", testimonials.title)}
      ${field("Supporting text", "testimonials.text", testimonials.text, "textarea")}
    </div>
  </div>
  <div class="card">
    <h3>FAQs section</h3>
    <div class="grid-2">
      ${field("Eyebrow", "faqs.eyebrow", faqs.eyebrow)}
      ${field("Title", "faqs.title", faqs.title)}
      ${field("Supporting text", "faqs.text", faqs.text, "textarea")}
      ${field("CTA label", "faqs.ctaLabel", faqs.ctaLabel)}
      ${field("CTA path", "faqs.ctaPath", faqs.ctaPath)}
    </div>
  </div>
  <div class="card">
    <h3>Blog section</h3>
    <div class="grid-2">
      ${field("Eyebrow", "blogs.eyebrow", blogs.eyebrow)}
      ${field("Title", "blogs.title", blogs.title)}
      ${field("Supporting text", "blogs.text", blogs.text, "textarea")}
      ${field("CTA label", "blogs.ctaLabel", blogs.ctaLabel)}
      ${field("CTA path", "blogs.ctaPath", blogs.ctaPath)}
    </div>
  </div>
  <div class="card">
    <h3>Bottom CTA banner</h3>
    <div class="grid-2">
      ${field("Eyebrow", "ctaBanner.eyebrow", cta.eyebrow)}
      ${field("Title", "ctaBanner.title", cta.title)}
      ${field("Supporting text", "ctaBanner.text", cta.text, "textarea")}
      ${field("Button label", "ctaBanner.primaryLabel", cta.primaryLabel)}
      ${field("Button path", "ctaBanner.primaryPath", cta.primaryPath)}
    </div>
  </div>`;
}

function renderMenu(d) {
  const items = d.items || [];
  const services = d.servicesMega || {};
  const packages = d.packagesMega || {};
  const explore = d.exploreMega || {};
  const discover = explore.discoverLinks || [];
  const mobile = d.mobileLinks || [];
  const cta = d.cta || {};

  return `
  <div class="card">
    <h3>Header & mega menu</h3>
    <div class="help-banner">
      Edit top navigation labels, mega-menu copy, service categories, Explore links and the Book Now button.
      Service / package / city lists still come from those collections — this controls labels, order and which mega panels open.
    </div>
  </div>

  <div class="card">
    <div class="card-head">
      <h3>Desktop nav items (${items.length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="add-menu-item">Add nav item</button>
    </div>
    <p class="help-banner" style="margin-top:0">Type <code>link</code> needs a path. Type <code>mega</code> needs mega = services, packages or explore.</p>
    ${items.map((item, i) => `
      <details class="item-card" ${i < 3 ? "open" : ""}>
        <summary>
          <span>
            <span class="pill">${escapeHtml(item.type || "link")}</span>
            ${escapeHtml(item.label || item.id || "Item")}
          </span>
          <button type="button" class="btn btn-danger btn-sm" data-action="del-menu-item" data-index="${i}">Delete</button>
        </summary>
        <div class="grid-2" style="margin-top:1rem">
          ${field("ID (unique)", `items.${i}.id`, item.id)}
          ${field("Label", `items.${i}.label`, item.label)}
          ${field("Type (link or mega)", `items.${i}.type`, item.type || "link")}
          ${field("Path (for link)", `items.${i}.path`, item.path || "")}
          ${field("Mega key (services / packages / explore)", `items.${i}.mega`, item.mega || "")}
        </div>
      </details>
    `).join("")}
  </div>

  <div class="card">
    <h3>Header CTA button</h3>
    <div class="grid-2">
      ${field("Button label", "cta.label", cta.label)}
      ${field("Button path", "cta.path", cta.path)}
    </div>
  </div>

  <div class="card">
    <h3>Services mega menu</h3>
    <div class="grid-2">
      ${field("Eyebrow", "servicesMega.eyebrow", services.eyebrow)}
      ${field("Title", "servicesMega.title", services.title)}
      ${field("View all label", "servicesMega.viewAllLabel", services.viewAllLabel)}
      ${field("View all path", "servicesMega.viewAllPath", services.viewAllPath)}
      ${field("Links per category", "servicesMega.linksPerCategory", services.linksPerCategory ?? 5, "number")}
      ${field("Popular section label", "servicesMega.popularLabel", services.popularLabel)}
      ${field("Popular count", "servicesMega.popularCount", services.popularCount ?? 6, "number")}
    </div>
    <div class="field full">
      <label>Category columns (one per line — must match service categories)</label>
      <textarea data-path="servicesMega.categories" data-array="true">${escapeHtml((services.categories || []).join("\n"))}</textarea>
    </div>
    <div class="field full">
      <label>Popular service slugs (one per line — leave blank to use Services → homepage featured slugs)</label>
      <textarea data-path="servicesMega.popularSlugs" data-array="true">${escapeHtml((services.popularSlugs || []).join("\n"))}</textarea>
    </div>
  </div>

  <div class="card">
    <h3>Packages mega menu</h3>
    <div class="grid-2">
      ${field("All packages eyebrow", "packagesMega.allEyebrow", packages.allEyebrow)}
      ${field("All packages label", "packagesMega.allLabel", packages.allLabel)}
      ${field("All packages text", "packagesMega.allText", packages.allText, "textarea")}
      ${field("All packages path", "packagesMega.allPath", packages.allPath)}
      ${field("Package card eyebrow", "packagesMega.itemEyebrow", packages.itemEyebrow)}
      ${field("Pricing eyebrow", "packagesMega.pricingEyebrow", packages.pricingEyebrow)}
      ${field("Pricing label", "packagesMega.pricingLabel", packages.pricingLabel)}
      ${field("Pricing text", "packagesMega.pricingText", packages.pricingText, "textarea")}
      ${field("Pricing path", "packagesMega.pricingPath", packages.pricingPath)}
      <div class="field">
        <label for="packages_showPricing">Show pricing card</label>
        <input type="checkbox" data-path="packagesMega.showPricing" id="packages_showPricing" ${packages.showPricing !== false ? "checked" : ""} />
      </div>
    </div>
  </div>

  <div class="card">
    <h3>Explore mega menu</h3>
    <div class="grid-2">
      ${field("Discover title", "exploreMega.discoverTitle", explore.discoverTitle)}
      ${field("Cities title", "exploreMega.citiesTitle", explore.citiesTitle)}
      ${field("Cities count", "exploreMega.citiesCount", explore.citiesCount ?? 8, "number")}
      ${field("CTA eyebrow", "exploreMega.ctaEyebrow", explore.ctaEyebrow)}
      ${field("CTA title", "exploreMega.ctaTitle", explore.ctaTitle)}
      ${field("CTA text", "exploreMega.ctaText", explore.ctaText, "textarea")}
      ${field("Primary button label", "exploreMega.ctaPrimaryLabel", explore.ctaPrimaryLabel)}
      ${field("Primary button path", "exploreMega.ctaPrimaryPath", explore.ctaPrimaryPath)}
      ${field("Secondary button label", "exploreMega.ctaSecondaryLabel", explore.ctaSecondaryLabel)}
      <div class="field">
        <label for="explore_showWhatsApp">Show WhatsApp button</label>
        <input type="checkbox" data-path="exploreMega.showWhatsApp" id="explore_showWhatsApp" ${explore.showWhatsApp !== false ? "checked" : ""} />
      </div>
    </div>
    <div class="card-head" style="margin-top:1rem">
      <h3 style="font-size:1rem;margin:0">Discover links (${discover.length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="add-discover-link">Add link</button>
    </div>
    ${discover.map((link, i) => `
      <div class="grid-2 item-card" style="padding:1rem;margin-top:.65rem">
        ${field("Label", `exploreMega.discoverLinks.${i}.label`, link.label)}
        ${field("Path", `exploreMega.discoverLinks.${i}.path`, link.path)}
        <div class="field full">
          <button type="button" class="btn btn-danger btn-sm" data-action="del-discover-link" data-index="${i}">Delete link</button>
        </div>
      </div>
    `).join("")}
  </div>

  <div class="card">
    <div class="card-head">
      <h3>Mobile drawer links (${mobile.length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="add-mobile-link">Add mobile link</button>
    </div>
    ${mobile.map((link, i) => `
      <div class="grid-2 item-card" style="padding:1rem;margin-top:.65rem">
        ${field("Label", `mobileLinks.${i}.label`, link.label)}
        ${field("Path", `mobileLinks.${i}.path`, link.path)}
        <div class="field full">
          <button type="button" class="btn btn-danger btn-sm" data-action="del-mobile-link" data-index="${i}">Delete</button>
        </div>
      </div>
    `).join("")}
  </div>`;
}

function renderCompany(d) {
  return `
  <div class="card">
    <h3>Company details</h3>
    <div class="grid-2">
      ${field("Company name", "name", d.name)}
      ${field("Tagline", "tagline", d.tagline)}
      ${field("Website", "website", d.website)}
      ${field("Phone", "phone", d.phone)}
      ${field("Phone link (tel:)", "phoneHref", d.phoneHref)}
      ${field("WhatsApp number", "whatsapp", d.whatsapp)}
      ${field("WhatsApp link", "whatsappHref", d.whatsappHref)}
      ${field("Email", "email", d.email)}
      ${field("Email link", "emailHref", d.emailHref)}
      ${field("Coverage", "coverage", d.coverage)}
      ${field("Primary focus city", "primaryFocus", d.primaryFocus)}
    </div>
  </div>
  <div class="card">
    <h3>Address</h3>
    <div class="field full">
      <label>Address lines (one per line)</label>
      <textarea data-path="address.lines" data-array="true">${escapeHtml((d.address?.lines || []).join("\n"))}</textarea>
    </div>
    ${field("Google Maps embed URL", "address.mapEmbed", d.address?.mapEmbed || "", "textarea")}
  </div>
  <div class="card">
    <h3>Trust badges & brand logos</h3>
    <div class="field full">
      <label>Trust badges (one per line)</label>
      <textarea data-path="trustBadges" data-array="true">${escapeHtml((d.trustBadges || []).join("\n"))}</textarea>
    </div>
    <div class="field full">
      <label>Brand logos / names (one per line)</label>
      <textarea data-path="brandLogos" data-array="true">${escapeHtml((d.brandLogos || []).join("\n"))}</textarea>
    </div>
    <div class="field full">
      <label>Social profile URLs (one per line — Instagram, YouTube, LinkedIn)</label>
      <textarea data-path="socials" data-array="true">${escapeHtml((d.socials || []).join("\n"))}</textarea>
    </div>
  </div>`;
}

function renderServices(d) {
  const services = d.services || [];
  const home = (d.homeServices || []).join("\n");
  return `
  <div class="card">
    <div class="card-head">
      <h3>Services (${services.length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="add-service">Add service</button>
    </div>
    <div class="help-banner">
      Tip: paste a YouTube link on any service to show a video section on its page. Each service also has its own reviews list (editable below) shown on that service page. Use search to jump quickly.
    </div>
    <div class="field full">
      <label>Search services</label>
      <input type="search" id="service-search" placeholder="Search by title, slug or category…" autocomplete="off" />
    </div>
    <div class="field full">
      <label>Homepage featured service slugs (one per line)</label>
      <textarea data-path="homeServices" data-array="true">${escapeHtml(home)}</textarea>
    </div>
  </div>
  ${services.map((s, i) => `
    <details class="item-card" data-search="${escapeAttr(`${s.title || ""} ${s.slug || ""} ${s.category || ""}`.toLowerCase())}" ${i < 2 ? "open" : ""}>
      <summary>
        <span>
          <span class="pill">${escapeHtml(s.category || "Service")}</span>
          ${escapeHtml(s.title || s.slug || "Service")}
          <small style="color:#888;font-weight:400">/${escapeHtml(s.slug || "")}</small>
        </span>
        <span style="display:flex;gap:.5rem;align-items:center">
          ${s.image ? `<img class="preview" src="${escapeAttr(s.image)}" alt="" />` : ""}
          <button type="button" class="btn btn-danger btn-sm" data-action="del-service" data-index="${i}">Delete</button>
        </span>
      </summary>
      <div class="grid-2" style="margin-top:1rem">
        ${field("Slug", `services.${i}.slug`, s.slug)}
        ${field("Title", `services.${i}.title`, s.title)}
        ${field("Category", `services.${i}.category`, s.category)}
        ${field("Short description", `services.${i}.short`, s.short)}
        ${field("Full description", `services.${i}.description`, s.description, "textarea")}
        ${field("Image URL", `services.${i}.image`, s.image)}
        ${field("YouTube video URL (optional)", `services.${i}.youtubeUrl`, s.youtubeUrl || "")}
        ${field("Starting price", `services.${i}.priceFrom`, s.priceFrom || "")}
        ${field("Price note", `services.${i}.priceNote`, s.priceNote || "")}
        <div class="field full">
          <label>Benefits (one per line)</label>
          <textarea data-path="services.${i}.benefits" data-array="true">${escapeHtml((s.benefits || []).join("\n"))}</textarea>
        </div>
        <div class="field full">
          <label>Deliverables (one per line)</label>
          <textarea data-path="services.${i}.deliverables" data-array="true">${escapeHtml((s.deliverables || []).join("\n"))}</textarea>
        </div>
        <div class="field full">
          <label>Equipment (one per line)</label>
          <textarea data-path="services.${i}.equipment" data-array="true">${escapeHtml((s.equipment || []).join("\n"))}</textarea>
        </div>
        <div class="field full">
          <label>Related service slugs (one per line)</label>
          <textarea data-path="services.${i}.related" data-array="true">${escapeHtml((s.related || []).join("\n"))}</textarea>
        </div>
        <div class="field full" style="margin-top:1rem">
          <div class="card-head">
            <h3 style="font-size:1rem;margin:0">Service reviews (${(s.reviews || []).length})</h3>
            <button type="button" class="btn btn-gold btn-sm" data-action="add-service-review" data-index="${i}">Add review</button>
          </div>
          <p class="help-banner" style="margin:.65rem 0 0">These appear only on this service page. Edit name, role, quote, rating (1–5) and photo URL.</p>
          ${(s.reviews || []).map((r, ri) => `
            <details class="item-card" style="margin-top:.65rem" ${ri < 2 ? "open" : ""}>
              <summary>
                <span>${escapeHtml(r.name || "Review")} <small style="color:#888;font-weight:400">${escapeHtml(r.role || "")}</small></span>
                <button type="button" class="btn btn-danger btn-sm" data-action="del-service-review" data-index="${i}" data-review-index="${ri}">Delete</button>
              </summary>
              <div class="grid-2" style="margin-top:1rem">
                ${field("Name", `services.${i}.reviews.${ri}.name`, r.name)}
                ${field("Role / city", `services.${i}.reviews.${ri}.role`, r.role)}
                ${field("Rating (1-5)", `services.${i}.reviews.${ri}.rating`, r.rating ?? 5, "number")}
                ${field("Photo URL", `services.${i}.reviews.${ri}.image`, r.image || "")}
                ${field("Quote", `services.${i}.reviews.${ri}.quote`, r.quote, "textarea")}
              </div>
            </details>
          `).join("")}
        </div>
        <div class="field full" style="margin-top:1.25rem">
          <div class="card-head">
            <h3 style="font-size:1rem;margin:0">Tips &amp; facts (${(s.tips || []).length})</h3>
            <button type="button" class="btn btn-gold btn-sm" data-action="add-service-tip" data-index="${i}">Add tip</button>
          </div>
          <p class="help-banner" style="margin:.65rem 0 0">Interesting facts and tips shown on this service page. Add, edit or remove anytime.</p>
          ${(s.tips || []).map((t, ti) => `
            <details class="item-card" style="margin-top:.65rem" ${ti < 3 ? "open" : ""}>
              <summary>
                <span>${escapeHtml(t.title || "Tip")}</span>
                <button type="button" class="btn btn-danger btn-sm" data-action="del-service-tip" data-index="${i}" data-tip-index="${ti}">Delete</button>
              </summary>
              <div class="grid-2" style="margin-top:1rem">
                ${field("Title", `services.${i}.tips.${ti}.title`, t.title)}
                ${field("Tip / fact text", `services.${i}.tips.${ti}.text`, t.text, "textarea")}
              </div>
            </details>
          `).join("")}
        </div>
      </div>
    </details>
  `).join("")}`;
}

function renderPackages(d) {
  const groups = d.packageGroups || [];
  return `
  <div class="card">
    <div class="card-head">
      <h3>Package groups (${groups.length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="add-package-group">Add group</button>
    </div>
  </div>
  ${groups.map((g, gi) => `
    <div class="card">
      <div class="card-head">
        <h3>${escapeHtml(g.title || "Package group")}</h3>
        <button type="button" class="btn btn-danger btn-sm" data-action="del-package-group" data-index="${gi}">Delete group</button>
      </div>
      <div class="grid-2">
        ${field("Slug", `packageGroups.${gi}.slug`, g.slug)}
        ${field("Title", `packageGroups.${gi}.title`, g.title)}
        ${field("Subtitle", `packageGroups.${gi}.subtitle`, g.subtitle, "textarea")}
      </div>
      ${(g.tiers || []).map((t, ti) => `
        <details class="item-card" open>
          <summary><span>${escapeHtml(t.name)} — ${escapeHtml(t.priceLabel || "")}</span></summary>
          <div class="grid-2" style="margin-top:1rem">
            ${field("ID", `packageGroups.${gi}.tiers.${ti}.id`, t.id)}
            ${field("Name", `packageGroups.${gi}.tiers.${ti}.name`, t.name)}
            ${field("Price label", `packageGroups.${gi}.tiers.${ti}.priceLabel`, t.priceLabel)}
            ${field("Price note", `packageGroups.${gi}.tiers.${ti}.priceNote`, t.priceNote)}
            ${field("Description", `packageGroups.${gi}.tiers.${ti}.description`, t.description, "textarea")}
            <div class="field">
              <label>Highlighted</label>
              <input type="checkbox" data-path="packageGroups.${gi}.tiers.${ti}.highlighted" ${t.highlighted ? "checked" : ""} />
            </div>
            <div class="field full">
              <label>Features (one per line)</label>
              <textarea data-path="packageGroups.${gi}.tiers.${ti}.features" data-array="true">${escapeHtml((t.features || []).join("\n"))}</textarea>
            </div>
          </div>
        </details>
      `).join("")}
    </div>
  `).join("")}`;
}

function renderPortfolio(d) {
  const items = d.portfolio || [];
  return `
  <div class="card">
    <div class="card-head">
      <h3>Portfolio projects (${items.length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="add-portfolio">Add project</button>
    </div>
    <div class="field full">
      <label>Categories (one per line, include All)</label>
      <textarea data-path="portfolioCategories" data-array="true">${escapeHtml((d.portfolioCategories || []).join("\n"))}</textarea>
    </div>
  </div>
  ${items.map((p, i) => `
    <details class="item-card">
      <summary>
        <span>${escapeHtml(p.title)} · ${escapeHtml(p.location || "")}</span>
        <span style="display:flex;gap:.5rem;align-items:center">
          ${p.image ? `<img class="preview" src="${escapeAttr(p.image)}" alt="" />` : ""}
          <button type="button" class="btn btn-danger btn-sm" data-action="del-portfolio" data-index="${i}">Delete</button>
        </span>
      </summary>
      <div class="grid-2" style="margin-top:1rem">
        ${field("Slug", `portfolio.${i}.slug`, p.slug)}
        ${field("Title", `portfolio.${i}.title`, p.title)}
        ${field("Category", `portfolio.${i}.category`, p.category)}
        ${field("Location", `portfolio.${i}.location`, p.location)}
        ${field("Description", `portfolio.${i}.description`, p.description, "textarea")}
        ${field("Cover image URL", `portfolio.${i}.image`, p.image)}
        <div class="field full">
          <label>Gallery image URLs (one per line)</label>
          <textarea data-path="portfolio.${i}.gallery" data-array="true">${escapeHtml((p.gallery || []).join("\n"))}</textarea>
        </div>
      </div>
    </details>
  `).join("")}`;
}

function renderListSection(title, path, items, fields, addAction, delAction) {
  return `
  <div class="card">
    <div class="card-head">
      <h3>${title} (${items.length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="${addAction}">Add</button>
    </div>
    ${items.map((item, i) => `
      <details class="item-card">
        <summary>
          <span>${escapeHtml(item.title || item.name || item.question || item.city || `#${i + 1}`)}</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="${delAction}" data-index="${i}">Delete</button>
        </summary>
        <div class="grid-2" style="margin-top:1rem">
          ${fields.map((f) => {
            if (f.array) {
              return `<div class="field full"><label>${f.label}</label><textarea data-path="${path}.${i}.${f.key}" data-array="true">${escapeHtml((item[f.key] || []).join("\n"))}</textarea></div>`;
            }
            return field(f.label, `${path}.${i}.${f.key}`, item[f.key], f.type || "text");
          }).join("")}
        </div>
      </details>
    `).join("")}
  </div>`;
}

function renderContent(d) {
  return [
    renderListSection("FAQs", "faqs", d.faqs || [], [
      { label: "Category", key: "category" },
      { label: "Question", key: "question" },
      { label: "Answer", key: "answer", type: "textarea" },
    ], "add-faq", "del-faq"),
    renderListSection("Blog posts", "blogs", d.blogs || [], [
      { label: "Slug", key: "slug" },
      { label: "Title", key: "title" },
      { label: "Category", key: "category" },
      { label: "Date", key: "date" },
      { label: "Read time", key: "readTime" },
      { label: "Excerpt", key: "excerpt", type: "textarea" },
      { label: "Image URL", key: "image" },
    ], "add-blog", "del-blog"),
    renderListSection("Testimonials", "testimonials", d.testimonials || [], [
      { label: "Name", key: "name" },
      { label: "Role", key: "role" },
      { label: "Quote", key: "quote", type: "textarea" },
      { label: "Photo URL", key: "image" },
    ], "add-testimonial", "del-testimonial"),
    renderListSection("Team", "team", d.team || [], [
      { label: "Name", key: "name" },
      { label: "Role", key: "role" },
      { label: "Photo URL", key: "image" },
    ], "add-team", "del-team"),
    renderListSection("Industries", "industries", d.industries || [], [
      { label: "Slug", key: "slug" },
      { label: "Title", key: "title" },
      { label: "Text", key: "text", type: "textarea" },
      { label: "Image URL", key: "image" },
    ], "add-industry", "del-industry"),
    renderListSection("Locations", "locations", d.locations || [], [
      { label: "Slug", key: "slug" },
      { label: "Title", key: "title" },
      { label: "City", key: "city" },
      { label: "Service", key: "service" },
      { label: "Intro", key: "intro", type: "textarea" },
    ], "add-location", "del-location"),
    renderListSection("Why choose us", "whyChoose", d.whyChoose || [], [
      { label: "Title", key: "title" },
      { label: "Text", key: "text", type: "textarea" },
    ], "add-why", "del-why"),
    renderListSection("Process steps", "processSteps", d.processSteps || [], [
      { label: "Step", key: "step" },
      { label: "Title", key: "title" },
      { label: "Text", key: "text", type: "textarea" },
    ], "add-process", "del-process"),
  ].join("");
}


function renderExtras(d) {
  const g = d.googleReviews || {};
  const ig = d.instagram || {};
  const awards = d.awards || [];
  const showreel = d.showreel || {};
  const cases = d.caseStudies || [];
  const careers = d.careers || {};
  const roles = careers.roles || [];
  const galleries = d.clientGalleries || [];
  const avail = d.availability || {};
  return `
  <div class="card">
    <h3>Google reviews strip</h3>
    <div class="grid-2">
      ${field("Label", "googleReviews.label", g.label)}
      ${field("Average rating", "googleReviews.rating", g.rating ?? 4.9, "number")}
      ${field("Review count", "googleReviews.count", g.count ?? 0, "number")}
      ${field("Google profile URL", "googleReviews.profileUrl", g.profileUrl)}
    </div>
    <div class="card-head" style="margin-top:1rem">
      <h3 style="font-size:1rem;margin:0">Featured reviews (${(g.reviews || []).length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="add-google-review">Add review</button>
    </div>
    ${(g.reviews || []).map((r, i) => `
      <details class="item-card" style="margin-top:.65rem" ${i < 2 ? "open" : ""}>
        <summary>
          <span>${escapeHtml(r.name || "Review")}</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="del-google-review" data-index="${i}">Delete</button>
        </summary>
        <div class="grid-2" style="margin-top:1rem">
          ${field("Name", `googleReviews.reviews.${i}.name`, r.name)}
          ${field("Initials", `googleReviews.reviews.${i}.initials`, r.initials)}
          ${field("Rating (1-5)", `googleReviews.reviews.${i}.rating`, r.rating ?? 5, "number")}
          ${field("Time label", `googleReviews.reviews.${i}.time`, r.time)}
          ${field("Review text", `googleReviews.reviews.${i}.text`, r.text, "textarea")}
        </div>
      </details>
    `).join("")}
  </div>
  <div class="card">
    <h3>Instagram grid</h3>
    <div class="grid-2">
      ${field("Handle", "instagram.handle", ig.handle)}
      ${field("Profile URL", "instagram.url", ig.url)}
    </div>
    <div class="card-head" style="margin-top:1rem">
      <h3 style="font-size:1rem;margin:0">Posts (${(ig.posts || []).length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="add-ig-post">Add post</button>
    </div>
    ${(ig.posts || []).map((p, i) => `
      <details class="item-card" style="margin-top:.65rem" ${i < 2 ? "open" : ""}>
        <summary>
          <span>${escapeHtml(p.caption || p.id || "Post")}</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="del-ig-post" data-index="${i}">Delete</button>
        </summary>
        <div class="grid-2" style="margin-top:1rem">
          ${field("ID", `instagram.posts.${i}.id`, p.id)}
          ${field("Image URL", `instagram.posts.${i}.image`, p.image)}
          ${field("Likes label", `instagram.posts.${i}.likes`, p.likes)}
          ${field("Caption", `instagram.posts.${i}.caption`, p.caption)}
        </div>
      </details>
    `).join("")}
  </div>
  <div class="card">
    <div class="card-head">
      <h3>Awards (${awards.length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="add-award">Add award</button>
    </div>
    ${awards.map((a, i) => `
      <details class="item-card" style="margin-top:.65rem" ${i < 3 ? "open" : ""}>
        <summary>
          <span>${escapeHtml(a.title || "Award")}</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="del-award" data-index="${i}">Delete</button>
        </summary>
        <div class="grid-2" style="margin-top:1rem">
          ${field("Title", `awards.${i}.title`, a.title)}
          ${field("Organisation", `awards.${i}.org`, a.org)}
          ${field("Year", `awards.${i}.year`, a.year)}
        </div>
      </details>
    `).join("")}
  </div>
  <div class="card">
    <h3>Showreel</h3>
    <div class="grid-2">
      ${field("Eyebrow", "showreel.eyebrow", showreel.eyebrow)}
      ${field("Title", "showreel.title", showreel.title)}
      ${field("Text", "showreel.text", showreel.text, "textarea")}
      ${field("YouTube URL", "showreel.youtubeUrl", showreel.youtubeUrl)}
      ${field("Poster image", "showreel.poster", showreel.poster)}
    </div>
  </div>
  <div class="card">
    <div class="card-head">
      <h3>Case studies (${cases.length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="add-case-study">Add case study</button>
    </div>
    ${cases.map((c, i) => `
      <details class="item-card" style="margin-top:.65rem" ${i < 1 ? "open" : ""}>
        <summary>
          <span>${escapeHtml(c.title || c.slug || "Case study")}</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="del-case-study" data-index="${i}">Delete</button>
        </summary>
        <div class="grid-2" style="margin-top:1rem">
          ${field("Slug", `caseStudies.${i}.slug`, c.slug)}
          ${field("Title", `caseStudies.${i}.title`, c.title)}
          ${field("Client", `caseStudies.${i}.client`, c.client)}
          ${field("Category", `caseStudies.${i}.category`, c.category)}
          ${field("City", `caseStudies.${i}.city`, c.city)}
          ${field("Year", `caseStudies.${i}.year`, c.year)}
          ${field("Result highlight", `caseStudies.${i}.result`, c.result)}
          ${field("Cover image", `caseStudies.${i}.image`, c.image)}
          ${field("Summary", `caseStudies.${i}.summary`, c.summary, "textarea")}
          ${field("Challenge", `caseStudies.${i}.challenge`, c.challenge, "textarea")}
          ${field("Approach", `caseStudies.${i}.approach`, c.approach, "textarea")}
          ${field("Outcome", `caseStudies.${i}.outcome`, c.outcome, "textarea")}
          <div class="field full">
            <label>Gallery image URLs (one per line)</label>
            <textarea data-path="caseStudies.${i}.gallery" data-array="true">${escapeHtml((c.gallery || []).join("\n"))}</textarea>
          </div>
        </div>
      </details>
    `).join("")}
  </div>
  <div class="card">
    <h3>Careers page</h3>
    <div class="grid-2">
      ${field("Eyebrow", "careers.eyebrow", careers.eyebrow)}
      ${field("Title", "careers.title", careers.title)}
      ${field("Intro text", "careers.text", careers.text, "textarea")}
      <div class="field full">
        <label>Perks (one per line)</label>
        <textarea data-path="careers.perks" data-array="true">${escapeHtml((careers.perks || []).join("\n"))}</textarea>
      </div>
    </div>
    <div class="card-head" style="margin-top:1rem">
      <h3 style="font-size:1rem;margin:0">Open roles (${roles.length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="add-career-role">Add role</button>
    </div>
    ${roles.map((r, i) => `
      <details class="item-card" style="margin-top:.65rem" ${i < 2 ? "open" : ""}>
        <summary>
          <span>${escapeHtml(r.title || "Role")}</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="del-career-role" data-index="${i}">Delete</button>
        </summary>
        <div class="grid-2" style="margin-top:1rem">
          ${field("ID", `careers.roles.${i}.id`, r.id)}
          ${field("Title", `careers.roles.${i}.title`, r.title)}
          ${field("Type", `careers.roles.${i}.type`, r.type)}
          ${field("Location", `careers.roles.${i}.location`, r.location)}
          ${field("Summary", `careers.roles.${i}.summary`, r.summary, "textarea")}
          <div class="field full">
            <label>Requirements (one per line)</label>
            <textarea data-path="careers.roles.${i}.requirements" data-array="true">${escapeHtml((r.requirements || []).join("\n"))}</textarea>
          </div>
        </div>
      </details>
    `).join("")}
  </div>
  <div class="card">
    <div class="card-head">
      <h3>Client galleries (${galleries.length})</h3>
      <button type="button" class="btn btn-gold btn-sm" data-action="add-client-gallery">Add gallery</button>
    </div>
    <p class="help-banner">Clients unlock a private gallery with a code (e.g. AANYA2025).</p>
    ${galleries.map((g, i) => `
      <details class="item-card" style="margin-top:.65rem" ${i < 1 ? "open" : ""}>
        <summary>
          <span>${escapeHtml(g.code || g.title || "Gallery")}</span>
          <button type="button" class="btn btn-danger btn-sm" data-action="del-client-gallery" data-index="${i}">Delete</button>
        </summary>
        <div class="grid-2" style="margin-top:1rem">
          ${field("Access code", `clientGalleries.${i}.code`, g.code)}
          ${field("Title", `clientGalleries.${i}.title`, g.title)}
          ${field("Type", `clientGalleries.${i}.type`, g.type)}
          ${field("Cover image", `clientGalleries.${i}.cover`, g.cover)}
          <div class="field full">
            <label>Image URLs (one per line)</label>
            <textarea data-path="clientGalleries.${i}.images" data-array="true">${escapeHtml((g.images || []).join("\n"))}</textarea>
          </div>
        </div>
      </details>
    `).join("")}
  </div>
  <div class="card">
    <h3>Availability calendar</h3>
    <p class="help-banner">Edit month labels and day statuses in JSON carefully, or update the headline copy here. Day grid is stored under availability.months.</p>
    <div class="grid-2">
      ${field("Eyebrow", "availability.eyebrow", avail.eyebrow)}
      ${field("Title", "availability.title", avail.title)}
      ${field("Intro text", "availability.text", avail.text, "textarea")}
      ${field("Note under calendar", "availability.note", avail.note, "textarea")}
    </div>
  </div>`;
}

function renderSettings(d) {

  return `
  <div class="card">
    <h3>Settings</h3>
    ${field("Site name", "siteName", d.siteName)}
    ${field("Admin note", "adminNote", d.adminNote, "textarea")}
    ${field("Last updated", "updatedAt", d.updatedAt)}
    <p style="color:var(--muted);font-size:.9rem;margin-top:1rem">
      Change the CMS login password in <code>/admin/config.php</code> on the server.<br/>
      Make sure the <code>/content</code> folder is writable (chmod 755/775).
    </p>
  </div>
  <div class="card">
    <h3>Automatic SEO sync</h3>
    <p style="color:var(--muted);font-size:.92rem;line-height:1.55;margin:0 0 1rem">
      Every time you click <strong>Save changes</strong> in any section, the CMS automatically rebuilds
      <code>sitemap.xml</code> and <code>llms.txt</code> from your latest content (services, packages,
      portfolio, locations, industries, blogs). The live website also reads content JSON on each visit,
      so titles, schema and copy stay in sync without a rebuild.
    </p>
    <p style="font-size:.9rem;margin:0 0 1rem">
      Last SEO sync: <strong>${escapeHtml(d.seoSyncedAt || d.updatedAt || "—")}</strong><br/>
      Sitemap URLs: <strong>${escapeHtml(String(d.sitemapUrlCount ?? "—"))}</strong>
    </p>
    <button type="button" class="btn btn-gold btn-sm" data-action="sync-seo">Rebuild SEO now</button>
  </div>`;
}

function handleAction(action, btn) {
  const i = Number(btn.dataset.index);
  const d = state.data;
  const add = (key, item) => { d[key] = d[key] || []; d[key].unshift(item); setDirty(true); renderEditor(); };
  const del = (key) => { if (!confirm("Delete this item?")) return; d[key].splice(i, 1); setDirty(true); renderEditor(); };

  switch (action) {
    case "add-service":
      add("services", { slug: "new-service", title: "New Service", short: "", description: "", benefits: [], image: "", youtubeUrl: "", category: "Wedding", related: [], reviews: [], tips: [] });
      break;
    case "del-service": del("services"); break;
    case "add-service-review": {
      const si = Number(btn.dataset.index);
      d.services = d.services || [];
      d.services[si].reviews = d.services[si].reviews || [];
      d.services[si].reviews.unshift({
        name: "New Client",
        role: "Client · Mumbai",
        quote: "Share what they loved about this service.",
        rating: 5,
        image: "",
      });
      setDirty(true);
      renderEditor();
      break;
    }
    case "del-service-review": {
      const si = Number(btn.dataset.index);
      const ri = Number(btn.dataset.reviewIndex);
      if (!confirm("Delete this review?")) return;
      d.services[si].reviews.splice(ri, 1);
      setDirty(true);
      renderEditor();
      break;
    }
    case "add-service-tip": {
      const si = Number(btn.dataset.index);
      d.services = d.services || [];
      d.services[si].tips = d.services[si].tips || [];
      d.services[si].tips.unshift({
        title: "New tip",
        text: "Write an interesting fact or practical tip for this service.",
      });
      setDirty(true);
      renderEditor();
      break;
    }
    case "del-service-tip": {
      const si = Number(btn.dataset.index);
      const ti = Number(btn.dataset.tipIndex);
      if (!confirm("Delete this tip?")) return;
      d.services[si].tips.splice(ti, 1);
      setDirty(true);
      renderEditor();
      break;
    }
    case "add-portfolio":
      add("portfolio", { slug: "new-project", title: "New Project", category: "Wedding", location: "Mumbai", description: "", image: "", gallery: [] });
      break;
    case "del-portfolio": del("portfolio"); break;
    case "add-package-group":
      d.packageGroups = d.packageGroups || [];
      d.packageGroups.push({ slug: "new-group", title: "New Packages", subtitle: "", tiers: [
        { id: "new-essential", name: "Essential", priceLabel: "₹0", priceNote: "", description: "", features: [] },
        { id: "new-signature", name: "Signature", priceLabel: "₹0", priceNote: "", description: "", features: [], highlighted: true },
        { id: "new-luxury", name: "Luxury", priceLabel: "₹0", priceNote: "", description: "", features: [] },
      ]});
      setDirty(true); renderEditor(); break;
    case "del-package-group":
      if (!confirm("Delete this package group?")) return;
      d.packageGroups.splice(i, 1); setDirty(true); renderEditor(); break;
    case "add-faq": add("faqs", { category: "General", question: "New question?", answer: "" }); break;
    case "del-faq": del("faqs"); break;
    case "add-blog": add("blogs", { slug: "new-post", title: "New blog post", excerpt: "", category: "General", date: "", image: "", readTime: "5 min read" }); break;
    case "del-blog": del("blogs"); break;
    case "add-testimonial": add("testimonials", { name: "Client Name", role: "Role", quote: "", image: "" }); break;
    case "del-testimonial": del("testimonials"); break;
    case "add-team": add("team", { name: "Team Member", role: "Role", image: "" }); break;
    case "del-team": del("team"); break;
    case "add-industry": add("industries", { slug: "new-industry", title: "Industry", text: "", image: "" }); break;
    case "del-industry": del("industries"); break;
    case "add-location": add("locations", { slug: "new-location", title: "Location page title", city: "", service: "", intro: "" }); break;
    case "del-location": del("locations"); break;
    case "add-why": add("whyChoose", { title: "New reason", text: "" }); break;
    case "del-why": del("whyChoose"); break;
    case "add-process": add("processSteps", { step: "0", title: "Step", text: "" }); break;
    case "del-process": del("processSteps"); break;
    case "add-menu-item":
      d.items = d.items || [];
      d.items.push({ id: `item-${Date.now()}`, label: "New link", type: "link", path: "/" });
      setDirty(true); renderEditor(); break;
    case "del-menu-item":
      if (!confirm("Delete this nav item?")) return;
      d.items.splice(i, 1); setDirty(true); renderEditor(); break;
    case "add-discover-link":
      d.exploreMega = d.exploreMega || {};
      d.exploreMega.discoverLinks = d.exploreMega.discoverLinks || [];
      d.exploreMega.discoverLinks.push({ label: "New page", path: "/" });
      setDirty(true); renderEditor(); break;
    case "del-discover-link":
      if (!confirm("Delete this Discover link?")) return;
      d.exploreMega.discoverLinks.splice(i, 1); setDirty(true); renderEditor(); break;
    case "add-mobile-link":
      d.mobileLinks = d.mobileLinks || [];
      d.mobileLinks.push({ label: "New link", path: "/" });
      setDirty(true); renderEditor(); break;
    case "del-mobile-link":
      if (!confirm("Delete this mobile link?")) return;
      d.mobileLinks.splice(i, 1); setDirty(true); renderEditor(); break;
    case "add-google-review":
      d.googleReviews = d.googleReviews || { reviews: [] };
      d.googleReviews.reviews = d.googleReviews.reviews || [];
      d.googleReviews.reviews.unshift({
        name: "New Client",
        initials: "NC",
        rating: 5,
        time: "just now",
        text: "Write the review…",
      });
      setDirty(true); renderEditor(); break;
    case "del-google-review":
      if (!confirm("Delete this Google review?")) return;
      d.googleReviews.reviews.splice(i, 1); setDirty(true); renderEditor(); break;
    case "add-ig-post":
      d.instagram = d.instagram || { posts: [] };
      d.instagram.posts = d.instagram.posts || [];
      d.instagram.posts.unshift({
        id: String(Date.now()),
        image: "",
        likes: "0",
        caption: "New post",
      });
      setDirty(true); renderEditor(); break;
    case "del-ig-post":
      if (!confirm("Delete this Instagram post?")) return;
      d.instagram.posts.splice(i, 1); setDirty(true); renderEditor(); break;
    case "add-award":
      add("awards", { title: "New award", org: "Organisation", year: "2026" });
      break;
    case "del-award":
      del("awards");
      break;
    case "add-case-study":
      add("caseStudies", {
        slug: "new-case-study",
        title: "New case study",
        client: "Client",
        category: "Wedding",
        city: "Mumbai",
        year: "2026",
        result: "",
        summary: "",
        challenge: "",
        approach: "",
        outcome: "",
        image: "",
        gallery: [],
      });
      break;
    case "del-case-study":
      del("caseStudies");
      break;
    case "add-career-role":
      d.careers = d.careers || { roles: [] };
      d.careers.roles = d.careers.roles || [];
      d.careers.roles.unshift({
        id: `role-${Date.now()}`,
        title: "New role",
        type: "Full-time",
        location: "Mumbai",
        summary: "",
        requirements: [],
      });
      setDirty(true); renderEditor(); break;
    case "del-career-role":
      if (!confirm("Delete this role?")) return;
      d.careers.roles.splice(i, 1); setDirty(true); renderEditor(); break;
    case "add-client-gallery":
      add("clientGalleries", {
        code: "CODE2026",
        title: "New gallery",
        type: "Wedding",
        cover: "",
        images: [],
      });
      break;
    case "del-client-gallery":
      del("clientGalleries");
      break;
    case "sync-seo":
      (async () => {
        try {
          const res = await api("sync-seo", {});
          toast(`SEO rebuilt — ${res?.seo?.urls ?? "?"} URLs in sitemap`);
          if (state.current === "settings") loadCollection("settings");
        } catch (e) {
          toast(e.message || "SEO sync failed", "err");
        }
      })();
      break;
  }
}

async function save() {
  if (!state.current || !state.data) return;
  try {
    const res = await api("save", { collection: state.current, data: state.data });
    setDirty(false);
    const urls = res?.seo?.urls;
    toast(
      urls
        ? `Saved — SEO sitemap updated (${urls} URLs). Refresh the website to see changes.`
        : "Saved — website + SEO artifacts updated. Refresh the website to see changes.",
    );
  } catch (e) {
    toast(e.message || "Save failed", "err");
  }
}

async function boot() {
  try {
    const status = await fetch(`${API}?action=status`, { credentials: "include" }).then((r) => r.json());
    state.collections = status.collections || {};
    state.authed = !!status.authenticated;
    showLogin(!state.authed);
    if (state.authed) {
      renderNav();
      const first = Object.keys(state.collections)[0];
      if (first) loadCollection(first);
    }
  } catch (e) {
    $("#login-error").hidden = false;
    $("#login-error").textContent = "Cannot reach CMS API. Is PHP enabled on Hostinger?";
  }
}

$("#login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = $("#password").value;
  const err = $("#login-error");
  const btn = e.target.querySelector('button[type="submit"]');
  err.hidden = true;
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Signing in…";
  }
  try {
    const loginRes = await api("login", { password });
    if (!loginRes || loginRes.ok === false) {
      throw new Error(loginRes?.error || "Login failed");
    }
    state.authed = true;
    showLogin(false);
    try {
      const status = await fetch(`${API}?action=status`, { credentials: "include" }).then((r) => r.json());
      state.collections = status.collections || state.collections || {};
    } catch (_) {
      /* keep collections from prior status if cookie race */
    }
    if (!Object.keys(state.collections || {}).length) {
      const status = await fetch(`${API}?action=status`, { credentials: "include" }).then((r) => r.json());
      state.collections = status.collections || {};
    }
    renderNav();
    const first = Object.keys(state.collections)[0];
    if (first) await loadCollection(first);
  } catch (ex) {
    state.authed = false;
    showLogin(true);
    err.hidden = false;
    err.textContent = ex.message || "Login failed";
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Sign in";
    }
  }
});

$("#logout-btn").onclick = async () => {
  await api("logout", {});
  state.authed = false;
  state.current = null;
  state.data = null;
  setDirty(false);
  showLogin(true);
};

$("#save-btn").onclick = save;
$("#reload-btn").onclick = () => state.current && loadCollection(state.current);

window.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
    e.preventDefault();
    if (state.dirty && state.authed) save();
  }
});

window.addEventListener("beforeunload", (e) => {
  if (state.dirty) { e.preventDefault(); e.returnValue = ""; }
});

boot();

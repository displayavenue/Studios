const API = "./api.php";
const TOKEN_KEY = "da_agency_admin_token";

const state = {
  authed: false,
  token: localStorage.getItem(TOKEN_KEY) || "",
  collections: {},
  current: null,
  data: null,
  dirty: false,
};

const $ = (sel) => document.querySelector(sel);

function previewRouteFor(collection) {
  const map = {
    home: "/",
    company: "/",
    "google-reviews": "/",
    awards: "/awards",
    certifications: "/certifications",
    contact: "/contact",
    content: "/",
    services: "/services",
    industries: "/industries",
    packages: "/packages",
    solutions: "/solutions",
    ai: "/ai-platform",
    tools: "/free-tools",
    cases: "/case-studies",
    projects: "/portfolio",
    resources: "/resources",
    combos: "/industries",
    tracking: "/",
    settings: "/",
  };
  return map[collection] || "/";
}

function setPreview(path) {
  const frame = $("#preview-frame");
  const label = $("#preview-path");
  const open = $("#preview-open");
  if (!frame) return;
  const clean = path || "/";
  const url = `..${clean === "/" ? "/" : clean}?cms_preview=${Date.now()}`;
  frame.src = url;
  if (label) label.textContent = clean;
  if (open) open.href = `..${clean === "/" ? "/" : clean}`;
}

function refreshPreview() {
  setPreview(previewRouteFor(state.current || "home"));
}

async function api(action, payload = null) {
  const headers = {};
  if (payload) headers["Content-Type"] = "application/json";
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
    headers["X-DA-Admin-Token"] = state.token;
  }
  const opts = {
    method: payload ? "POST" : "GET",
    credentials: "include",
    headers,
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
  if (res.status === 401 || json.code === "auth") {
    state.authed = false;
    state.token = "";
    localStorage.removeItem(TOKEN_KEY);
    showLogin(true);
    const err = new Error(json.error || "Please log in again");
    err.status = 401;
    throw err;
  }
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
  btn.textContent = v ? "Update & preview *" : "Update & preview";
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
  if (state.dirty) {
    const leave = confirm("You have unpublished edits. Leave without Update?");
    if (!leave) return;
  }
  try {
    const headers = {};
    if (state.token) {
      headers.Authorization = `Bearer ${state.token}`;
      headers["X-DA-Admin-Token"] = state.token;
    }
    const url = `${API}?action=get&collection=${encodeURIComponent(key)}`;
    const r = await fetch(url, { credentials: "include", headers });
    const json = await r.json().catch(() => ({ ok: false, error: "Load failed" }));
    if (r.status === 401 || json.code === "auth") {
      state.authed = false;
      state.token = "";
      localStorage.removeItem(TOKEN_KEY);
      showLogin(true);
      toast("Session expired - log in once to continue", "err");
      return;
    }
    if (!r.ok || json.ok === false) throw new Error(json.error || "Load failed");
    state.current = key;
    state.data = json.data;
    setDirty(false);
    $("#panel-title").textContent = state.collections[key] || key;
    $("#panel-sub").textContent = `Editing ${key}.json - Update publishes live. Preview refreshes automatically.`;
    renderNav();
    renderEditor();
    setPreview(previewRouteFor(key));
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.querySelector(".main")?.scrollTo?.({ top: 0, behavior: "auto" });
    if (key === "contact") loadContactLeads();
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
    combos: () => renderCatalog(d, "Industry × Service page"),
    content: renderContent,
    "google-reviews": renderGoogleReviews,
    awards: renderAwards,
    certifications: renderCertifications,
    contact: renderContactForm,
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
      "Socials",
      `
      ${field("Facebook", "socials.facebook", d.socials?.facebook)}
      ${field("Instagram", "socials.instagram", d.socials?.instagram)}
      ${field("LinkedIn", "socials.linkedin", d.socials?.linkedin)}
      ${field("YouTube", "socials.youtube", d.socials?.youtube)}
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
      ${field("Place ID (from Sync)", "googleMaps.placeId", d.googleMaps?.placeId || "")}
      ${field("Place search query", "googleMaps.placeQuery", d.googleMaps?.placeQuery || "")}
      <p class="hint">Use Google Reviews (GMB) in the sidebar to sync live reviews onto the homepage.</p>
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
  return card(
    "Hero",
    `
    ${field("Brand / eyebrow", "hero.eyebrow", d.hero?.eyebrow)}
    ${field("Title (before accent)", "hero.titleBefore", d.hero?.titleBefore)}
    ${field("Title accent", "hero.titleAccent", d.hero?.titleAccent)}
    ${field("Lead", "hero.lead", d.hero?.lead, "textarea")}
    ${field("Primary CTA", "hero.primaryCta", d.hero?.primaryCta)}
    ${field("Secondary CTA", "hero.secondaryCta", d.hero?.secondaryCta)}
    ${field("Hero image URL", "hero.image", d.hero?.image)}
    ${field("Hero image alt", "hero.imageAlt", d.hero?.imageAlt)}
    ${field("Trust label", "trustLabel", d.trustLabel)}
    ${field("Services title", "servicesTitle", d.servicesTitle)}
    ${field("Services subtitle", "servicesSub", d.servicesSub)}
  `,
  );
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
          ${field("CTA label", `items.${i}.ctaLabel`, item.ctaLabel)}
          <div class="field full"><label>Deliverables (one per line)</label>
            <textarea data-path="items.${i}.deliverables" data-array="true">${escapeHtml((item.deliverables || []).join("\n"))}</textarea>
          </div>
        </div>
        <h4 style="margin:1rem 0 .5rem">Benefits</h4>
        ${benefits || "<p class='empty'>No benefits</p>"}
        <button type="button" class="btn btn-ghost" data-action="add-benefit" data-index="${i}">+ Benefit</button>
        <h4 style="margin:1rem 0 .5rem">FAQs</h4>
        ${faqs || "<p class='empty'>No FAQs</p>"}
        <button type="button" class="btn btn-ghost" data-action="add-faq" data-index="${i}">+ FAQ</button>
        <div class="field full" style="margin-top:1rem"><label>Related links JSON</label>
          <textarea data-path="items.${i}.related" data-json="true">${escapeHtml(JSON.stringify(item.related || [], null, 2))}</textarea>
        </div>
        <div class="field full"><label>Process JSON</label>
          <textarea data-path="items.${i}.process" data-json="true">${escapeHtml(JSON.stringify(item.process || [], null, 2))}</textarea>
        </div>
        <div class="field full"><label>Metrics JSON</label>
          <textarea data-path="items.${i}.metrics" data-json="true">${escapeHtml(JSON.stringify(item.metrics || [], null, 2))}</textarea>
        </div>
      </details>`;
    })
    .join("");

  return `
    <section class="card">
      <div class="list-item-head">
        <div>
          <h3>${escapeHtml(kindLabel)} pages (${d.items.length})</h3>
          <p class="hint">Each item is a full website page. Slug becomes the URL.</p>
        </div>
        <button type="button" class="btn btn-gold" data-action="add-item" data-index="${escapeAttr(kindLabel)}">Add ${escapeHtml(kindLabel)}</button>
      </div>
      ${items || "<p class='empty'>No items yet</p>"}
    </section>
  `;
}

function renderGoogleReviews(d) {
  const reviews = (d.reviews || [])
    .map(
      (r, i) => `
      <div class="list-item">
        <div class="list-item-head">
          <strong>Review ${i + 1}</strong>
          <button type="button" class="btn btn-ghost" data-action="del-google-review" data-index="${i}">Delete</button>
        </div>
        <div class="grid">
          ${field("Author", `reviews.${i}.author`, r.author)}
          ${field("Rating", `reviews.${i}.rating`, r.rating, "number")}
          ${field("When", `reviews.${i}.relativeTime`, r.relativeTime)}
          ${field("Photo URL", `reviews.${i}.profilePhotoUrl`, r.profilePhotoUrl || "")}
          ${field("Author URL", `reviews.${i}.authorUrl`, r.authorUrl || "")}
          ${field("Review text", `reviews.${i}.text`, r.text, "textarea")}
        </div>
      </div>`,
    )
    .join("");

  return `
    ${card(
      "Google Business Profile sync",
      `
      <p class="hint" style="grid-column:1/-1">
        Homepage shows these reviews <strong>above the explore directory</strong>.
        Click <strong>Sync from Google</strong> to pull live rating + reviews via Places API
        (needs <code>places_api_key</code> in <code>admin/config.php</code>).
      </p>
      ${field("Enabled (show on homepage)", "enabled", d.enabled !== false, "checkbox")}
      ${field("Section title", "title", d.title)}
      ${field("Section subtitle", "sub", d.sub, "textarea")}
      ${field("Business name", "businessName", d.businessName)}
      ${field("Place ID", "placeId", d.placeId || "")}
      ${field("Place search query", "placeQuery", d.placeQuery || "")}
      ${field("Rating", "rating", d.rating, "number")}
      ${field("Review count", "reviewCount", d.reviewCount, "number")}
      ${field("Profile URL", "profileUrl", d.profileUrl || "")}
      ${field("Write review URL", "writeReviewUrl", d.writeReviewUrl || "")}
      ${field("Maps URL", "mapsUrl", d.mapsUrl || "")}
      ${field("Last synced", "lastSyncedAt", d.lastSyncedAt || "")}
      ${field("Sync source", "syncSource", d.syncSource || "")}
      <div class="field full" style="display:flex;gap:.65rem;flex-wrap:wrap;align-items:center">
        <button type="button" class="btn btn-gold" data-action="sync-google-reviews">Sync from Google</button>
        <button type="button" class="btn btn-ghost" data-action="add-google-review">Add review manually</button>
        <span class="hint" style="margin:0">Save after sync if you edit fields by hand.</span>
      </div>
    `,
    )}
    <section class="card">
      <div class="list-item-head">
        <h3>Reviews on homepage</h3>
      </div>
      ${reviews || "<p class='empty'>No reviews yet - sync from Google or add manually.</p>"}
    </section>
  `;
}

function renderAwards(d) {
  const items = (d.items || [])
    .map(
      (item, i) => `
      <div class="list-item">
        <div class="list-item-head">
          <strong>${escapeHtml(item.title || `Award ${i + 1}`)}</strong>
          <button type="button" class="btn btn-ghost" data-action="del-award" data-index="${i}">Delete</button>
        </div>
        <div class="grid">
          ${field("ID", `items.${i}.id`, item.id || "")}
          ${field("Title", `items.${i}.title`, item.title || "")}
          ${field("Issuer", `items.${i}.issuer`, item.issuer || "")}
          ${field("Year", `items.${i}.year`, item.year || "")}
          ${field("Category", `items.${i}.category`, item.category || "")}
          ${field("Image URL", `items.${i}.image`, item.image || "")}
          ${field("Featured on homepage", `items.${i}.featured`, item.featured !== false, "checkbox")}
          ${field("Summary", `items.${i}.summary`, item.summary || "", "textarea")}
        </div>
      </div>`,
    )
    .join("");

  return `
    ${card(
      "Awards page & homepage section",
      `
      <p class="hint" style="grid-column:1/-1">
        Homepage shows featured awards <strong>before the explore directory</strong>.
        Upload images to <code>/images/awards/</code> or paste any image URL.
      </p>
      ${field("Enabled", "enabled", d.enabled !== false, "checkbox")}
      ${field("Page title", "title", d.title || "")}
      ${field("Page subtitle", "sub", d.sub || "", "textarea")}
      ${field("SEO title", "seo.title", d.seo?.title || "")}
      ${field("SEO description", "seo.description", d.seo?.description || "", "textarea")}
      ${field("Homepage section title", "homeTitle", d.homeTitle || "")}
      ${field("Homepage section subtitle", "homeSub", d.homeSub || "", "textarea")}
      ${field("Homepage awards limit", "homeAwardsLimit", d.homeAwardsLimit ?? 6, "number")}
      ${field("Homepage certs limit", "homeCertsLimit", d.homeCertsLimit ?? 8, "number")}
    `,
    )}
    <section class="card">
      <div class="list-item-head">
        <h3>Awards (${(d.items || []).length})</h3>
        <button type="button" class="btn btn-gold" data-action="add-award">Add award</button>
      </div>
      ${items || "<p class='empty'>No awards yet</p>"}
    </section>
  `;
}

function renderCertifications(d) {
  const items = (d.items || [])
    .map(
      (item, i) => `
      <div class="list-item">
        <div class="list-item-head">
          <strong>${escapeHtml(item.title || `Certificate ${i + 1}`)}</strong>
          <button type="button" class="btn btn-ghost" data-action="del-cert" data-index="${i}">Delete</button>
        </div>
        <div class="grid">
          ${field("ID", `items.${i}.id`, item.id || "")}
          ${field("Title", `items.${i}.title`, item.title || "")}
          ${field("Issuer", `items.${i}.issuer`, item.issuer || "")}
          ${field("Brand (Google, Meta…)", `items.${i}.brand`, item.brand || "")}
          ${field("Category", `items.${i}.category`, item.category || "")}
          ${field("Year", `items.${i}.year`, item.year || "")}
          ${field("Image URL", `items.${i}.image`, item.image || "")}
          ${field("Featured on homepage", `items.${i}.featured`, item.featured !== false, "checkbox")}
          ${field("Credential / summary", `items.${i}.credential`, item.credential || "", "textarea")}
        </div>
      </div>`,
    )
    .join("");

  return `
    ${card(
      "Certifications page",
      `
      <p class="hint" style="grid-column:1/-1">
        Edit certificates here. Images live in <code>/images/certs/</code> (or any URL).
        Featured items appear on the homepage awards &amp; certifications section.
      </p>
      ${field("Enabled", "enabled", d.enabled !== false, "checkbox")}
      ${field("Page title", "title", d.title || "")}
      ${field("Page subtitle", "sub", d.sub || "", "textarea")}
      ${field("SEO title", "seo.title", d.seo?.title || "")}
      ${field("SEO description", "seo.description", d.seo?.description || "", "textarea")}
    `,
    )}
    <section class="card">
      <div class="list-item-head">
        <h3>Certificates (${(d.items || []).length})</h3>
        <button type="button" class="btn btn-gold" data-action="add-cert">Add certificate</button>
      </div>
      ${items || "<p class='empty'>No certificates yet</p>"}
    </section>
  `;
}

function renderContactForm(d) {
  const f = d.fields || {};
  return `
    ${card(
      "Contact page & form",
      `
      <p class="hint" style="grid-column:1/-1">
        Form submissions are saved under <code>admin/.leads/</code> and emailed to the notify address when the server mailer works.
        Edit copy, labels, and notification email here.
      </p>
      ${field("Enabled", "enabled", d.enabled !== false, "checkbox")}
      ${field("Badge / title", "title", d.title || "")}
      ${field("Headline", "headline", d.headline || "")}
      ${field("Lead paragraph", "lead", d.lead || "", "textarea")}
      ${field("Notify email (inbox for leads)", "notifyEmail", d.notifyEmail || "")}
      ${field("Submit button label", "submitLabel", d.submitLabel || "")}
      ${field("WhatsApp fallback if send fails", "whatsappFallback", d.whatsappFallback !== false, "checkbox")}
      ${field("Success title", "successTitle", d.successTitle || "")}
      ${field("Success message", "successMessage", d.successMessage || "", "textarea")}
      ${field("SEO title", "seo.title", d.seo?.title || "")}
      ${field("SEO description", "seo.description", d.seo?.description || "", "textarea")}
    `,
    )}
    ${card(
      "Form field labels",
      `
      ${field("Name label", "fields.nameLabel", f.nameLabel || "")}
      ${field("Name placeholder", "fields.namePlaceholder", f.namePlaceholder || "")}
      ${field("Phone label", "fields.phoneLabel", f.phoneLabel || "")}
      ${field("Phone placeholder", "fields.phonePlaceholder", f.phonePlaceholder || "")}
      ${field("Email label", "fields.emailLabel", f.emailLabel || "")}
      ${field("Email placeholder", "fields.emailPlaceholder", f.emailPlaceholder || "")}
      ${field("Business label", "fields.businessLabel", f.businessLabel || "")}
      ${field("Business placeholder", "fields.businessPlaceholder", f.businessPlaceholder || "")}
      ${field("Message label", "fields.messageLabel", f.messageLabel || "")}
      ${field("Message placeholder", "fields.messagePlaceholder", f.messagePlaceholder || "", "textarea")}
    `,
    )}
    <section class="card">
      <div class="list-item-head">
        <h3>Recent leads</h3>
        <button type="button" class="btn btn-ghost" data-action="refresh-leads">Refresh leads</button>
      </div>
      <div id="contact-leads-panel"><p class="hint">Click Refresh leads to load submissions.</p></div>
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
  } else if (action === "add-google-review") {
    d.reviews = d.reviews || [];
    d.reviews.unshift({
      author: "",
      rating: 5,
      relativeTime: "Recently",
      text: "",
      profilePhotoUrl: "",
      authorUrl: "",
    });
  } else if (action === "del-google-review") {
    d.reviews.splice(Number(index), 1);
  } else if (action === "add-award") {
    d.items = d.items || [];
    const n = d.items.length + 1;
    d.items.unshift({
      id: `award-${String(n).padStart(2, "0")}`,
      title: "New award",
      issuer: "",
      year: String(new Date().getFullYear()),
      summary: "",
      category: "",
      image: "/images/awards/award-01.jpg",
      featured: true,
    });
  } else if (action === "del-award") {
    if (!confirm("Delete this award?")) return;
    d.items.splice(Number(index), 1);
  } else if (action === "add-cert") {
    d.items = d.items || [];
    const n = d.items.length + 1;
    d.items.unshift({
      id: `cert-${String(n).padStart(2, "0")}`,
      title: "New certificate",
      issuer: "",
      credential: "",
      year: String(new Date().getFullYear()),
      brand: "Google",
      category: "",
      image: "/images/certs/cert-01.jpg",
      featured: true,
    });
  } else if (action === "del-cert") {
    if (!confirm("Delete this certificate?")) return;
    d.items.splice(Number(index), 1);
  } else if (action === "refresh-leads") {
    loadContactLeads();
    return;
  } else if (action === "sync-google-reviews") {
    syncGoogleReviews();
    return;
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

async function syncGoogleReviews() {
  try {
    toast("Syncing Google reviews…");
    const res = await api("sync-google-reviews", {
      placeId: state.data?.placeId || "",
      placeQuery: state.data?.placeQuery || "",
    });
    if (res.data) {
      state.data = res.data;
      setDirty(false);
      renderEditor();
    }
    toast(res.message || "Google reviews synced");
  } catch (e) {
    toast(e.message, "err");
    // If sync wrote placeId but no reviews, reload collection
    if (state.current === "google-reviews") {
      try {
        await openCollection("google-reviews");
      } catch (_) {}
    }
  }
}

async function loadContactLeads() {
  const panel = document.getElementById("contact-leads-panel");
  if (!panel) return;
  panel.innerHTML = `<p class="hint">Loading leads…</p>`;
  try {
    const res = await api("list-leads");
    const leads = res.leads || [];
    if (!leads.length) {
      panel.innerHTML = `<p class="empty">No leads yet. Submit the contact form on the website to test.</p>`;
      return;
    }
    panel.innerHTML = leads
      .slice(0, 40)
      .map(
        (l) => `
      <div class="list-item">
        <div class="list-item-head">
          <strong>${escapeHtml(l.name || "Lead")}</strong>
          <span class="hint" style="margin:0">${escapeHtml(l.createdAt || "")}</span>
        </div>
        <p style="margin:.35rem 0;font-size:.9rem">
          ${escapeHtml(l.phone || "")}${l.email ? " · " + escapeHtml(l.email) : ""}${l.business ? " · " + escapeHtml(l.business) : ""}
        </p>
        ${l.message ? `<p style="margin:0;color:var(--muted);font-size:.88rem">${escapeHtml(l.message)}</p>` : ""}
      </div>`,
      )
      .join("");
  } catch (e) {
    panel.innerHTML = `<p class="empty">${escapeHtml(e.message || "Could not load leads")}</p>`;
  }
}

async function save() {
  if (!state.current || !state.data) return;
  if (state.data.navItems) {
    state.data.navItems.forEach((n) => {
      if (n.mega === "false" || n.mega === "") n.mega = false;
    });
  }
  try {
    await api("save", { collection: state.current, data: state.data });
    setDirty(false);
    refreshPreview();
    toast("Live on the website - preview refreshed");
  } catch (e) {
    toast(e.message, "err");
  }
}

async function enterApp(collections) {
  state.authed = true;
  state.collections = collections || {};
  showLogin(false);
  renderNav();
  const first = state.current || Object.keys(state.collections)[0];
  if (first) await openCollection(first);
  else setPreview("/");
}

async function init() {
  $("#login-form").onsubmit = async (e) => {
    e.preventDefault();
    $("#login-error").hidden = true;
    try {
      const res = await api("login", { password: $("#password").value });
      if (res.token) {
        state.token = res.token;
        localStorage.setItem(TOKEN_KEY, res.token);
      }
      const status = await api("status");
      await enterApp(status.collections || {});
    } catch (err) {
      $("#login-error").hidden = false;
      $("#login-error").textContent = err.message;
    }
  };

  $("#logout-btn").onclick = async () => {
    try {
      await api("logout", {});
    } catch (_) {}
    state.authed = false;
    state.token = "";
    localStorage.removeItem(TOKEN_KEY);
    state.current = null;
    state.data = null;
    setDirty(false);
    showLogin(true);
  };

  $("#save-btn").onclick = save;
  $("#reload-btn").onclick = () => state.current && openCollection(state.current);
  const previewBtn = $("#preview-btn");
  if (previewBtn) previewBtn.onclick = refreshPreview;

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      if (state.dirty) save();
    }
  });

  try {
    const status = await api("status");
    if (status.authenticated) {
      await enterApp(status.collections || {});
    } else if (state.token) {
      // Token may still be valid even if cookie session is cold
      try {
        const again = await api("status");
        if (again.authenticated) await enterApp(again.collections || {});
        else showLogin(true);
      } catch {
        showLogin(true);
      }
    } else showLogin(true);
  } catch {
    showLogin(true);
  }
}

init();

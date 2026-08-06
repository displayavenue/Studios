const API = "./api.php";

const state = {
  authed: false,
  collections: {},
  current: null,
  data: null,
  dirty: false,
  newLeads: 0,
  notifyEmail: "info@displayavenue.com",
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
    ? `${API}?action=${encodeURIComponent(action)}`
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
  const badge =
    state.newLeads > 0
      ? ` <span class="nav-badge">${state.newLeads > 99 ? "99+" : state.newLeads}</span>`
      : "";
  const leadBtn = `<button type="button" data-key="leads" class="${
    state.current === "leads" ? "active" : ""
  }">Form Leads (Inbox)${badge}</button>`;
  nav.innerHTML =
    leadBtn +
    Object.entries(state.collections)
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
  if (key === "leads") {
    return openLeads();
  }
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
    $("#save-btn").hidden = false;
    renderNav();
    renderEditor();
  } catch (e) {
    toast(e.message, "err");
  }
}

async function openLeads() {
  try {
    const json = await api("leads");
    state.current = "leads";
    state.data = json.data || { items: [] };
    state.newLeads = (state.data.items || []).filter((i) => (i.status || "new") === "new").length;
    setDirty(false);
    $("#panel-title").textContent = "Form Leads (Inbox)";
    $("#panel-sub").textContent = `Submissions from the website. New leads are also emailed to ${state.notifyEmail}.`;
    $("#save-btn").hidden = true;
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
  if (key === "leads") {
    wrap.innerHTML = renderLeads(d);
    wrap.querySelectorAll("[data-action]").forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLeadAction(btn.dataset.action, btn.dataset.id);
      };
    });
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
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleAction(btn.dataset.action, btn.dataset.index);
    };
  });
}

function renderLeads(d) {
  const items = d.items || [];
  const newCount = items.filter((i) => (i.status || "new") === "new").length;
  if (!items.length) {
    return `
      <section class="card">
        <h3>No leads yet</h3>
        <p class="muted">When someone fills the contact or newsletter form on the website, it will appear here and also email <strong>${escapeHtml(state.notifyEmail)}</strong>.</p>
      </section>`;
  }
  const rows = items
    .map((item) => {
      const status = item.status || "new";
      const when = item.createdAt ? new Date(item.createdAt).toLocaleString() : "—";
      return `
      <article class="lead-card ${status === "new" ? "is-new" : ""}">
        <div class="lead-card-head">
          <div>
            <strong>${escapeHtml(item.name || "—")}</strong>
            <span class="lead-meta">${escapeHtml(item.source || "contact")} · ${escapeHtml(when)}</span>
          </div>
          <span class="lead-status status-${escapeHtml(status)}">${escapeHtml(status)}</span>
        </div>
        <div class="lead-body">
          <p><a href="mailto:${escapeHtml(item.email || "")}">${escapeHtml(item.email || "—")}</a>
            ${item.phone ? ` · <a href="tel:${escapeHtml(item.phone)}">${escapeHtml(item.phone)}</a>` : ""}</p>
          <p class="lead-message">${escapeHtml(item.message || "—")}</p>
          ${item.page ? `<p class="lead-meta">From: ${escapeHtml(item.page)}</p>` : ""}
        </div>
        <div class="lead-actions">
          ${status === "new" ? `<button type="button" class="btn btn-ghost btn-sm" data-action="lead-read" data-id="${escapeHtml(item.id)}">Mark read</button>` : ""}
          ${status !== "replied" ? `<button type="button" class="btn btn-ghost btn-sm" data-action="lead-replied" data-id="${escapeHtml(item.id)}">Mark replied</button>` : ""}
          ${status !== "archived" ? `<button type="button" class="btn btn-ghost btn-sm" data-action="lead-archive" data-id="${escapeHtml(item.id)}">Archive</button>` : ""}
          <a class="btn btn-ghost btn-sm" href="mailto:${escapeHtml(item.email || "")}?subject=${encodeURIComponent("Re: DisplayAvenue enquiry")}">Email reply</a>
          <button type="button" class="btn btn-danger btn-sm" data-action="lead-delete" data-id="${escapeHtml(item.id)}">Delete</button>
        </div>
      </article>`;
    })
    .join("");

  return `
    <section class="card">
      <h3>Inbox · ${items.length} total${newCount ? ` · ${newCount} new` : ""}</h3>
      <p class="muted">Notifications go to <strong>${escapeHtml(state.notifyEmail)}</strong>. Lead data is private (not on the public website).</p>
    </section>
    <div class="leads-list">${rows}</div>`;
}

async function handleLeadAction(action, id) {
  try {
    if (action === "lead-delete") {
      if (!confirm("Delete this lead permanently?")) return;
      const json = await api("lead-delete", { id });
      state.data = json.data;
    } else {
      const statusMap = {
        "lead-read": "read",
        "lead-replied": "replied",
        "lead-archive": "archived",
      };
      const status = statusMap[action];
      if (!status) return;
      const json = await api("lead-update", { id, status });
      state.data = json.data;
    }
    state.newLeads = (state.data.items || []).filter((i) => (i.status || "new") === "new").length;
    renderNav();
    renderEditor();
    toast("Lead updated");
  } catch (e) {
    toast(e.message, "err");
  }
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

function homeSection(id, title, enabled, body) {
  const on = enabled !== false;
  return `
    <section class="card home-section-card" id="home-sec-${id}">
      <div class="home-section-head">
        <h3>${title}</h3>
        <label class="toggle-inline">
          <input type="checkbox" data-path="sections.${id}" ${on ? "checked" : ""} />
          Show on homepage
        </label>
      </div>
      <div class="grid">${body}</div>
    </section>`;
}

function listToolbar(addAction, addLabel) {
  return `<div class="field full home-toolbar">
    <button type="button" class="btn btn-gold btn-sm" data-action="${addAction}">${addLabel}</button>
  </div>`;
}

function renderHome(d) {
  const sec = d.sections || {};
  const metrics = d.heroDashboard?.metrics || [];
  const assistActions = d.aiAssist?.actions || [];
  const services = d.services || [];
  const goals = d.challengeLinks || [];
  const sizes = d.businessSizeLinks || [];
  const packages = d.packages || [];
  const insights = d.insightLinks || [];
  const ratings = d.ratings || [];
  const testimonials = d.testimonials || [];
  const heroStats = d.heroStats || [];
  const statsBand = d.statsBand || [];

  const metricRows = metrics
    .map(
      (m, i) => `
      <div class="list-item home-item">
        <div class="grid">
          ${field("Value", `heroDashboard.metrics.${i}.value`, m.value || "")}
          ${field("Label", `heroDashboard.metrics.${i}.label`, m.label || "")}
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-action="del-home-metric" data-index="${i}">Remove</button>
      </div>`,
    )
    .join("");

  const assistRows = assistActions
    .map(
      (a, i) => `
      <div class="list-item home-item">
        <div class="grid">
          ${field("Button label", `aiAssist.actions.${i}.label`, a.label || "")}
          ${field("Link", `aiAssist.actions.${i}.href`, a.href || "/contact")}
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-action="del-home-assist" data-index="${i}">Remove</button>
      </div>`,
    )
    .join("");

  const serviceRows = services
    .map(
      (s, i) => `
      <details class="item-card home-item" open>
        <summary>
          <span>Service ${i + 1}: ${escapeHtml(s.title || "Untitled")}</span>
          <button type="button" class="btn btn-ghost btn-sm" data-action="del-home-service" data-index="${i}">Delete</button>
        </summary>
        <div class="grid" style="margin-top:.85rem">
          ${field("Title", `services.${i}.title`, s.title || "")}
          ${field("Link (href)", `services.${i}.href`, s.href || "/services")}
          ${field("Icon name", `services.${i}.icon`, s.icon || "grid")}
          ${field("Color", `services.${i}.color`, s.color || "#0056ff", "color")}
          ${field("Description", `services.${i}.desc`, s.desc || "", "textarea")}
        </div>
      </details>`,
    )
    .join("");

  const goalRows = goals
    .map(
      (g, i) => `
      <div class="list-item home-item">
        <div class="grid">
          ${field("Label", `challengeLinks.${i}.label`, g.label || "")}
          ${field("Link", `challengeLinks.${i}.href`, g.href || "/solutions")}
          ${field("Icon", `challengeLinks.${i}.icon`, g.icon || "target")}
          ${field("Description", `challengeLinks.${i}.desc`, g.desc || "", "textarea")}
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-action="del-home-goal" data-index="${i}">Remove</button>
      </div>`,
    )
    .join("");

  const sizeRows = sizes
    .map(
      (g, i) => `
      <div class="list-item home-item">
        <div class="grid">
          ${field("Label", `businessSizeLinks.${i}.label`, g.label || "")}
          ${field("Link", `businessSizeLinks.${i}.href`, g.href || "/solutions")}
          ${field("Icon", `businessSizeLinks.${i}.icon`, g.icon || "building")}
          ${field("Description", `businessSizeLinks.${i}.desc`, g.desc || "", "textarea")}
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-action="del-home-size" data-index="${i}">Remove</button>
      </div>`,
    )
    .join("");

  const packageRows = packages
    .map(
      (p, i) => `
      <details class="item-card home-item" open>
        <summary>
          <span>Package ${i + 1}: ${escapeHtml(p.name || "Untitled")}${p.highlighted ? " ★" : ""}</span>
          <button type="button" class="btn btn-ghost btn-sm" data-action="del-home-package" data-index="${i}">Delete</button>
        </summary>
        <div class="grid" style="margin-top:.85rem">
          ${field("Name", `packages.${i}.name`, p.name || "")}
          ${field("Price", `packages.${i}.price`, p.price || "")}
          ${field("Period", `packages.${i}.period`, p.period || "/mo")}
          ${field("Badge", `packages.${i}.badge`, p.badge || "")}
          ${field("CTA label", `packages.${i}.ctaLabel`, p.ctaLabel || "View Details")}
          ${field("CTA link", `packages.${i}.href`, p.href || "/packages")}
          ${field("Highlight as best value", `packages.${i}.highlighted`, !!p.highlighted, "checkbox")}
          <div class="field full"><label>Features (one per line)</label>
            <textarea data-path="packages.${i}.features" data-array="true">${escapeHtml((p.features || []).join("\n"))}</textarea>
          </div>
        </div>
      </details>`,
    )
    .join("");

  const insightRows = insights
    .map(
      (post, i) => `
      <div class="list-item home-item">
        <div class="grid">
          ${field("Title", `insightLinks.${i}.title`, post.title || "")}
          ${field("Date label", `insightLinks.${i}.date`, post.date || "")}
          ${field("Link", `insightLinks.${i}.href`, post.href || "/resources")}
          ${field("Card gradient CSS", `insightLinks.${i}.gradient`, post.gradient || "linear-gradient(135deg,#0ea5e9,#0369a1)")}
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-action="del-home-insight" data-index="${i}">Remove</button>
      </div>`,
    )
    .join("");

  const ratingRows = ratings
    .map(
      (r, i) => `
      <div class="list-item home-item">
        <div class="grid">
          ${field("Platform", `ratings.${i}.label`, r.label || "")}
          ${field("Score", `ratings.${i}.score`, r.score || "")}
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-action="del-home-rating" data-index="${i}">Remove</button>
      </div>`,
    )
    .join("");

  const testimonialRows = testimonials
    .map(
      (t, i) => `
      <div class="list-item home-item">
        <div class="grid">
          ${field("Name", `testimonials.${i}.name`, t.name || "")}
          ${field("Title / company", `testimonials.${i}.title`, t.title || "")}
          ${field("Rating (1-5)", `testimonials.${i}.rating`, t.rating ?? 5, "number")}
          ${field("Quote", `testimonials.${i}.quote`, t.quote || "", "textarea")}
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-action="del-home-testimonial" data-index="${i}">Remove</button>
      </div>`,
    )
    .join("");

  const heroStatRows = heroStats
    .map(
      (s, i) => `
      <div class="list-item home-item">
        <div class="grid">
          ${field("Value", `heroStats.${i}.value`, s.value || "")}
          ${field("Label", `heroStats.${i}.label`, s.label || "")}
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-action="del-home-herostat" data-index="${i}">Remove</button>
      </div>`,
    )
    .join("");

  const statsBandRows = statsBand
    .map(
      (s, i) => `
      <div class="list-item home-item">
        <div class="grid">
          ${field("Value", `statsBand.${i}.value`, s.value || "")}
          ${field("Label", `statsBand.${i}.label`, s.label || "")}
        </div>
        <button type="button" class="btn btn-ghost btn-sm" data-action="del-home-statsband" data-index="${i}">Remove</button>
      </div>`,
    )
    .join("");

  return `
    <div class="home-intro card">
      <h3>Homepage builder</h3>
      <p>Edit every homepage section below. Toggle <strong>Show on homepage</strong> to hide a block. Click <strong>Save changes</strong> to publish instantly.</p>
      <div class="home-jump">
        <a href="#home-sec-seo">SEO</a>
        <a href="#home-sec-hero">Hero</a>
        <a href="#home-sec-trust">Trust</a>
        <a href="#home-sec-services">Services</a>
        <a href="#home-sec-ai">AI</a>
        <a href="#home-sec-industries">Industries</a>
        <a href="#home-sec-solutions">Solutions</a>
        <a href="#home-sec-packages">Packages</a>
        <a href="#home-sec-tools">Tools</a>
        <a href="#home-sec-cases">Cases</a>
        <a href="#home-sec-portfolio">Portfolio</a>
        <a href="#home-sec-testimonials">Testimonials</a>
        <a href="#home-sec-insights">Insights</a>
        <a href="#home-sec-location">Location</a>
      </div>
    </div>

    <div class="card home-section-card" id="home-sec-seo">
      <div class="home-section-head"><h3>1. SEO</h3></div>
      <div class="grid">
        ${field("SEO title", "seo.title", d.seo?.title || "")}
        ${field("SEO description", "seo.description", d.seo?.description || "", "textarea")}
      </div>
    </div>

    ${homeSection(
      "hero",
      "2. Hero",
      sec.hero,
      `
      ${field("Eyebrow", "hero.eyebrow", d.hero?.eyebrow || "")}
      ${field("Title (before accent)", "hero.titleBefore", d.hero?.titleBefore || "")}
      ${field("Title accent", "hero.titleAccent", d.hero?.titleAccent || "")}
      ${field("Lead paragraph", "hero.lead", d.hero?.lead || "", "textarea")}
      ${field("Primary CTA label", "hero.primaryCta", d.hero?.primaryCta || "")}
      ${field("Primary CTA link", "hero.primaryCtaHref", d.hero?.primaryCtaHref || "/contact")}
      ${field("Secondary CTA label", "hero.secondaryCta", d.hero?.secondaryCta || "")}
      ${field("Secondary CTA link", "hero.secondaryCtaHref", d.hero?.secondaryCtaHref || "/contact")}
      ${field("Showreel label", "hero.showreelLabel", d.hero?.showreelLabel || "")}
      ${field("Showreel link", "hero.showreelHref", d.hero?.showreelHref || "/portfolio")}
      ${field("Portfolio link label", "hero.portfolioLabel", d.hero?.portfolioLabel || "")}
      ${field("Portfolio link", "hero.portfolioHref", d.hero?.portfolioHref || "/portfolio")}
    `,
    )}

    ${homeSection(
      "heroDashboard",
      "3. Hero dashboard card",
      sec.heroDashboard,
      `
      ${field("Dashboard title", "heroDashboard.title", d.heroDashboard?.title || "")}
      ${field("Dashboard meta", "heroDashboard.meta", d.heroDashboard?.meta || "")}
      <div class="field full"><h4 class="subhead">Metrics</h4></div>
      ${metricRows || '<p class="hint">No metrics yet.</p>'}
      ${listToolbar("add-home-metric", "+ Add metric")}
    `,
    )}

    ${homeSection(
      "aiAssist",
      "4. Hero AI assistant card",
      sec.aiAssist,
      `
      ${field("Title", "aiAssist.title", d.aiAssist?.title || "")}
      ${field("Body", "aiAssist.body", d.aiAssist?.body || "", "textarea")}
      <div class="field full"><h4 class="subhead">Action chips</h4></div>
      ${assistRows || '<p class="hint">No actions yet.</p>'}
      ${listToolbar("add-home-assist", "+ Add action")}
    `,
    )}

    ${homeSection(
      "heroStats",
      "5. Hero stats row",
      sec.heroStats,
      `
      <p class="hint field full">Optional. If empty, the site uses company stats (projects, clients, industries, leads, satisfaction).</p>
      ${heroStatRows || '<p class="hint">Using company stats (leave empty to keep that).</p>'}
      ${listToolbar("add-home-herostat", "+ Add hero stat")}
    `,
    )}

    ${homeSection(
      "trust",
      "6. Trust strip + client logos + partners",
      sec.trust,
      `
      ${field("Trust label", "trustLabel", d.trustLabel || "")}
      <div class="field full"><label>Client logos (one per line)</label>
        <textarea data-path="clientLogos" data-array="true">${escapeHtml((d.clientLogos || []).join("\n"))}</textarea>
        <p class="hint">Overrides Testimonials &amp; Extras logos when set.</p>
      </div>
      <div class="field full"><label>Partner badges (one per line)</label>
        <textarea data-path="partners" data-array="true">${escapeHtml((d.partners || []).join("\n"))}</textarea>
      </div>
    `,
    )}

    ${homeSection(
      "statsBand",
      "7. Stats band",
      sec.statsBand,
      `
      <p class="hint field full">Optional custom stats band. If empty, company stats are used.</p>
      ${statsBandRows || '<p class="hint">Using company stats.</p>'}
      ${listToolbar("add-home-statsband", "+ Add stats band item")}
    `,
    )}

    ${homeSection(
      "services",
      "8. Services",
      sec.services,
      `
      ${field("Section title", "servicesTitle", d.servicesTitle || "")}
      ${field("Section subtitle", "servicesSub", d.servicesSub || "", "textarea")}
      ${field("View all label", "servicesViewAllLabel", d.servicesViewAllLabel || "View All Services →")}
      ${field("View all link", "servicesViewAllHref", d.servicesViewAllHref || "/services")}
      ${field("All-services card title", "allServicesCard.title", d.allServicesCard?.title || "")}
      ${field("All-services card link", "allServicesCard.href", d.allServicesCard?.href || "/services")}
      ${field("All-services card description", "allServicesCard.desc", d.allServicesCard?.desc || "", "textarea")}
      <div class="field full"><h4 class="subhead">Service cards</h4></div>
      ${serviceRows || '<p class="hint">No service cards.</p>'}
      ${listToolbar("add-home-service", "+ Add service card")}
    `,
    )}

    ${homeSection(
      "aiBanner",
      "9. AI platform banner",
      sec.aiBanner,
      `
      ${field("Title", "aiBanner.title", d.aiBanner?.title || "")}
      ${field("Subtitle", "aiBanner.sub", d.aiBanner?.sub || "", "textarea")}
      ${field("CTA label", "aiBanner.ctaLabel", d.aiBanner?.ctaLabel || "")}
      ${field("CTA link", "aiBanner.ctaHref", d.aiBanner?.ctaHref || "/ai-platform")}
      <div class="field full"><label>Bullets (one per line)</label>
        <textarea data-path="aiBanner.bullets" data-array="true">${escapeHtml((d.aiBanner?.bullets || []).join("\n"))}</textarea>
      </div>
    `,
    )}

    ${homeSection(
      "industries",
      "10. Industries",
      sec.industries,
      `
      ${field("Section title", "industriesTitle", d.industriesTitle || "")}
      ${field("CTA label", "industriesCtaLabel", d.industriesCtaLabel || "View All Industries →")}
      ${field("CTA link", "industriesCtaHref", d.industriesCtaHref || "/industries")}
      ${field("More industries label", "industriesMoreLabel", d.industriesMoreLabel || "More Industries")}
      <div class="field full"><label>Industry slugs (one per line)</label>
        <textarea data-path="industrySlugs" data-array="true">${escapeHtml((d.industrySlugs || []).join("\n"))}</textarea>
        <p class="hint">Must match slugs in the Industries collection.</p>
      </div>
    `,
    )}

    ${homeSection(
      "solutions",
      "11. Solutions by goal & business size",
      sec.solutions,
      `
      ${field("Goals title", "challengesTitle", d.challengesTitle || "Solutions by Goal")}
      ${field("Goals view-all label", "challengesViewAllLabel", d.challengesViewAllLabel || "View All Goal Solutions →")}
      ${field("Goals view-all link", "challengesViewAllHref", d.challengesViewAllHref || "/solutions")}
      <div class="field full"><h4 class="subhead">Goal links</h4></div>
      ${goalRows || '<p class="hint">No goal links.</p>'}
      ${listToolbar("add-home-goal", "+ Add goal link")}
      ${field("Business size title", "businessSizeTitle", d.businessSizeTitle || "Solutions by Business Size")}
      ${field("Size view-all label", "businessSizeViewAllLabel", d.businessSizeViewAllLabel || "View All Size Solutions →")}
      ${field("Size view-all link", "businessSizeViewAllHref", d.businessSizeViewAllHref || "/solutions")}
      <div class="field full"><h4 class="subhead">Business size links</h4></div>
      ${sizeRows || '<p class="hint">No size links.</p>'}
      ${listToolbar("add-home-size", "+ Add size link")}
    `,
    )}

    ${homeSection(
      "packages",
      "12. Featured packages",
      sec.packages,
      `
      ${field("Section title", "packagesTitle", d.packagesTitle || "")}
      ${field("Section subtitle", "packagesSub", d.packagesSub || "")}
      ${field("Compare label", "packagesCompareLabel", d.packagesCompareLabel || "Compare All Packages →")}
      ${field("Compare link", "packagesCompareHref", d.packagesCompareHref || "/packages")}
      <div class="field full"><label>Trust pills (one per line)</label>
        <textarea data-path="packagePills" data-array="true">${escapeHtml((d.packagePills || []).join("\n"))}</textarea>
      </div>
      <div class="field full"><h4 class="subhead">Package cards</h4></div>
      ${packageRows || '<p class="hint">No packages.</p>'}
      ${listToolbar("add-home-package", "+ Add package")}
    `,
    )}

    ${homeSection(
      "tools",
      "13. Free tools",
      sec.tools,
      `
      ${field("Section title", "toolsTitle", d.toolsTitle || "")}
      ${field("CTA label", "toolsCtaLabel", d.toolsCtaLabel || "Explore All Tools →")}
      ${field("CTA link", "toolsCtaHref", d.toolsCtaHref || "/free-tools")}
      <div class="field full"><label>Tool category slugs (one per line)</label>
        <textarea data-path="toolCategorySlugs" data-array="true">${escapeHtml((d.toolCategorySlugs || []).join("\n"))}</textarea>
        <p class="hint">Must match Free Tools collection slugs.</p>
      </div>
    `,
    )}

    ${homeSection(
      "cases",
      "14. Case studies",
      sec.cases,
      `
      ${field("Section title", "casesTitle", d.casesTitle || "")}
      ${field("View all label", "casesViewAllLabel", d.casesViewAllLabel || "View All Case Studies →")}
      ${field("View all link", "casesViewAllHref", d.casesViewAllHref || "/case-studies")}
      <div class="field full"><label>Case study slugs (one per line)</label>
        <textarea data-path="caseSlugs" data-array="true">${escapeHtml((d.caseSlugs || []).join("\n"))}</textarea>
      </div>
    `,
    )}

    ${homeSection(
      "portfolio",
      "15. Portfolio",
      sec.portfolio,
      `
      ${field("Section title", "portfolioTitle", d.portfolioTitle || "")}
      ${field("CTA label", "portfolioCtaLabel", d.portfolioCtaLabel || "View Full Portfolio →")}
      ${field("CTA link", "portfolioCtaHref", d.portfolioCtaHref || "/portfolio")}
      <div class="field full"><label>Portfolio project slugs (one per line)</label>
        <textarea data-path="portfolioSlugs" data-array="true">${escapeHtml((d.portfolioSlugs || []).join("\n"))}</textarea>
      </div>
    `,
    )}

    ${homeSection(
      "testimonials",
      "16. Testimonials & ratings",
      sec.testimonials,
      `
      ${field("Section title", "testimonialsTitle", d.testimonialsTitle || "")}
      <div class="field full"><h4 class="subhead">Rating badges</h4></div>
      ${ratingRows || '<p class="hint">No ratings.</p>'}
      ${listToolbar("add-home-rating", "+ Add rating")}
      <div class="field full"><h4 class="subhead">Testimonial cards</h4></div>
      <p class="hint field full">If empty, testimonials from Testimonials &amp; Extras are used.</p>
      ${testimonialRows || '<p class="hint">Using global testimonials.</p>'}
      ${listToolbar("add-home-testimonial", "+ Add testimonial")}
    `,
    )}

    ${homeSection(
      "insights",
      "17. Latest insights",
      sec.insights,
      `
      ${field("Section title", "insightsTitle", d.insightsTitle || "")}
      ${field("CTA label", "insightsCtaLabel", d.insightsCtaLabel || "View All Resources →")}
      ${field("CTA link", "insightsCtaHref", d.insightsCtaHref || "/resources")}
      <div class="field full"><h4 class="subhead">Insight cards</h4></div>
      ${insightRows || '<p class="hint">No insight cards.</p>'}
      ${listToolbar("add-home-insight", "+ Add insight card")}
    `,
    )}

    ${homeSection(
      "location",
      "18. Google Business / location",
      sec.location !== false && d.location?.enabled !== false,
      `
      ${field("Show location section", "location.enabled", d.location?.enabled !== false, "checkbox")}
      ${field("Title", "location.title", d.location?.title || "")}
      ${field("Subtitle", "location.sub", d.location?.sub || "", "textarea")}
      ${field("Primary CTA label", "location.ctaLabel", d.location?.ctaLabel || "")}
      ${field("Directions CTA label", "location.directionsLabel", d.location?.directionsLabel || "")}
      <p class="hint field full">Map / GMB URLs are edited in <strong>Header, Footer &amp; Company</strong>.</p>
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
  const cleared = d.cacheClearedAt
    ? new Date(d.cacheClearedAt).toLocaleString()
    : "Never";
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
    <h3>Site cache</h3>
    <p style="color:var(--muted);font-size:.92rem;line-height:1.55;margin:0 0 .75rem">
      Desktop browsers often keep an old <code>index.html</code> that points at deleted CSS/JS files,
      which makes the site look unstyled. Use <strong>Clear cache</strong> after deploys or whenever
      the live site looks broken on desktop.
    </p>
    <p style="font-size:.85rem;margin:0 0 1rem">
      Cache version: <code>${escapeHtml(d.cacheVersion || "—")}</code><br />
      Last cleared: <strong>${escapeHtml(cleared)}</strong>
    </p>
    <button type="button" class="btn btn-gold" data-action="clear-cache">Clear site cache now</button>
  </div>
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
  const i = Number(index);

  const ensure = (key, fallback = []) => {
    if (!Array.isArray(d[key])) d[key] = fallback;
    return d[key];
  };

  if (action === "add-nav") {
    d.navItems = d.navItems || [];
    d.navItems.push({ label: "New Link", href: "/", mega: false });
  } else if (action === "del-nav") {
    d.navItems.splice(i, 1);
  } else if (action === "add-item") {
    d.items = d.items || [];
    d.items.unshift(blankCatalogItem(index || "Item"));
  } else if (action === "del-item") {
    if (!confirm("Delete this page item?")) return;
    d.items.splice(i, 1);
  } else if (action === "add-benefit") {
    const item = d.items[i];
    item.benefits = item.benefits || [];
    item.benefits.push({ title: "New benefit", desc: "" });
  } else if (action === "add-faq") {
    const item = d.items[i];
    item.faqs = item.faqs || [];
    item.faqs.push({ q: "New question?", a: "" });
  } else if (action === "add-testimonial") {
    d.testimonials = d.testimonials || [];
    d.testimonials.push({ quote: "", name: "", title: "", rating: 5 });
  } else if (action === "del-testimonial") {
    d.testimonials.splice(i, 1);
  } else if (action === "add-home-metric") {
    d.heroDashboard = d.heroDashboard || { title: "", meta: "", metrics: [] };
    d.heroDashboard.metrics = d.heroDashboard.metrics || [];
    d.heroDashboard.metrics.push({ value: "0", label: "New metric" });
  } else if (action === "del-home-metric") {
    d.heroDashboard?.metrics?.splice(i, 1);
  } else if (action === "add-home-assist") {
    d.aiAssist = d.aiAssist || { title: "", body: "", actions: [] };
    d.aiAssist.actions = d.aiAssist.actions || [];
    d.aiAssist.actions.push({ label: "New action", href: "/contact" });
  } else if (action === "del-home-assist") {
    d.aiAssist?.actions?.splice(i, 1);
  } else if (action === "add-home-service") {
    ensure("services").push({
      title: "New Service",
      desc: "Describe this service.",
      icon: "grid",
      color: "#0056ff",
      href: "/services",
    });
  } else if (action === "del-home-service") {
    ensure("services").splice(i, 1);
  } else if (action === "add-home-goal") {
    ensure("challengeLinks").push({
      label: "New goal",
      desc: "Describe the outcome.",
      href: "/solutions",
      icon: "target",
    });
  } else if (action === "del-home-goal") {
    ensure("challengeLinks").splice(i, 1);
  } else if (action === "add-home-size") {
    ensure("businessSizeLinks").push({
      label: "New segment",
      desc: "Describe this business size.",
      href: "/solutions",
      icon: "building",
    });
  } else if (action === "del-home-size") {
    ensure("businessSizeLinks").splice(i, 1);
  } else if (action === "add-home-package") {
    ensure("packages").push({
      name: "New Package",
      price: "₹0",
      period: "/mo",
      features: ["Feature 1", "Feature 2"],
      highlighted: false,
      href: "/packages",
      ctaLabel: "View Details",
    });
  } else if (action === "del-home-package") {
    ensure("packages").splice(i, 1);
  } else if (action === "add-home-insight") {
    ensure("insightLinks").push({
      title: "New insight",
      date: "Aug 2026",
      href: "/resources",
      gradient: "linear-gradient(135deg,#0ea5e9,#0369a1)",
    });
  } else if (action === "del-home-insight") {
    ensure("insightLinks").splice(i, 1);
  } else if (action === "add-home-rating") {
    ensure("ratings").push({ label: "Platform", score: "5.0/5" });
  } else if (action === "del-home-rating") {
    ensure("ratings").splice(i, 1);
  } else if (action === "add-home-testimonial") {
    ensure("testimonials").push({
      quote: "Write the client quote here.",
      name: "Client Name",
      title: "Role, Company",
      rating: 5,
    });
  } else if (action === "del-home-testimonial") {
    ensure("testimonials").splice(i, 1);
  } else if (action === "add-home-herostat") {
    ensure("heroStats").push({ value: "0+", label: "Label" });
  } else if (action === "del-home-herostat") {
    ensure("heroStats").splice(i, 1);
  } else if (action === "add-home-statsband") {
    ensure("statsBand").push({ value: "0+", label: "Label" });
  } else if (action === "del-home-statsband") {
    ensure("statsBand").splice(i, 1);
  } else if (action === "clear-cache") {
    clearSiteCache();
    return;
  } else return;

  if (d.navItems) {
    d.navItems.forEach((n) => {
      if (n.mega === "false" || n.mega === "") n.mega = false;
    });
  }

  setDirty(true);
  renderEditor();
}

async function clearSiteCache() {
  const btn = $("#clear-cache-btn");
  if (btn) btn.disabled = true;
  try {
    const res = await api("clear-cache", {});
    toast(res.message || `Cache cleared (v${res.cacheVersion})`);
    if (state.current === "settings") {
      await openCollection("settings");
    }
  } catch (e) {
    toast(e.message || "Could not clear cache", "err");
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function save() {
  if (!state.current || !state.data || state.current === "leads") return;
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

function applyStatus(status) {
  state.collections = status.collections || {};
  state.newLeads = status.newLeads || 0;
  if (status.notifyEmail) state.notifyEmail = status.notifyEmail;
}

async function init() {
  $("#login-form").onsubmit = async (e) => {
    e.preventDefault();
    $("#login-error").hidden = true;
    try {
      await api("login", { password: $("#password").value });
      state.authed = true;
      const status = await api("status");
      applyStatus(status);
      showLogin(false);
      renderNav();
      openLeads();
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
    state.newLeads = 0;
    setDirty(false);
    $("#save-btn").hidden = false;
    showLogin(true);
  };

  $("#save-btn").onclick = save;
  $("#reload-btn").onclick = () => state.current && openCollection(state.current);
  $("#clear-cache-btn").onclick = () => clearSiteCache();

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
      e.preventDefault();
      if (state.dirty && state.current !== "leads") save();
    }
  });

  try {
    const status = await api("status");
    applyStatus(status);
    if (status.authenticated) {
      state.authed = true;
      showLogin(false);
      renderNav();
      openLeads();
    } else showLogin(true);
  } catch {
    showLogin(true);
  }
}

init();

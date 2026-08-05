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
  $("#save-btn").disabled = !v;
}

function showLogin(show) {
  $("#login-view").hidden = !show;
  $("#cms-view").hidden = show;
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

  if (key === "company") wrap.innerHTML = renderCompany(data);
  else if (key === "services") wrap.innerHTML = renderServices(data);
  else if (key === "packages") wrap.innerHTML = renderPackages(data);
  else if (key === "portfolio") wrap.innerHTML = renderPortfolio(data);
  else if (key === "content") wrap.innerHTML = renderContent(data);
  else if (key === "settings") wrap.innerHTML = renderSettings(data);
  else wrap.innerHTML = `<div class="card"><p>Unknown collection.</p></div>`;

  bindFields(wrap, data);

  wrap.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => handleAction(btn.dataset.action, btn));
  });
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
    <div class="field full">
      <label>Homepage featured service slugs (one per line)</label>
      <textarea data-path="homeServices" data-array="true">${escapeHtml(home)}</textarea>
    </div>
  </div>
  ${services.map((s, i) => `
    <details class="item-card" ${i < 3 ? "open" : ""}>
      <summary>
        <span>${escapeHtml(s.title || s.slug || "Service")} <small style="color:#888;font-weight:400">/${escapeHtml(s.slug || "")}</small></span>
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
        <div class="field full">
          <label>Benefits (one per line)</label>
          <textarea data-path="services.${i}.benefits" data-array="true">${escapeHtml((s.benefits || []).join("\n"))}</textarea>
        </div>
        <div class="field full">
          <label>Related service slugs (one per line)</label>
          <textarea data-path="services.${i}.related" data-array="true">${escapeHtml((s.related || []).join("\n"))}</textarea>
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
  </div>`;
}

function handleAction(action, btn) {
  const i = Number(btn.dataset.index);
  const d = state.data;
  const add = (key, item) => { d[key] = d[key] || []; d[key].unshift(item); setDirty(true); renderEditor(); };
  const del = (key) => { if (!confirm("Delete this item?")) return; d[key].splice(i, 1); setDirty(true); renderEditor(); };

  switch (action) {
    case "add-service":
      add("services", { slug: "new-service", title: "New Service", short: "", description: "", benefits: [], image: "", category: "Wedding", related: [] });
      break;
    case "del-service": del("services"); break;
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
  }
}

async function save() {
  if (!state.current || !state.data) return;
  try {
    await api("save", { collection: state.current, data: state.data });
    setDirty(false);
    toast("Saved — website will show updates on refresh");
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
  err.hidden = true;
  try {
    await api("login", { password });
    state.authed = true;
    showLogin(false);
    const status = await fetch(`${API}?action=status`, { credentials: "include" }).then((r) => r.json());
    state.collections = status.collections || {};
    renderNav();
    const first = Object.keys(state.collections)[0];
    if (first) loadCollection(first);
  } catch (ex) {
    err.hidden = false;
    err.textContent = ex.message || "Login failed";
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

window.addEventListener("beforeunload", (e) => {
  if (state.dirty) { e.preventDefault(); e.returnValue = ""; }
});

boot();

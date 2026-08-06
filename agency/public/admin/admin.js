const API = "./api.php";

const state = {
  authed: false,
  collections: {},
  current: null,
  data: null,
  dirty: false,
  newLeads: 0,
  notifyEmail: "info@displayavenue.com",
  mailStats: { sent: 0, failed: 0, attempted: 0, byType: {}, recent: [] },
  shopOrders: { items: [] },
  razorpayConfigured: false,
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

/** Image size presets shown next to each upload control. */
const IMAGE_PRESETS = {
  hero: {
    label: "Hero / banner",
    recommend: "1600 × 900 px",
    ratio: "16:9",
    maxEdge: 1600,
    quality: 0.82,
    hint: "Wide banner for landing pages and homepage hero. SVG vector also OK.",
  },
  cover: {
    label: "Cover image",
    recommend: "1400 × 800 px",
    ratio: "16:9",
    maxEdge: 1400,
    quality: 0.82,
    hint: "Detail-page cover. Prefer landscape photos or SVG illustrations.",
  },
  card: {
    label: "Card / thumbnail",
    recommend: "1200 × 675 px",
    ratio: "16:9",
    maxEdge: 1200,
    quality: 0.8,
    hint: "Listing cards, case studies, portfolio tiles.",
  },
  product: {
    label: "Product image",
    recommend: "1200 × 1200 px",
    ratio: "1:1",
    maxEdge: 1200,
    quality: 0.82,
    hint: "Square product shot for the shop. Transparent PNG or SVG OK.",
  },
  logo: {
    label: "Logo / mark",
    recommend: "512 × 512 px",
    ratio: "1:1",
    maxEdge: 512,
    quality: 0.9,
    hint: "Prefer SVG vector logo. PNG with transparent background also works.",
  },
  og: {
    label: "Social share (OG)",
    recommend: "1200 × 630 px",
    ratio: "1.91:1",
    maxEdge: 1200,
    quality: 0.82,
    hint: "Facebook / LinkedIn / WhatsApp link preview image.",
  },
};

function imageField(label, path, value, presetKey = "card") {
  const preset = IMAGE_PRESETS[presetKey] || IMAGE_PRESETS.card;
  const id = "img_" + path.replace(/[^a-z0-9]/gi, "_");
  const url = String(value || "").trim();
  const preview = url
    ? `<img src="${escapeAttr(url)}" alt="" loading="lazy" />`
    : `<div class="image-preview-empty" aria-hidden="true">
        <svg viewBox="0 0 64 64" width="48" height="48" fill="none">
          <rect x="8" y="14" width="48" height="36" rx="6" stroke="#c9a227" stroke-width="2"/>
          <circle cx="24" cy="28" r="5" stroke="#c9a227" stroke-width="2"/>
          <path d="M12 44l14-12 10 8 8-6 8 10" stroke="#c9a227" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>No image yet</span>
      </div>`;
  return `
  <div class="field full image-field">
    <label>${escapeHtml(label)}</label>
    <div class="image-specs">
      <strong>${escapeHtml(preset.recommend)}</strong>
      <span>· ${escapeHtml(preset.ratio)}</span>
      <span>· JPG / PNG / WebP / GIF / <em>SVG vector</em></span>
      <span class="image-specs-note">${escapeHtml(preset.hint)} Auto-compressed before upload so pages stay fast.</span>
    </div>
    <div class="image-picker">
      <div class="image-preview">${preview}</div>
      <div class="image-actions">
        <button type="button" class="btn btn-gold btn-sm" data-image-pick="${escapeAttr(id)}">
          ${url ? "Replace image" : "Upload image"}
        </button>
        ${
          url
            ? `<button type="button" class="btn btn-ghost btn-sm" data-image-clear="${escapeAttr(path)}">Remove</button>`
            : ""
        }
        ${url ? `<code class="image-url-chip" title="${escapeAttr(url)}">${escapeHtml(url)}</code>` : ""}
      </div>
    </div>
    <input
      type="file"
      id="${escapeAttr(id)}"
      class="image-file-input"
      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.svg"
      data-image-upload
      data-image-path="${escapeAttr(path)}"
      data-image-preset="${escapeAttr(presetKey)}"
      hidden
    />
  </div>`;
}

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });
}

/** Browser-side resize + compress before upload (keeps SVG vectors as-is). */
async function compressImageFile(file, presetKey = "card") {
  const preset = IMAGE_PRESETS[presetKey] || IMAGE_PRESETS.card;
  const isSvg =
    file.type === "image/svg+xml" || /\.svg$/i.test(file.name || "");
  if (isSvg) {
    return { blob: file, fileName: file.name, compressed: false, note: "SVG vector kept as-is" };
  }
  if (file.type === "image/gif" || /\.gif$/i.test(file.name || "")) {
    return { blob: file, fileName: file.name, compressed: false, note: "GIF kept as-is" };
  }

  const img = await loadImageElement(file);
  const maxEdge = preset.maxEdge || 1200;
  const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);

  const quality = preset.quality || 0.82;
  let blob = await canvasToBlob(canvas, "image/webp", quality);
  let outName = (file.name || "image").replace(/\.[^.]+$/, "") + ".webp";
  if (!blob || blob.size === 0) {
    blob = await canvasToBlob(canvas, "image/jpeg", quality);
    outName = (file.name || "image").replace(/\.[^.]+$/, "") + ".jpg";
  }
  // If compression somehow got larger, keep the smaller of original vs compressed
  if (blob && blob.size >= file.size && scale === 1) {
    return { blob: file, fileName: file.name, compressed: false, note: "Original already small" };
  }
  const saved = file.size > 0 && blob ? Math.round((1 - blob.size / file.size) * 100) : 0;
  return {
    blob,
    fileName: outName,
    compressed: true,
    note: saved > 0 ? `Compressed ~${saved}% · ${w}×${h}px` : `Resized to ${w}×${h}px`,
  };
}

async function uploadCmsImage(input) {
  const file = input?.files?.[0];
  const path = input?.getAttribute("data-image-path");
  const preset = input?.getAttribute("data-image-preset") || "card";
  if (!file || !path) return;
  try {
    toast("Compressing image…");
    const prepared = await compressImageFile(file, preset);
    const fd = new FormData();
    fd.append("file", prepared.blob, prepared.fileName || file.name);
    fd.append("preset", preset);
    toast(prepared.note ? `Uploading… (${prepared.note})` : "Uploading image…");
    const res = await fetch(`${API}?action=upload-image`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const json = await res.json().catch(() => ({ ok: false, error: "Invalid response" }));
    if (!res.ok || json.ok === false) throw new Error(json.error || "Upload failed");
    setByPath(state.data, path, json.url);
    setDirty(true);
    renderEditor();
    const dims =
      json.width && json.height ? ` · ${json.width}×${json.height}px` : "";
    const kb = json.bytes ? ` · ${Math.max(1, Math.round(json.bytes / 1024))} KB` : "";
    toast(`Image saved${dims}${kb}`);
  } catch (e) {
    toast(e.message || "Image upload failed", "err");
  } finally {
    if (input) input.value = "";
  }
}

function bindImageFields(root = $("#editor-wrap")) {
  root.querySelectorAll("[data-image-pick]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-image-pick");
      const input = id ? document.getElementById(id) : null;
      input?.click();
    });
  });
  root.querySelectorAll("[data-image-upload]").forEach((input) => {
    input.addEventListener("change", () => {
      void uploadCmsImage(input);
    });
  });
  root.querySelectorAll("[data-image-clear]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const path = btn.getAttribute("data-image-clear");
      if (!path) return;
      setByPath(state.data, path, "");
      setDirty(true);
      renderEditor();
    });
  });
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
    if (key === "shop") {
      state.shopOrders = json.orders || { items: [] };
      state.razorpayConfigured = Boolean(json.razorpayConfigured);
    }
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
    if (json.mailStats) state.mailStats = json.mailStats;
    if (json.notifyEmail) state.notifyEmail = json.notifyEmail;
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
    chatbot: renderChatbot,
    catalogue: renderCatalogue,
    shop: renderShop,
    landings: renderLandings,
    settings: renderSettings,
  };
  wrap.innerHTML = (map[key] || (() => `<pre>${escapeHtml(JSON.stringify(d, null, 2))}</pre>`))(d);
  bindFields(wrap);
  bindImageFields(wrap);
  wrap.querySelectorAll("[data-action]").forEach((btn) => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleAction(btn.dataset.action, btn.dataset.index);
    };
  });
  if (key === "catalogue") {
    const input = wrap.querySelector("#catalogue-pdf");
    if (input) {
      input.onchange = () => {
        void uploadCataloguePdf(input);
      };
    }
  }
  if (key === "shop") {
    wrap.querySelectorAll("[data-shop-order-action]").forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        void handleShopOrderAction(btn.dataset.shopOrderAction, btn.dataset.id);
      };
    });
  }
}

function renderLeads(d) {
  const items = d.items || [];
  const newCount = items.filter((i) => (i.status || "new") === "new").length;
  const emailedCount = items.filter((i) => i.emailed === true).length;
  const stats = state.mailStats || { sent: 0, failed: 0, attempted: 0, recent: [] };
  const recent = Array.isArray(stats.recent) ? stats.recent.slice(0, 8) : [];
  const recentRows = recent
    .map((m) => {
      const when = m.at ? new Date(m.at).toLocaleString() : "—";
      return `<tr>
        <td>${escapeHtml(when)}</td>
        <td>${m.ok ? "Sent" : "Failed"}</td>
        <td>${escapeHtml(m.type || "—")}</td>
        <td>${escapeHtml(m.to || "—")}</td>
        <td>${escapeHtml(m.subject || "—")}</td>
      </tr>`;
    })
    .join("");

  if (!items.length) {
    return `
      <section class="card">
        <h3>No leads yet</h3>
        <p class="muted">When someone fills the contact or newsletter form on the website, it will appear here and also email <strong>${escapeHtml(state.notifyEmail)}</strong>.</p>
      </section>
      <section class="card">
        <h3>Website emails (backend tally)</h3>
        <p style="margin:0 0 .75rem;line-height:1.6">
          Attempted: <strong>${escapeHtml(String(stats.attempted || 0))}</strong> ·
          Sent: <strong>${escapeHtml(String(stats.sent || 0))}</strong> ·
          Failed: <strong>${escapeHtml(String(stats.failed || 0))}</strong>
        </p>
        <p class="muted">Every notification email the website sends is counted here automatically.</p>
      </section>`;
  }
  const rows = items
    .map((item) => {
      const status = item.status || "new";
      const when = item.createdAt ? new Date(item.createdAt).toLocaleString() : "—";
      const mailBadge =
        item.emailed === true
          ? `<span class="lead-status status-replied">email sent</span>`
          : item.emailed === false
            ? `<span class="lead-status status-archived">email failed</span>`
            : "";
      return `
      <article class="lead-card ${status === "new" ? "is-new" : ""}">
        <div class="lead-card-head">
          <div>
            <strong>${escapeHtml(item.name || "—")}</strong>
            <span class="lead-meta">${escapeHtml(item.source || "contact")} · ${escapeHtml(when)}</span>
          </div>
          <div style="display:flex;gap:.35rem;flex-wrap:wrap;justify-content:flex-end">
            <span class="lead-status status-${escapeHtml(status)}">${escapeHtml(status)}</span>
            ${mailBadge}
          </div>
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
      <h3>Inbox · ${items.length} total${newCount ? ` · ${newCount} new` : ""} · ${emailedCount} emailed</h3>
      <p class="muted">Notifications go to <strong>${escapeHtml(state.notifyEmail)}</strong>. Lead data is private (not on the public website).</p>
    </section>
    <section class="card">
      <h3>Website emails (backend tally)</h3>
      <p style="margin:0 0 .75rem;line-height:1.6">
        Attempted: <strong>${escapeHtml(String(stats.attempted || 0))}</strong> ·
        Sent: <strong>${escapeHtml(String(stats.sent || 0))}</strong> ·
        Failed: <strong>${escapeHtml(String(stats.failed || 0))}</strong>
      </p>
      <p class="muted" style="margin:0 0 .75rem">Every mail the website sends (lead alerts, etc.) is logged and counted automatically.</p>
      ${
        recentRows
          ? `<div style="overflow:auto"><table class="data-table" style="width:100%;border-collapse:collapse;font-size:.86rem">
              <thead><tr><th align="left">When</th><th align="left">Status</th><th align="left">Type</th><th align="left">To</th><th align="left">Subject</th></tr></thead>
              <tbody>${recentRows}</tbody>
            </table></div>`
          : `<p class="muted">No outbound emails logged yet.</p>`
      }
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
      ${imageField("Brand logo (header)", "logoImage", d.logoImage || "", "logo")}
      ${field("Website", "website", d.website)}
      ${field("Phone", "phone", d.phone)}
      ${field("Phone href", "phoneHref", d.phoneHref)}
      ${field("WhatsApp", "whatsapp", d.whatsapp)}
      ${field("WhatsApp href", "whatsappHref", d.whatsappHref)}
      ${field("Email", "email", d.email)}
      ${field("Email href", "emailHref", d.emailHref)}
      ${field("Client login URL", "clientLogin", d.clientLogin)}
      ${field("Announcement bar", "announcement", d.announcement, "textarea")}
      ${imageField("Social share image (Open Graph)", "ogImage", d.ogImage || "", "og")}
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
      ${field("Get Directions URL (opens Google Maps app)", "googleMaps.directionsUrl", d.googleMaps?.directionsUrl || "", "textarea")}
      ${field("Maps embed URL", "googleMaps.embedUrl", d.googleMaps?.embedUrl || "", "textarea")}
      ${field("Latitude", "googleMaps.lat", d.googleMaps?.lat ?? "")}
      ${field("Longitude", "googleMaps.lng", d.googleMaps?.lng ?? "")}
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
      ${imageField("Hero visual image / vector", "hero.image", d.hero?.image || "", "hero")}
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
    image: "",
    coverImage: "",
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
          ${imageField("Card / listing image", `items.${i}.image`, item.image || "", "card")}
          ${imageField("Detail page cover", `items.${i}.coverImage`, item.coverImage || "", "cover")}
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

function renderChatbot(d) {
  const faqs = Array.isArray(d.faqs) ? d.faqs : [];
  const facts = Array.isArray(d.facts) ? d.facts : [];
  const prompts = Array.isArray(d.suggestedPrompts) ? d.suggestedPrompts : [];
  const faqRows = faqs
    .map(
      (f, i) => `
      <div class="list-item">
        <div class="list-item-head">
          <strong>FAQ ${i + 1}</strong>
          <button type="button" class="btn btn-ghost" data-action="del-chat-faq" data-index="${i}">Delete</button>
        </div>
        <div class="grid">
          ${field("Question", `faqs.${i}.q`, f.q || "", "textarea")}
          ${field("Answer", `faqs.${i}.a`, f.a || "", "textarea")}
        </div>
      </div>`,
    )
    .join("");

  return `
  ${card(
    "Chatbot settings",
    `
    <p class="hint field full">
      The website chat bubble answers from your live site content (company, services, packages, industries, case studies)
      plus the facts and FAQs you add here. Save to publish instantly.
    </p>
    <div class="field"><label>Enabled</label>
      <input type="checkbox" data-path="enabled" ${d.enabled !== false ? "checked" : ""} />
    </div>
    ${field("Bot name", "botName", d.botName || "DA Assist")}
    ${field("Welcome message", "welcomeMessage", d.welcomeMessage || "", "textarea")}
    ${field("Input placeholder", "placeholder", d.placeholder || "")}
    ${field("Fallback message (when unknown)", "fallbackMessage", d.fallbackMessage || "", "textarea")}
    ${field("Handoff button label", "handoffLabel", d.handoffLabel || "Talk to a human")}
    ${field("Handoff link", "handoffHref", d.handoffHref || "/contact")}
  `,
  )}
  <div class="card">
    <div class="list-item-head">
      <h3>Suggested prompts</h3>
    </div>
    <div class="field full"><label>One prompt per line</label>
      <textarea data-path="suggestedPrompts" data-array="true">${escapeHtml(prompts.join("\n"))}</textarea>
    </div>
  </div>
  <div class="card">
    <div class="list-item-head">
      <h3>Business details / facts the bot should know</h3>
    </div>
    <p class="hint">One fact per line. Add pricing notes, offers, process details, policies — anything not already on service pages.</p>
    <div class="field full"><label>Facts</label>
      <textarea data-path="facts" data-array="true" rows="10">${escapeHtml(facts.join("\n"))}</textarea>
    </div>
  </div>
  <div class="card">
    <div class="list-item-head">
      <h3>Custom FAQs</h3>
      <button type="button" class="btn btn-gold" data-action="add-chat-faq">Add FAQ</button>
    </div>
    ${faqRows || "<p class='empty'>No custom FAQs yet.</p>"}
  </div>`;
}

function formatBytes(n) {
  const bytes = Number(n) || 0;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

function renderCatalogue(d) {
  const hasPdf = Boolean(d.pdfUrl);
  const uploaded = d.uploadedAt ? new Date(d.uploadedAt).toLocaleString() : "—";
  return `
  ${card(
    "Catalogue PDF",
    `
    <p class="hint field full">
      Upload the DisplayAvenue company catalogue (PDF). It appears on the public
      <a href="/catalogue" target="_blank" rel="noreferrer"><code>/catalogue</code></a> page for visitors to view and download.
      Max size 30&nbsp;MB. Replacing the file removes the previous PDF.
    </p>
    <div class="field"><label>Show on website</label>
      <input type="checkbox" data-path="enabled" ${d.enabled !== false ? "checked" : ""} />
    </div>
    <div class="list-item" style="margin-top:1rem">
      <div class="list-item-head">
        <strong>${hasPdf ? "Current PDF" : "No PDF uploaded yet"}</strong>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap">
          <button type="button" class="btn btn-gold" data-action="pick-catalogue">${hasPdf ? "Replace PDF" : "Upload PDF"}</button>
          ${hasPdf ? `<button type="button" class="btn btn-ghost" data-action="remove-catalogue">Remove</button>` : ""}
        </div>
      </div>
      <input type="file" id="catalogue-pdf" accept="application/pdf,.pdf" hidden />
      ${
        hasPdf
          ? `<p style="margin:.5rem 0 0;line-height:1.6;font-size:.92rem">
              File: <strong>${escapeHtml(d.fileName || "catalogue.pdf")}</strong><br />
              Size: ${escapeHtml(formatBytes(d.fileSize))}<br />
              Uploaded: ${escapeHtml(uploaded)}<br />
              Public URL: <a href="${escapeAttr(d.pdfUrl)}" target="_blank" rel="noreferrer">${escapeHtml(d.pdfUrl)}</a>
            </p>
            <p style="margin:.75rem 0 0">
              <a class="btn btn-ghost" href="${escapeAttr(d.pdfUrl)}" target="_blank" rel="noreferrer">Open PDF</a>
              <a class="btn btn-ghost" href="/catalogue" target="_blank" rel="noreferrer">View catalogue page</a>
            </p>`
          : `<p class="muted" style="margin:.5rem 0 0">Choose a PDF from your computer to publish the catalogue.</p>`
      }
    </div>
  `,
  )}
  ${card(
    "Page copy",
    `
    ${field("Page title", "title", d.title || "DisplayAvenue Catalogue")}
    ${field("Eyebrow", "eyebrow", d.eyebrow || "Company Catalogue")}
    ${field("Headline", "headline", d.headline || "")}
    ${field("Summary", "summary", d.summary || "", "textarea")}
    ${field("Download button label", "ctaLabel", d.ctaLabel || "Download PDF")}
    ${field("Secondary CTA label", "secondaryCtaLabel", d.secondaryCtaLabel || "Request a proposal")}
    ${field("Secondary CTA link", "secondaryCtaHref", d.secondaryCtaHref || "/contact")}
    <p class="hint" style="margin-top:.75rem">After editing copy, click <strong>Save changes</strong>. PDF upload/remove saves automatically.</p>
  `,
  )}`;
}

async function uploadCataloguePdf(input) {
  const file = input?.files?.[0];
  if (!file) return;
  if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
    toast("Please choose a PDF file", "err");
    input.value = "";
    return;
  }
  const fd = new FormData();
  fd.append("file", file);
  try {
    toast("Uploading catalogue PDF…");
    const res = await fetch(`${API}?action=upload-catalogue`, {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const json = await res.json().catch(() => ({ ok: false, error: "Invalid response" }));
    if (!res.ok || json.ok === false) throw new Error(json.error || "Upload failed");
    state.data = json.data || state.data;
    setDirty(false);
    renderEditor();
    toast(json.message || "Catalogue PDF uploaded");
  } catch (e) {
    toast(e.message || "Upload failed", "err");
  } finally {
    if (input) input.value = "";
  }
}

async function removeCataloguePdf() {
  if (!confirm("Remove the catalogue PDF from the website?")) return;
  try {
    const res = await api("remove-catalogue", {});
    state.data = res.data || state.data;
    setDirty(false);
    renderEditor();
    toast("Catalogue PDF removed");
  } catch (e) {
    toast(e.message || "Could not remove PDF", "err");
  }
}

function blankShopProduct() {
  const slug = `product-${Date.now().toString(36)}`;
  return {
    id: slug,
    slug,
    title: "New product",
    summary: "Short product summary for the shop grid.",
    description: "Full product description shown on the product page.",
    price: 999,
    compareAtPrice: 0,
    category: "General",
    image: "",
    features: ["Feature one", "Feature two"],
    enabled: true,
    featured: false,
  };
}

function renderShop(d) {
  const products = Array.isArray(d.products) ? d.products : [];
  const orders = Array.isArray(state.shopOrders?.items) ? state.shopOrders.items : [];
  const productRows = products
    .map((p, i) => {
      const features = Array.isArray(p.features) ? p.features : [];
      return `
      <div class="list-item">
        <div class="list-item-head">
          <strong>${escapeHtml(p.title || `Product ${i + 1}`)}</strong>
          <button type="button" class="btn btn-ghost" data-action="del-shop-product" data-index="${i}">Delete</button>
        </div>
        <div class="grid">
          ${field("Title", `products.${i}.title`, p.title || "")}
          ${field("Slug / URL id", `products.${i}.slug`, p.slug || p.id || "")}
          ${field("Price (INR)", `products.${i}.price`, p.price ?? 0, "number")}
          ${field("Compare-at price (optional)", `products.${i}.compareAtPrice`, p.compareAtPrice ?? 0, "number")}
          ${field("Category", `products.${i}.category`, p.category || "")}
          ${imageField("Product image", `products.${i}.image`, p.image || "", "product")}
          ${field("Short summary", `products.${i}.summary`, p.summary || "", "textarea")}
          ${field("Full description", `products.${i}.description`, p.description || "", "textarea")}
          <div class="field full"><label>Features (one per line)</label>
            <textarea data-path="products.${i}.features" data-array="true">${escapeHtml(features.join("\n"))}</textarea>
          </div>
          <div class="field"><label>Enabled (show in shop)</label>
            <input type="checkbox" data-path="products.${i}.enabled" ${p.enabled !== false ? "checked" : ""} />
          </div>
          <div class="field"><label>Featured</label>
            <input type="checkbox" data-path="products.${i}.featured" ${p.featured ? "checked" : ""} />
          </div>
        </div>
        <p class="muted" style="margin:.5rem 0 0;font-size:.85rem">
          Public page: <a href="/shop/${escapeAttr(p.slug || p.id || "")}" target="_blank" rel="noreferrer">/shop/${escapeHtml(p.slug || p.id || "")}</a>
        </p>
      </div>`;
    })
    .join("");

  const orderRows = orders
    .slice(0, 40)
    .map((o) => {
      const when = o.createdAt ? new Date(o.createdAt).toLocaleString() : "—";
      const cust = o.customer || {};
      const status = o.status || "created";
      return `
      <article class="lead-card ${status === "paid" ? "is-new" : ""}">
        <div class="lead-card-head">
          <div>
            <strong>${escapeHtml(o.productTitle || o.productId || "Product")}</strong>
            <span class="lead-meta">${escapeHtml(status)} · ₹${escapeHtml(String(o.amountInr ?? ""))} · ${escapeHtml(when)}</span>
          </div>
          <span class="lead-status status-${escapeHtml(status === "paid" ? "replied" : status === "created" ? "new" : "archived")}">${escapeHtml(status)}</span>
        </div>
        <div class="lead-body">
          <p>${escapeHtml(cust.name || "—")} · <a href="mailto:${escapeAttr(cust.email || "")}">${escapeHtml(cust.email || "—")}</a>
            ${cust.phone ? ` · ${escapeHtml(cust.phone)}` : ""}</p>
          <p class="lead-meta">Qty ${escapeHtml(String(o.quantity || 1))} · Order ${escapeHtml(o.id || "")}
            ${o.razorpayPaymentId ? ` · Pay ${escapeHtml(o.razorpayPaymentId)}` : ""}</p>
        </div>
        <div class="lead-actions">
          ${status !== "fulfilled" ? `<button type="button" class="btn btn-ghost btn-sm" data-shop-order-action="fulfill" data-id="${escapeAttr(o.id || "")}">Mark fulfilled</button>` : ""}
          ${status !== "paid" && status !== "fulfilled" ? `<button type="button" class="btn btn-ghost btn-sm" data-shop-order-action="paid" data-id="${escapeAttr(o.id || "")}">Mark paid</button>` : ""}
          <button type="button" class="btn btn-danger btn-sm" data-shop-order-action="delete" data-id="${escapeAttr(o.id || "")}">Delete</button>
        </div>
      </article>`;
    })
    .join("");

  return `
  ${card(
    "Shop settings",
    `
    <p class="hint field full">
      Sell products on <a href="/shop" target="_blank" rel="noreferrer"><code>/shop</code></a>.
      Add products below, then <strong>Save changes</strong>. Checkout uses Razorpay
      (keys in <code>admin/config.php</code>: <code>razorpay_key_id</code> / <code>razorpay_key_secret</code>).
      Status: <strong>${state.razorpayConfigured ? "Razorpay keys configured" : "Razorpay keys missing — add them before taking payments"}</strong>.
    </p>
    <div class="field"><label>Shop enabled</label>
      <input type="checkbox" data-path="enabled" ${d.enabled !== false ? "checked" : ""} />
    </div>
    ${field("Page title", "title", d.title || "Shop")}
    ${field("Eyebrow", "eyebrow", d.eyebrow || "Online Store")}
    ${field("Headline", "headline", d.headline || "")}
    ${field("Summary", "summary", d.summary || "", "textarea")}
    ${field("Currency code", "currency", d.currency || "INR")}
    ${field("Currency symbol", "currencySymbol", d.currencySymbol || "₹")}
    ${field("Success message after payment", "successMessage", d.successMessage || "", "textarea")}
  `,
  )}
  <div class="card">
    <div class="list-item-head">
      <h3>Products (${products.length})</h3>
      <button type="button" class="btn btn-gold" data-action="add-shop-product">Add product</button>
    </div>
    ${productRows || "<p class='empty'>No products yet. Click Add product.</p>"}
  </div>
  <div class="card">
    <div class="list-item-head">
      <h3>Orders (${orders.length})</h3>
    </div>
    <p class="muted" style="margin:0 0 .75rem">Paid orders appear here after Razorpay checkout. Notifications also email <strong>${escapeHtml(state.notifyEmail)}</strong>.</p>
    ${orderRows || "<p class='empty'>No orders yet.</p>"}
  </div>`;
}

async function handleShopOrderAction(action, id) {
  try {
    if (action === "delete") {
      if (!confirm("Delete this order permanently?")) return;
      const json = await api("shop-order-delete", { id });
      state.shopOrders = json.orders || { items: [] };
    } else {
      const statusMap = { fulfill: "fulfilled", paid: "paid" };
      const status = statusMap[action];
      if (!status) return;
      const json = await api("shop-order-update", { id, status });
      state.shopOrders = json.orders || { items: [] };
    }
    renderEditor();
    toast("Order updated");
  } catch (e) {
    toast(e.message || "Order update failed", "err");
  }
}

function blankLandingPackage() {
  const id = `pkg-${Date.now().toString(36)}`;
  return {
    id,
    name: "New package",
    price: 9999,
    compareAtPrice: 0,
    features: ["Feature one", "Feature two"],
    highlighted: false,
    ctaLabel: "Buy now",
    razorpayEnabled: true,
  };
}

function blankLanding() {
  const slug = `landing-${Date.now().toString(36)}`;
  return {
    slug,
    enabled: true,
    name: "New ads landing page",
    channel: "google",
    seoTitle: "",
    seoDescription: "",
    eyebrow: "Special offer",
    headline: "Your headline for Google or Meta ads",
    subheadline: "Supporting line that explains the offer and next step.",
    heroImage: "",
    primaryCta: "Get started",
    showPhone: true,
    showWhatsapp: true,
    trustBadges: ["Trusted by growing brands", "Fast response"],
    benefits: [
      { title: "Benefit one", desc: "Short explanation." },
      { title: "Benefit two", desc: "Short explanation." },
    ],
    bullets: ["Bullet one", "Bullet two", "Bullet three"],
    formTitle: "Get a free consultation",
    formSubtitle: "We reply within one business day.",
    formButton: "Submit",
    thankYouMessage: "Thanks! We will contact you shortly.",
    showForm: true,
    packagesTitle: "Choose a package",
    packages: [blankLandingPackage()],
    faqs: [{ q: "How does this work?", a: "Submit the form or buy a package online." }],
    googleAds: { conversionId: "", conversionLabel: "" },
    metaAds: { pixelEvent: "Lead", contentName: "" },
    utmCampaign: slug,
    utmSource: "google",
    utmMedium: "cpc",
    footerNote: "DisplayAvenue · info@displayavenue.com · +91 9222 122333",
  };
}

function renderLandings(d) {
  const items = Array.isArray(d.items) ? d.items : [];
  const rows = items
    .map((lp, i) => {
      const benefits = Array.isArray(lp.benefits) ? lp.benefits : [];
      const packages = Array.isArray(lp.packages) ? lp.packages : [];
      const faqs = Array.isArray(lp.faqs) ? lp.faqs : [];
      const badges = Array.isArray(lp.trustBadges) ? lp.trustBadges : [];
      const bullets = Array.isArray(lp.bullets) ? lp.bullets : [];
      const benefitRows = benefits
        .map(
          (b, bi) => `
          <div class="grid">
            ${field("Benefit title", `items.${i}.benefits.${bi}.title`, b.title || "")}
            ${field("Benefit description", `items.${i}.benefits.${bi}.desc`, b.desc || "", "textarea")}
          </div>`,
        )
        .join("");
      const packageRows = packages
        .map((p, pi) => {
          const feats = Array.isArray(p.features) ? p.features : [];
          return `
          <div class="list-item">
            <div class="list-item-head">
              <strong>Package ${pi + 1}: ${escapeHtml(p.name || "")}</strong>
              <button type="button" class="btn btn-ghost" data-action="del-landing-package" data-index="${i}:${pi}">Delete package</button>
            </div>
            <div class="grid">
              ${field("Package id", `items.${i}.packages.${pi}.id`, p.id || "")}
              ${field("Name", `items.${i}.packages.${pi}.name`, p.name || "")}
              ${field("Price (INR)", `items.${i}.packages.${pi}.price`, p.price ?? 0, "number")}
              ${field("Compare-at price", `items.${i}.packages.${pi}.compareAtPrice`, p.compareAtPrice ?? 0, "number")}
              ${field("CTA button label", `items.${i}.packages.${pi}.ctaLabel`, p.ctaLabel || "Buy now")}
              <div class="field full"><label>Features (one per line)</label>
                <textarea data-path="items.${i}.packages.${pi}.features" data-array="true">${escapeHtml(feats.join("\n"))}</textarea>
              </div>
              <div class="field"><label>Highlighted package</label>
                <input type="checkbox" data-path="items.${i}.packages.${pi}.highlighted" ${p.highlighted ? "checked" : ""} />
              </div>
              <div class="field"><label>Razorpay enabled</label>
                <input type="checkbox" data-path="items.${i}.packages.${pi}.razorpayEnabled" ${p.razorpayEnabled !== false ? "checked" : ""} />
              </div>
            </div>
          </div>`;
        })
        .join("");
      const faqRows = faqs
        .map(
          (f, fi) => `
          <div class="grid">
            ${field("FAQ question", `items.${i}.faqs.${fi}.q`, f.q || "")}
            ${field("FAQ answer", `items.${i}.faqs.${fi}.a`, f.a || "", "textarea")}
          </div>`,
        )
        .join("");

      return `
      <div class="list-item">
        <div class="list-item-head">
          <strong>${escapeHtml(lp.name || lp.slug || `Landing ${i + 1}`)}</strong>
          <button type="button" class="btn btn-ghost" data-action="del-landing" data-index="${i}">Delete</button>
        </div>
        <p class="muted" style="margin:0 0 .75rem">
          Public URL:
          <a href="/lp/${escapeAttr(lp.slug || "")}" target="_blank" rel="noreferrer">
            https://displayavenue.com/lp/${escapeHtml(lp.slug || "")}
          </a>
          · Use this URL in Google Ads / Meta Ads.
        </p>
        <div class="grid">
          <div class="field"><label>Enabled</label>
            <input type="checkbox" data-path="items.${i}.enabled" ${lp.enabled !== false ? "checked" : ""} />
          </div>
          ${field("Internal name", `items.${i}.name`, lp.name || "")}
          ${field("URL slug", `items.${i}.slug`, lp.slug || "")}
          ${field("Channel (google / meta / both)", `items.${i}.channel`, lp.channel || "google")}
          ${field("SEO title", `items.${i}.seoTitle`, lp.seoTitle || "")}
          ${field("SEO description", `items.${i}.seoDescription`, lp.seoDescription || "", "textarea")}
          ${field("Eyebrow", `items.${i}.eyebrow`, lp.eyebrow || "")}
          ${field("Headline", `items.${i}.headline`, lp.headline || "")}
          ${field("Subheadline", `items.${i}.subheadline`, lp.subheadline || "", "textarea")}
          ${imageField("Hero image / vector", `items.${i}.heroImage`, lp.heroImage || "", "hero")}
          ${field("Primary CTA label", `items.${i}.primaryCta`, lp.primaryCta || "")}
          <div class="field"><label>Show phone CTA</label>
            <input type="checkbox" data-path="items.${i}.showPhone" ${lp.showPhone !== false ? "checked" : ""} />
          </div>
          <div class="field"><label>Show WhatsApp CTA</label>
            <input type="checkbox" data-path="items.${i}.showWhatsapp" ${lp.showWhatsapp !== false ? "checked" : ""} />
          </div>
          <div class="field full"><label>Trust badges (one per line)</label>
            <textarea data-path="items.${i}.trustBadges" data-array="true">${escapeHtml(badges.join("\n"))}</textarea>
          </div>
          <div class="field full"><label>Bullet points (one per line)</label>
            <textarea data-path="items.${i}.bullets" data-array="true">${escapeHtml(bullets.join("\n"))}</textarea>
          </div>
        </div>

        <h4 style="margin:1rem 0 .5rem">Lead form</h4>
        <div class="grid">
          <div class="field"><label>Show lead form</label>
            <input type="checkbox" data-path="items.${i}.showForm" ${lp.showForm !== false ? "checked" : ""} />
          </div>
          ${field("Form title", `items.${i}.formTitle`, lp.formTitle || "")}
          ${field("Form subtitle", `items.${i}.formSubtitle`, lp.formSubtitle || "")}
          ${field("Form button", `items.${i}.formButton`, lp.formButton || "Submit")}
          ${field("Thank-you message", `items.${i}.thankYouMessage`, lp.thankYouMessage || "", "textarea")}
        </div>

        <div class="list-item-head" style="margin-top:1rem">
          <h4 style="margin:0">Benefits</h4>
          <button type="button" class="btn btn-gold" data-action="add-landing-benefit" data-index="${i}">Add benefit</button>
        </div>
        ${benefitRows || "<p class='empty'>No benefits yet.</p>"}

        <div class="list-item-head" style="margin-top:1rem">
          <h4 style="margin:0">Packages (with Razorpay)</h4>
          <button type="button" class="btn btn-gold" data-action="add-landing-package" data-index="${i}">Add package</button>
        </div>
        ${field("Packages section title", `items.${i}.packagesTitle`, lp.packagesTitle || "Choose a package")}
        ${packageRows || "<p class='empty'>No packages yet.</p>"}

        <div class="list-item-head" style="margin-top:1rem">
          <h4 style="margin:0">FAQs</h4>
          <button type="button" class="btn btn-gold" data-action="add-landing-faq" data-index="${i}">Add FAQ</button>
        </div>
        ${faqRows || "<p class='empty'>No FAQs yet.</p>"}

        <h4 style="margin:1rem 0 .5rem">Google Ads</h4>
        <div class="grid">
          ${field("Conversion ID (AW-…)", `items.${i}.googleAds.conversionId`, lp.googleAds?.conversionId || "")}
          ${field("Conversion label", `items.${i}.googleAds.conversionLabel`, lp.googleAds?.conversionLabel || "")}
          ${field("Default utm_source", `items.${i}.utmSource`, lp.utmSource || "google")}
          ${field("Default utm_medium", `items.${i}.utmMedium`, lp.utmMedium || "cpc")}
          ${field("Default utm_campaign", `items.${i}.utmCampaign`, lp.utmCampaign || "")}
        </div>

        <h4 style="margin:1rem 0 .5rem">Meta Ads</h4>
        <div class="grid">
          ${field("Pixel event name (Lead / CompleteRegistration…)", `items.${i}.metaAds.pixelEvent`, lp.metaAds?.pixelEvent || "Lead")}
          ${field("Content name", `items.${i}.metaAds.contentName`, lp.metaAds?.contentName || "")}
        </div>

        ${field("Footer note", `items.${i}.footerNote`, lp.footerNote || "", "textarea")}
      </div>`;
    })
    .join("");

  return `
  <div class="card">
    <div class="list-item-head">
      <h3>Ads landing pages (${items.length})</h3>
      <button type="button" class="btn btn-gold" data-action="add-landing">Add landing page</button>
    </div>
    <p class="hint">
      Create dedicated pages for Google Ads and Meta Ads. Each page has offer copy, lead form,
      priced packages with Razorpay, and conversion fields. Public URLs look like
      <code>/lp/your-slug</code>. Site-wide GTM/GA/Meta Pixel still come from <strong>Tracking &amp; Pixels</strong>.
    </p>
    ${rows || "<p class='empty'>No landing pages yet. Click Add landing page.</p>"}
  </div>`;
}

function renderSettings(d) {
  const cleared = d.cacheClearedAt
    ? new Date(d.cacheClearedAt).toLocaleString()
    : "Never";
  const seoAt = d.seoSyncedAt ? new Date(d.seoSyncedAt).toLocaleString() : "Never";
  const sitemapUrl = d.sitemapUrl || "https://displayavenue.com/sitemap.xml";
  const urlCount = d.sitemapUrlCount ?? "—";
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
    <h3>Auto sitemap (SEO)</h3>
    <p style="color:var(--muted);font-size:.92rem;line-height:1.55;margin:0 0 .75rem">
      The live sitemap at <a href="${escapeAttr(sitemapUrl)}" target="_blank" rel="noreferrer"><code>/sitemap.xml</code></a>
      rebuilds automatically from CMS content whenever you <strong>Save</strong> any section.
      Submit this URL in Google Search Console and Bing Webmaster Tools.
    </p>
    <p style="font-size:.85rem;margin:0 0 1rem;line-height:1.6">
      Auto sitemap: <strong>${d.autoSitemap === false ? "Off" : "On"}</strong><br />
      Indexed URLs: <strong>${escapeHtml(String(urlCount))}</strong><br />
      Last regenerated: <strong>${escapeHtml(seoAt)}</strong><br />
      Public URL: <a href="${escapeAttr(sitemapUrl)}" target="_blank" rel="noreferrer">${escapeHtml(sitemapUrl)}</a>
    </p>
    <div style="display:flex;flex-wrap:wrap;gap:.5rem">
      <button type="button" class="btn btn-gold" data-action="sync-seo">Regenerate sitemap now</button>
      <a class="btn btn-ghost" href="${escapeAttr(sitemapUrl)}" target="_blank" rel="noreferrer">Open sitemap ↗</a>
      <a class="btn btn-ghost" href="/robots.txt" target="_blank" rel="noreferrer">Open robots.txt ↗</a>
    </div>
  </div>
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

  if (action === "pick-catalogue") {
    document.getElementById("catalogue-pdf")?.click();
    return;
  }
  if (action === "remove-catalogue") {
    void removeCataloguePdf();
    return;
  }
  if (action === "add-shop-product") {
    d.products = d.products || [];
    d.products.unshift(blankShopProduct());
    setDirty(true);
    renderEditor();
    return;
  }
  if (action === "del-shop-product") {
    if (!confirm("Delete this product?")) return;
    d.products.splice(i, 1);
    setDirty(true);
    renderEditor();
    return;
  }
  if (action === "add-landing") {
    d.items = d.items || [];
    d.items.unshift(blankLanding());
    setDirty(true);
    renderEditor();
    return;
  }
  if (action === "del-landing") {
    if (!confirm("Delete this landing page?")) return;
    d.items.splice(i, 1);
    setDirty(true);
    renderEditor();
    return;
  }
  if (action === "add-landing-benefit") {
    const item = d.items[i];
    item.benefits = item.benefits || [];
    item.benefits.push({ title: "New benefit", desc: "" });
    setDirty(true);
    renderEditor();
    return;
  }
  if (action === "add-landing-package") {
    const item = d.items[i];
    item.packages = item.packages || [];
    item.packages.push(blankLandingPackage());
    setDirty(true);
    renderEditor();
    return;
  }
  if (action === "del-landing-package") {
    const parts = String(index || "").split(":");
    const li = Number(parts[0]);
    const pi = Number(parts[1]);
    if (!confirm("Delete this package?")) return;
    d.items[li]?.packages?.splice(pi, 1);
    setDirty(true);
    renderEditor();
    return;
  }
  if (action === "add-landing-faq") {
    const item = d.items[i];
    item.faqs = item.faqs || [];
    item.faqs.push({ q: "New question?", a: "" });
    setDirty(true);
    renderEditor();
    return;
  }

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
  } else if (action === "sync-seo") {
    regenerateSitemap();
    return;
  } else if (action === "add-chat-faq") {
    d.faqs = d.faqs || [];
    d.faqs.push({ q: "New question?", a: "Write the answer the bot should give." });
  } else if (action === "del-chat-faq") {
    (d.faqs || []).splice(i, 1);
  } else return;

  if (d.navItems) {
    d.navItems.forEach((n) => {
      if (n.mega === "false" || n.mega === "") n.mega = false;
    });
  }

  setDirty(true);
  renderEditor();
}

async function regenerateSitemap() {
  try {
    const res = await api("sync-seo", {});
    const count = res.seo?.urlCount ?? res.urlCount ?? "?";
    toast(`Sitemap regenerated — ${count} URLs`);
    if (state.current === "settings") {
      await openCollection("settings");
    }
  } catch (e) {
    toast(e.message || "Could not regenerate sitemap", "err");
  }
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
  if (state.current === "shop" && Array.isArray(state.data.products)) {
    state.data.products.forEach((p) => {
      const slug = String(p.slug || p.id || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      p.slug = slug || `product-${Date.now().toString(36)}`;
      p.id = p.id || p.slug;
      p.price = Number(p.price) || 0;
      p.compareAtPrice = Number(p.compareAtPrice) || 0;
      if (!Array.isArray(p.features)) {
        p.features = String(p.features || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    });
  }
  if (state.current === "landings" && Array.isArray(state.data.items)) {
    state.data.items.forEach((lp) => {
      const slug = String(lp.slug || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      lp.slug = slug || `landing-${Date.now().toString(36)}`;
      if (!Array.isArray(lp.trustBadges)) {
        lp.trustBadges = String(lp.trustBadges || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (!Array.isArray(lp.bullets)) {
        lp.bullets = String(lp.bullets || "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (!Array.isArray(lp.packages)) lp.packages = [];
      lp.packages.forEach((p) => {
        p.id = String(p.id || p.name || "package")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        p.price = Number(p.price) || 0;
        p.compareAtPrice = Number(p.compareAtPrice) || 0;
        if (!Array.isArray(p.features)) {
          p.features = String(p.features || "")
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      });
    });
  }
  try {
    await api("save", { collection: state.current, data: state.data });
    setDirty(false);
    toast("Saved - sitemap auto-updated. Refresh the website to see changes");
  } catch (e) {
    toast(e.message, "err");
  }
}

function applyStatus(status) {
  state.collections = status.collections || {};
  state.newLeads = status.newLeads || 0;
  if (status.notifyEmail) state.notifyEmail = status.notifyEmail;
  if (status.mailStats) state.mailStats = { ...state.mailStats, ...status.mailStats };
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
  $("#sync-seo-btn").onclick = () => regenerateSitemap();

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

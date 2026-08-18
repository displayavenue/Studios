const API = "./api.php";
const QUOTES_API = "./quotes/api.php";
const TOKEN_KEY = "da_agency_admin_token";
/** Quotations run on Hostinger (PHP + MariaDB) — no Vercel. */
const QUOTE_NAV = {
  livechat: "Live Chat",
  automation: "Lead Automation",
  quotations: "Quotations & Payments",
  invoices: "Create Invoice",
};

const state = {
  authed: false,
  token: localStorage.getItem(TOKEN_KEY) || "",
  collections: {},
  current: null,
  data: null,
  dirty: false,
  quoteMode: false,
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
    combos: "/industry-solutions",
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
  if (show) setMobileNav(false);
}

function setMobileNav(open) {
  document.body.classList.toggle("nav-open", !!open);
  const backdrop = $("#nav-backdrop");
  const toggle = $("#nav-toggle");
  if (backdrop) backdrop.hidden = !open;
  if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
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

/** Image URL field + WebP upload button (folder: awards|certs|heroes|uploads|reviews|root) */
function imageField(label, path, value, folder = "uploads") {
  const id = path.replace(/[^a-z0-9]/gi, "_");
  const preview = value
    ? `<img class="img-upload__preview" src="${escapeAttr(value)}" alt="" loading="lazy" />`
    : `<div class="img-upload__preview img-upload__preview--empty">No image</div>`;
  return `
    <div class="field full img-upload" data-image-field="${escapeAttr(path)}" data-folder="${escapeAttr(folder)}">
      <label for="${id}">${label} <span class="hint" style="display:inline;margin:0">(saved as WebP)</span></label>
      <div class="img-upload__row">
        ${preview}
        <div class="img-upload__controls">
          <input type="text" data-path="${path}" id="${id}" value="${escapeAttr(value ?? "")}" placeholder="/images/..." />
          <div class="img-upload__actions">
            <input type="file" class="img-upload__file" accept="image/jpeg,image/png,image/gif,image/webp,.jpg,.jpeg,.png,.gif,.webp" />
            <button type="button" class="btn btn-gold img-upload__btn">Upload → WebP</button>
          </div>
        </div>
      </div>
    </div>`;
}

async function uploadImageFile(file, folder) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder || "uploads");
  const headers = {};
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
    headers["X-DA-Admin-Token"] = state.token;
  }
  const res = await fetch(
    `${API}?action=upload-image&folder=${encodeURIComponent(folder || "uploads")}`,
    { method: "POST", credentials: "include", headers, body: fd },
  );
  const json = await res.json().catch(() => ({ ok: false, error: "Invalid response" }));
  if (res.status === 401 || json.code === "auth") {
    state.authed = false;
    state.token = "";
    localStorage.removeItem(TOKEN_KEY);
    showLogin(true);
    throw new Error(json.error || "Please log in again");
  }
  if (!res.ok || json.ok === false) {
    throw new Error(json.error || "Upload failed");
  }
  return json;
}

function bindImageUploads(root = $("#editor-wrap")) {
  root.querySelectorAll("[data-image-field]").forEach((wrap) => {
    const path = wrap.getAttribute("data-image-field");
    const folder = wrap.getAttribute("data-folder") || "uploads";
    const btn = wrap.querySelector(".img-upload__btn");
    const fileInput = wrap.querySelector(".img-upload__file");
    const urlInput = wrap.querySelector(`input[data-path="${path}"]`);
    if (!btn || !fileInput || !urlInput) return;
    btn.onclick = async () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) {
        toast("Choose an image first", "err");
        return;
      }
      btn.disabled = true;
      btn.textContent = "Converting…";
      try {
        const json = await uploadImageFile(file, folder);
        urlInput.value = json.url;
        setByPath(state.data, path, json.url);
        setDirty(true);
        const preview = wrap.querySelector(".img-upload__preview");
        if (preview) {
          if (preview.tagName === "IMG") {
            preview.src = json.url;
          } else {
            preview.outerHTML = `<img class="img-upload__preview" src="${escapeAttr(json.url)}" alt="" loading="lazy" />`;
          }
        }
        toast(json.message || "Uploaded as WebP");
        fileInput.value = "";
      } catch (e) {
        toast(e.message || "Upload failed", "err");
      } finally {
        btn.disabled = false;
        btn.textContent = "Upload → WebP";
      }
    };
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

function allNavEntries() {
  return {
    ...QUOTE_NAV,
    ...state.collections,
  };
}

function setQuoteWorkspace(on) {
  state.quoteMode = !!on;
  document.body.classList.toggle("quote-workspace", state.quoteMode);
  const saveBtn = $("#save-btn");
  const reloadBtn = $("#reload-btn");
  const previewBtn = $("#preview-btn");
  const hint = document.querySelector(".shortcut-hint");
  if (saveBtn) saveBtn.hidden = state.quoteMode;
  if (reloadBtn) reloadBtn.hidden = state.quoteMode;
  if (previewBtn) previewBtn.hidden = state.quoteMode;
  if (hint) hint.hidden = state.quoteMode;
}

function renderNav() {
  const nav = $("#nav");
  const entries = allNavEntries();
  nav.innerHTML = Object.entries(entries)
    .map(
      ([key, label]) =>
        `<button type="button" data-key="${key}" class="${
          state.current === key ? "active" : ""
        }${key === "quotations" || key === "invoices" || key === "livechat" || key === "automation" ? " nav-quote" : ""}">${escapeHtml(label)}</button>`,
    )
    .join("");
  nav.querySelectorAll("button").forEach((btn) => {
    btn.onclick = () => {
      setMobileNav(false);
      if (btn.dataset.key === "livechat") openLiveChat();
      else if (btn.dataset.key === "automation") openAutomation();
      else if (btn.dataset.key === "quotations") openQuotations();
      else if (btn.dataset.key === "invoices") openInvoices();
      else openCollection(btn.dataset.key);
    };
  });
}

function openLiveChat() {
  if (state.dirty) {
    const leave = confirm("You have unpublished edits. Leave without Update?");
    if (!leave) return;
  }
  state.current = "livechat";
  state.data = null;
  setDirty(false);
  setQuoteWorkspace(true);
  $("#panel-title").textContent = QUOTE_NAV.livechat;
  $("#panel-sub").textContent =
    "Reply to website visitors in real time. New chats also email info@displayavenue.com when mail() works.";
  renderNav();
  renderLiveChatInbox();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.querySelector(".main")?.scrollTo?.({ top: 0, behavior: "auto" });
}

async function openAutomation() {
  if (state.dirty) {
    const leave = confirm("You have unpublished edits. Leave without Update?");
    if (!leave) return;
  }
  state.current = "automation";
  state.data = null;
  setDirty(false);
  setQuoteWorkspace(true);
  $("#panel-title").textContent = QUOTE_NAV.automation;
  $("#panel-sub").textContent =
    "When someone fills Contact or becomes a hot chat lead, alert you on WhatsApp / SMS / email. Page journeys are stored automatically.";
  renderNav();
  await renderAutomationPanel();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.querySelector(".main")?.scrollTo?.({ top: 0, behavior: "auto" });
}

async function renderAutomationPanel() {
  const wrap = $("#editor-wrap");
  wrap.innerHTML = `<p class="hint">Loading automation…</p>`;
  try {
    const [cfg, logRes, visitRes] = await Promise.all([
      api("get-automation"),
      api("list-automation-log"),
      api("list-visits"),
    ]);
    const s = cfg.settings || {};
    const st = cfg.status || {};
    const log = logRes.log || [];
    const visits = visitRes.visits || [];
    const waBadge = st.whatsappReady
      ? `<span class="auto-badge ok">WhatsApp ready (${escapeHtml(st.whatsappProvider || "")})</span>`
      : `<span class="auto-badge warn">WhatsApp keys missing</span>`;
    const smsBadge = st.smsReady
      ? `<span class="auto-badge ok">SMS ready (${escapeHtml(st.smsProvider || "")})</span>`
      : `<span class="auto-badge muted">SMS off / not configured</span>`;
    const fileBadge = st.localFile
      ? `<span class="auto-badge ok">automation-local.php found</span>`
      : `<span class="auto-badge warn">Copy automation-local.example.php → automation-local.php on server</span>`;

    wrap.innerHTML = `
      <div class="automation-grid">
        <section class="card">
          <div class="list-item-head">
            <h3 style="margin:0">Alert channels</h3>
            <div class="auto-badges">${fileBadge}${waBadge}${smsBadge}</div>
          </div>
          <p class="hint">Toggles save to <code>content/automation.json</code>. API keys stay in <code>admin/automation-local.php</code> (not in git).</p>
          <label class="check-row"><input type="checkbox" id="auto-enabled" ${s.enabled ? "checked" : ""}/> Enable automation</label>
          <label class="check-row"><input type="checkbox" id="auto-email" ${s.channels?.email ? "checked" : ""}/> Email alerts</label>
          <label class="check-row"><input type="checkbox" id="auto-wa" ${s.channels?.whatsapp ? "checked" : ""}/> WhatsApp alerts</label>
          <label class="check-row"><input type="checkbox" id="auto-sms" ${s.channels?.sms ? "checked" : ""}/> SMS alerts</label>
          <label>Notify email<input id="auto-notify-email" type="email" value="${escapeAttr(s.notifyEmail || "")}"/></label>
          <label>Message prefix<input id="auto-prefix" type="text" value="${escapeAttr(s.messagePrefix || "")}"/></label>
          <label class="check-row"><input type="checkbox" id="auto-journey" ${s.includeJourney ? "checked" : ""}/> Include page journey in alerts</label>
          <h4>Trigger events</h4>
          <label class="check-row"><input type="checkbox" id="auto-ev-contact" ${s.events?.contactForm ? "checked" : ""}/> Contact form submissions</label>
          <label class="check-row"><input type="checkbox" id="auto-ev-chat" ${s.events?.chatHotLead ? "checked" : ""}/> Hot AI chat leads</label>
          <label class="check-row"><input type="checkbox" id="auto-ev-track" ${s.events?.trackPageviews ? "checked" : ""}/> Track page journeys sitewide</label>
          <div class="row-actions" style="margin-top:1rem;display:flex;gap:.5rem;flex-wrap:wrap">
            <button type="button" class="btn btn-gold" id="auto-save">Save settings</button>
            <button type="button" class="btn btn-ghost" id="auto-test">Send test alert</button>
            <button type="button" class="btn btn-ghost" id="auto-refresh">Refresh</button>
          </div>
          <div class="auto-help">
            <h4>Connect WhatsApp (fastest)</h4>
            <ol>
              <li>On your phone WhatsApp, message <strong>+34 644 66 64 35</strong>: <code>I allow callmebot to send me messages</code></li>
              <li>Save the apikey the bot sends you</li>
              <li>On Hostinger, copy <code>automation-local.example.php</code> → <code>automation-local.php</code></li>
              <li>Set <code>whatsapp_provider</code> = <code>callmebot</code>, your phone (91…), and <code>callmebot_apikey</code></li>
              <li>Click <strong>Send test alert</strong> here</li>
            </ol>
            <p class="hint">For SMS (India), set <code>sms_provider</code> = <code>msg91</code> with authkey. Meta Cloud API and webhooks (Interakt/Wati) are also supported in the example file.</p>
          </div>
        </section>
        <section class="card">
          <div class="list-item-head">
            <h3 style="margin:0">Recent alerts</h3>
          </div>
          <div id="auto-log">
            ${
              log.length
                ? log
                    .slice(0, 25)
                    .map(
                      (r) => `
              <div class="list-item">
                <div class="list-item-head">
                  <strong>${escapeHtml(r.event || "event")}</strong>
                  <span class="hint" style="margin:0">${escapeHtml(r.at || "")} · ${r.ok ? "sent" : "failed/skipped"}</span>
                </div>
                <p style="margin:.35rem 0;font-size:.88rem;color:var(--muted)">${escapeHtml(r.summary || "")}</p>
              </div>`,
                    )
                    .join("")
                : `<p class="empty">No alerts yet. Submit the contact form or send a test.</p>`
            }
          </div>
        </section>
        <section class="card" style="grid-column:1/-1">
          <div class="list-item-head">
            <h3 style="margin:0">Recent page journeys</h3>
          </div>
          <p class="hint">Every page a visitor opens is linked. When they submit Contact, the journey is attached to the lead and included in your WhatsApp/SMS.</p>
          <div id="auto-visits">
            ${
              visits.length
                ? `<table class="auto-table"><thead><tr><th>Visitor</th><th>Landing</th><th>Last page</th><th>Pages</th><th>Converted</th><th>Updated</th></tr></thead><tbody>
                ${visits
                  .slice(0, 40)
                  .map(
                    (v) => `<tr>
                  <td><code>${escapeHtml((v.id || "").slice(0, 14))}</code></td>
                  <td>${escapeHtml(v.landing || "/")}</td>
                  <td>${escapeHtml(v.lastPath || "/")}</td>
                  <td>${escapeHtml(String(v.pageCount || 0))}</td>
                  <td>${v.converted ? "Yes" : "—"}</td>
                  <td>${escapeHtml(v.updatedAt || "")}</td>
                </tr>`,
                  )
                  .join("")}
              </tbody></table>`
                : `<p class="empty">No visits tracked yet. Browse the live site, then refresh.</p>`
            }
          </div>
        </section>
      </div>`;

    $("#auto-save").onclick = async () => {
      try {
        await api("save-automation", {
          settings: {
            enabled: $("#auto-enabled").checked,
            notifyEmail: $("#auto-notify-email").value.trim(),
            messagePrefix: $("#auto-prefix").value.trim(),
            includeJourney: $("#auto-journey").checked,
            channels: {
              email: $("#auto-email").checked,
              whatsapp: $("#auto-wa").checked,
              sms: $("#auto-sms").checked,
            },
            events: {
              contactForm: $("#auto-ev-contact").checked,
              chatHotLead: $("#auto-ev-chat").checked,
              trackPageviews: $("#auto-ev-track").checked,
            },
          },
        });
        toast("Automation settings saved");
        renderAutomationPanel();
      } catch (e) {
        toast(e.message || "Save failed", "err");
      }
    };
    $("#auto-test").onclick = async () => {
      try {
        toast("Sending test alert…");
        const res = await api("test-automation");
        const ch = res.result?.channels || {};
        const bits = Object.entries(ch)
          .map(([k, v]) => `${k}:${v.ok ? "ok" : v.skipped ? "skip" : "fail"}`)
          .join(" · ");
        toast(res.result?.ok ? `Test sent (${bits})` : `Test finished (${bits}) — check keys`, res.result?.ok ? undefined : "err");
        renderAutomationPanel();
      } catch (e) {
        toast(e.message || "Test failed", "err");
      }
    };
    $("#auto-refresh").onclick = () => renderAutomationPanel();
  } catch (e) {
    wrap.innerHTML = `<p class="empty">${escapeHtml(e.message || "Could not load automation")}</p>`;
  }
}

const CHAT_API = "./chat-api.php";

async function chatApi(action, payload = {}) {
  const headers = { "Content-Type": "application/json" };
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
    headers["X-DA-Admin-Token"] = state.token;
  }
  const res = await fetch(CHAT_API, {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({ action, ...payload }),
  });
  const json = await res.json().catch(() => ({ ok: false, error: "Invalid chat response" }));
  if (res.status === 401 || json.code === "auth") {
    state.authed = false;
    state.token = "";
    localStorage.removeItem(TOKEN_KEY);
    showLogin(true);
    throw new Error(json.error || "Please log in again");
  }
  if (!res.ok || json.ok === false) throw new Error(json.error || "Chat request failed");
  return json;
}

let liveChatSelected = null;
let liveChatTimer = null;

function stopLiveChatPolling() {
  if (liveChatTimer) {
    clearInterval(liveChatTimer);
    liveChatTimer = null;
  }
}

async function renderLiveChatInbox() {
  stopLiveChatPolling();
  const wrap = $("#editor-wrap");
  wrap.innerHTML = `<div class="card"><p class="hint">Loading live chats…</p></div>`;
  try {
    const list = await chatApi("list");
    const chats = list.chats || [];
    wrap.innerHTML = `
      <div class="livechat-layout">
        <section class="card livechat-list">
          <div class="list-item-head" style="margin-bottom:.75rem">
            <h3 style="margin:0">Conversations</h3>
            <button type="button" class="btn btn-ghost" id="livechat-refresh">Refresh</button>
          </div>
          <div id="livechat-items">
            ${
              chats.length
                ? chats
                    .map(
                      (c) => `
              <button type="button" class="livechat-item ${liveChatSelected === c.id ? "active" : ""}" data-chat-id="${escapeAttr(c.id)}">
                <div class="list-item-head">
                  <strong>${escapeHtml(c.visitor?.name || "Visitor")}${c.unreadAdmin ? ` <span class="livechat-unread">${c.unreadAdmin}</span>` : ""}</strong>
                  <span class="hint" style="margin:0">${escapeHtml((c.updatedAt || "").replace("T", " ").slice(0, 16))}</span>
                </div>
                <p class="livechat-preview">${escapeHtml(c.lastMessage?.text || "No messages")}</p>
                <p class="hint" style="margin:.25rem 0 0">${escapeHtml(c.status || "open")}${c.visitor?.phone ? " · " + escapeHtml(c.visitor.phone) : ""}</p>
              </button>`,
                    )
                    .join("")
                : `<p class="empty">No chats yet. Open the website and click Chat.</p>`
            }
          </div>
        </section>
        <section class="card livechat-thread" id="livechat-thread">
          <p class="empty">Select a conversation to reply.</p>
        </section>
      </div>`;
    $("#livechat-refresh").onclick = () => renderLiveChatInbox();
    wrap.querySelectorAll("[data-chat-id]").forEach((btn) => {
      btn.onclick = () => openLiveChatThread(btn.getAttribute("data-chat-id"));
    });
    if (liveChatSelected) openLiveChatThread(liveChatSelected);
    liveChatTimer = setInterval(() => {
      if (state.current === "livechat") {
        if (liveChatSelected) openLiveChatThread(liveChatSelected, true);
        else refreshLiveChatListSilent();
      }
    }, 4000);
  } catch (e) {
    wrap.innerHTML = `<div class="card"><p class="empty">${escapeHtml(e.message || "Could not load chats")}</p></div>`;
  }
}

async function refreshLiveChatListSilent() {
  try {
    const list = await chatApi("list");
    const box = $("#livechat-items");
    if (!box) return;
    const chats = list.chats || [];
    box.innerHTML = chats.length
      ? chats
          .map(
            (c) => `
        <button type="button" class="livechat-item ${liveChatSelected === c.id ? "active" : ""}" data-chat-id="${escapeAttr(c.id)}">
          <div class="list-item-head">
            <strong>${escapeHtml(c.visitor?.name || "Visitor")}${c.unreadAdmin ? ` <span class="livechat-unread">${c.unreadAdmin}</span>` : ""}</strong>
            <span class="hint" style="margin:0">${escapeHtml((c.updatedAt || "").replace("T", " ").slice(0, 16))}</span>
          </div>
          <p class="livechat-preview">${escapeHtml(c.lastMessage?.text || "No messages")}</p>
          <p class="hint" style="margin:.25rem 0 0">${escapeHtml(c.status || "open")}${c.visitor?.phone ? " · " + escapeHtml(c.visitor.phone) : ""}</p>
        </button>`,
          )
          .join("")
      : `<p class="empty">No chats yet.</p>`;
    box.querySelectorAll("[data-chat-id]").forEach((btn) => {
      btn.onclick = () => openLiveChatThread(btn.getAttribute("data-chat-id"));
    });
  } catch {
    /* ignore */
  }
}

async function openLiveChatThread(id, silent = false) {
  liveChatSelected = id;
  const thread = $("#livechat-thread");
  if (!thread) return;
  if (!silent) thread.innerHTML = `<p class="hint">Loading…</p>`;
  try {
    const res = await chatApi("get", { conversationId: id });
    const chat = res.chat;
    const v = chat.visitor || {};
    thread.innerHTML = `
      <div class="list-item-head">
        <div>
          <h3 style="margin:0">${escapeHtml(v.name || "Visitor")}</h3>
          <p class="hint" style="margin:.2rem 0 0">${escapeHtml(v.phone || "No phone")} ${v.email ? "· " + escapeHtml(v.email) : ""} · page ${escapeHtml(v.page || "/")}</p>
        </div>
        <button type="button" class="btn btn-ghost" id="livechat-close">Close chat</button>
      </div>
      <div class="livechat-msgs" id="livechat-msgs">
        ${(chat.messages || [])
          .map(
            (m) => `
          <div class="livechat-bubble ${m.role === "visitor" ? "is-visitor" : "is-agent"}">
            <strong>${m.role === "visitor" ? "Visitor" : "You"}</strong>
            <p>${escapeHtml(m.text || "")}</p>
            <span>${escapeHtml((m.at || "").replace("T", " ").slice(0, 19))}</span>
          </div>`,
          )
          .join("")}
      </div>
      <form id="livechat-reply" class="livechat-reply">
        <textarea id="livechat-text" rows="3" placeholder="Type a reply…" required></textarea>
        <button type="submit" class="btn btn-gold">Send reply</button>
      </form>`;
    const msgs = $("#livechat-msgs");
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
    $("#livechat-close").onclick = async () => {
      await chatApi("close", { conversationId: id });
      toast("Chat closed");
      renderLiveChatInbox();
    };
    $("#livechat-reply").onsubmit = async (e) => {
      e.preventDefault();
      const text = $("#livechat-text").value.trim();
      if (!text) return;
      try {
        await chatApi("reply", { conversationId: id, text });
        $("#livechat-text").value = "";
        openLiveChatThread(id);
        refreshLiveChatListSilent();
      } catch (err) {
        toast(err.message, "err");
      }
    };
    refreshLiveChatListSilent();
  } catch (e) {
    if (!silent) thread.innerHTML = `<p class="empty">${escapeHtml(e.message)}</p>`;
  }
}

function openQuotations() {
  if (state.dirty) {
    const leave = confirm("You have unpublished edits. Leave without Update?");
    if (!leave) return;
  }
  state.current = "quotations";
  state.data = null;
  setDirty(false);
  setQuoteWorkspace(true);
  $("#panel-title").textContent = QUOTE_NAV.quotations;
  $("#panel-sub").textContent =
    "Create quotations, collect Razorpay payments, and issue receipts — all on Hostinger.";
  renderNav();
  renderQuotationsHub();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.querySelector(".main")?.scrollTo?.({ top: 0, behavior: "auto" });
}

function openInvoices() {
  if (state.dirty) {
    const leave = confirm("You have unpublished edits. Leave without Update?");
    if (!leave) return;
  }
  state.current = "invoices";
  state.data = null;
  setDirty(false);
  setQuoteWorkspace(true);
  $("#panel-title").textContent = "Create Invoice";
  $("#panel-sub").textContent =
    "MediaShouter tax invoices with HSN/SAC, CGST/SGST — same layout as your sample PDF.";
  renderNav();
  renderInvoicesHub();
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.querySelector(".main")?.scrollTo?.({ top: 0, behavior: "auto" });
}

function renderInvoicesHub(tab = "create") {
  const wrap = $("#editor-wrap");
  wrap.innerHTML = `<div class="quote-hub"><p class="muted">Loading invoices…</p></div>`;
  loadInvoicesWorkspace(tab);
}

async function loadInvoicesWorkspace(tab = "create") {
  const wrap = $("#editor-wrap");
  try {
    await ensureQuotesInstalled();
    const listRes = await quotesApi("invoice_list");
    const invoices = listRes.data || [];
    const tabs = `
      <div class="quote-tabs">
        <button type="button" class="btn ${tab === "create" ? "btn-gold" : ""}" data-itab="create">Create Invoice</button>
        <button type="button" class="btn ${tab === "list" ? "btn-gold" : ""}" data-itab="list">All invoices</button>
        <a class="btn" href="../invoice/demo/" target="_blank" rel="noreferrer">Open layout demo</a>
      </div>`;

    if (tab === "list") {
      wrap.innerHTML = `
        <div class="quote-hub">
          <div class="help-banner"><strong>Create Invoice</strong> is in the left menu. Generated invoices open in the MediaShouter tax-invoice layout.</div>
          ${tabs}
          <div class="card">
            <h3>Tax invoices</h3>
            <div class="quote-table-wrap">
              <table class="quote-table">
                <thead><tr><th>No.</th><th>Date</th><th>Buyer</th><th>Total</th><th>Status</th><th></th></tr></thead>
                <tbody>
                  ${invoices.map((inv) => `
                    <tr>
                      <td><code>${escapeHtml(inv.invoiceNumber)}</code></td>
                      <td>${escapeHtml(inv.invoiceDate || "")}</td>
                      <td>${escapeHtml(inv.buyerName || "")}</td>
                      <td>${inr(inv.grandTotalPaise)}</td>
                      <td>${escapeHtml(inv.status || "")}</td>
                      <td class="quote-row-actions">
                        <a class="btn btn-sm btn-gold" href="${escapeAttr(inv.publicUrl)}" target="_blank" rel="noreferrer">Open</a>
                        <button type="button" class="btn btn-sm" data-copy="${escapeAttr(inv.publicUrl)}">Copy link</button>
                      </td>
                    </tr>`).join("") || `<tr><td colspan="6" class="muted">No invoices yet. Create one.</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        </div>`;
      wrap.querySelectorAll("[data-itab]").forEach((btn) => {
        btn.onclick = () => loadInvoicesWorkspace(btn.dataset.itab);
      });
      wrap.querySelectorAll("[data-copy]").forEach((btn) => {
        btn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(btn.dataset.copy);
            toast("Invoice link copied");
          } catch {
            toast(btn.dataset.copy);
          }
        };
      });
      return;
    }

    // Create form
    wrap.innerHTML = `
      <div class="quote-hub">
        <div class="help-banner">
          Fill buyer + line items (HSN default <code>998314</code>). Company block uses <strong>MediaShouter</strong> from Company &amp; GST settings.
        </div>
        ${tabs}
        <div class="card">
          <div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;align-items:center">
            <h3 style="margin:0">New tax invoice</h3>
            <button type="button" class="btn" id="inv-load-sample">Load sample (Flag Company)</button>
          </div>
          <div class="grid grid-2" style="margin-top:12px">
            <label>Invoice date<input id="inv-date" type="date" value="${new Date().toISOString().slice(0, 10)}" /></label>
            <label>GST %<input id="inv-gst" type="number" value="18" /></label>
            <label class="full">Buyer (Bill to) name<input id="inv-buyer" placeholder="Client company name" /></label>
            <label class="full">Buyer address<textarea id="inv-buyer-addr" rows="3" placeholder="Full billing address"></textarea></label>
            <label>Buyer GSTIN<input id="inv-buyer-gstin" placeholder="27XXXXXXXXXX1Z1" /></label>
            <label>Buyer state<input id="inv-buyer-state" value="Maharashtra" /></label>
            <label>State code<input id="inv-buyer-code" value="27" /></label>
            <label class="full">Ship to (leave blank = same as buyer)<input id="inv-ship" placeholder="Optional different ship-to name" /></label>
          </div>
          <h4 style="margin:16px 0 8px">Line items</h4>
          <div id="inv-items" class="quote-items"></div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
            <button type="button" class="btn" id="inv-add-line">Add line</button>
          </div>
          <p class="hint" id="inv-preview-total" style="margin-top:12px">Taxable + GST will calculate on create.</p>
          <button type="button" class="btn btn-gold" id="inv-create" style="margin-top:14px">Create invoice</button>
        </div>
      </div>`;

    const itemsEl = $("#inv-items");
    const lines = [];
    const redraw = () => {
      itemsEl.innerHTML =
        lines
          .map(
            (l, i) => `
        <div class="quote-item-row" style="grid-template-columns:2fr 1.2fr 90px 110px auto">
          <input data-i="${i}" data-k="particulars" value="${escapeAttr(l.particulars)}" placeholder="Particulars" />
          <input data-i="${i}" data-k="description" value="${escapeAttr(l.description)}" placeholder="Description / place" />
          <input data-i="${i}" data-k="hsnSac" value="${escapeAttr(l.hsnSac)}" placeholder="HSN" />
          <input data-i="${i}" data-k="amountInr" type="number" min="0" step="1" value="${l.amountInr}" placeholder="Amount" />
          <button type="button" class="btn btn-sm btn-danger" data-del="${i}">Remove</button>
        </div>`,
          )
          .join("") || `<p class="muted">Add at least one line.</p>`;
      itemsEl.querySelectorAll("input").forEach((inp) => {
        inp.oninput = () => {
          const i = Number(inp.dataset.i);
          const k = inp.dataset.k;
          lines[i][k] = k === "amountInr" ? Number(inp.value || 0) : inp.value;
          updateInvPreview();
        };
      });
      itemsEl.querySelectorAll("[data-del]").forEach((btn) => {
        btn.onclick = () => {
          lines.splice(Number(btn.dataset.del), 1);
          redraw();
        };
      });
      updateInvPreview();
    };
    const updateInvPreview = () => {
      const taxable = lines.reduce((s, l) => s + Number(l.amountInr || 0), 0);
      const gstPct = Number($("#inv-gst").value || 18);
      const gst = Math.round((taxable * gstPct) / 100);
      $("#inv-preview-total").textContent = `Taxable ₹${taxable.toLocaleString("en-IN")} + GST ₹${gst.toLocaleString("en-IN")} = ₹${(taxable + gst).toLocaleString("en-IN")}`;
    };
    $("#inv-gst").oninput = updateInvPreview;
    $("#inv-add-line").onclick = () => {
      lines.push({ particulars: "", description: "", hsnSac: "998314", amountInr: 0 });
      redraw();
    };
    $("#inv-load-sample").onclick = () => {
      $("#inv-buyer").value = "The Flag Company";
      $("#inv-buyer-addr").value =
        "Survey No.140/3\nVillage Juchandra, Near Lodha Dham Temple,\nNaigaon East, Taluka Vasai\nPalghar";
      $("#inv-buyer-gstin").value = "27AAEFT4915F1Z7";
      $("#inv-buyer-state").value = "Maharashtra";
      $("#inv-buyer-code").value = "27";
      $("#inv-date").value = "2026-08-10";
      lines.splice(0, lines.length,
        { particulars: "Search Engine Optimisation (S.E.O)", description: "India", hsnSac: "998314", amountInr: 10000 },
        { particulars: "Search Engine Marketing (S.E.M)", description: "India", hsnSac: "998314", amountInr: 10000 },
        { particulars: "Search Engine Optimisation (S.E.O)", description: "U.A.E", hsnSac: "998314", amountInr: 10000 },
        { particulars: "Search Engine Marketing (S.E.M)", description: "U.A.E", hsnSac: "998314", amountInr: 10000 },
        { particulars: "SherFlags", description: "Maintenance", hsnSac: "998314", amountInr: 12000 },
        { particulars: "The flag company Maintenance", description: "", hsnSac: "998314", amountInr: 15000 },
      );
      redraw();
      toast("Sample loaded — click Create invoice");
    };
    $("#inv-create").onclick = async () => {
      try {
        if (!lines.length) throw new Error("Add at least one line");
        const created = await quotesApi("invoice_create", {
          buyerName: $("#inv-buyer").value.trim(),
          buyerAddress: $("#inv-buyer-addr").value,
          buyerGstin: $("#inv-buyer-gstin").value.trim(),
          buyerState: $("#inv-buyer-state").value.trim() || "Maharashtra",
          buyerStateCode: $("#inv-buyer-code").value.trim() || "27",
          shipName: $("#inv-ship").value.trim() || undefined,
          invoiceDate: $("#inv-date").value,
          gstPercent: Number($("#inv-gst").value || 18),
          items: lines,
          status: "ISSUED",
        });
        toast(created.message || "Invoice created");
        if (created.data?.publicUrl) {
          window.open(created.data.publicUrl, "_blank", "noopener");
        }
        loadInvoicesWorkspace("list");
      } catch (e) {
        toast(e.message, "err");
      }
    };
    wrap.querySelectorAll("[data-itab]").forEach((btn) => {
      btn.onclick = () => loadInvoicesWorkspace(btn.dataset.itab);
    });
    lines.push({ particulars: "", description: "", hsnSac: "998314", amountInr: 0 });
    redraw();
  } catch (e) {
    wrap.innerHTML = `<div class="quote-hub"><div class="card"><p class="muted">${escapeHtml(e.message)}</p>
      <button type="button" class="btn btn-gold" id="inv-retry">Retry</button></div></div>`;
    $("#inv-retry").onclick = () => loadInvoicesWorkspace(tab);
  }
}

function quotesHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (state.token) {
    headers.Authorization = `Bearer ${state.token}`;
    headers["X-DA-Admin-Token"] = state.token;
  }
  return headers;
}

async function quotesApi(action, payload = {}) {
  const res = await fetch(QUOTES_API, {
    method: "POST",
    credentials: "include",
    headers: quotesHeaders(),
    body: JSON.stringify({ action, ...payload }),
  });
  const json = await res.json().catch(() => ({ ok: false, error: "Invalid response" }));
  if (res.status === 401 || json.code === "auth") {
    state.authed = false;
    state.token = "";
    localStorage.removeItem(TOKEN_KEY);
    showLogin(true);
    throw new Error(json.error || "Please log in again");
  }
  if (!res.ok || json.ok === false) throw new Error(json.error || "Request failed");
  return json;
}

function inr(paise) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(paise || 0) / 100);
}

function renderQuotationsHub() {
  const wrap = $("#editor-wrap");
  wrap.innerHTML = `<div class="quote-hub"><p class="muted">Loading quotations…</p></div>`;
  loadQuotationsWorkspace();
}

async function ensureQuotesInstalled() {
  try {
    await quotesApi("dashboard");
    return true;
  } catch (e) {
    if (String(e.message || "").includes("doesn't exist") || String(e.message || "").toLowerCase().includes("table")) {
      const res = await fetch("./quotes/install.php", { method: "POST", credentials: "include", headers: quotesHeaders(), body: "{}" });
      const json = await res.json().catch(() => ({ ok: false, error: "Install failed" }));
      if (!res.ok || json.ok === false) throw new Error(json.error || "Could not install quotations DB");
      return true;
    }
    // Missing local.php / connection — still try install once
    try {
      const res = await fetch("./quotes/install.php", { method: "POST", credentials: "include", headers: quotesHeaders(), body: "{}" });
      const json = await res.json().catch(() => ({ ok: false }));
      if (json.ok) return true;
    } catch (_) {}
    throw e;
  }
}

async function loadQuotationsWorkspace(tab = "dashboard") {
  const wrap = $("#editor-wrap");
  try {
    await ensureQuotesInstalled();
    if (tab === "dashboard") {
      const dash = await quotesApi("dashboard");
      const m = dash.metrics || {};
      wrap.innerHTML = `
        <div class="quote-hub">
          <div class="help-banner">Quotations, GST, Razorpay advances, invoices & receipts run <strong>entirely on Hostinger</strong> (MariaDB). No Vercel required.</div>
          <div class="quote-tabs">
            <button type="button" class="btn btn-gold" data-qtab="dashboard">Dashboard</button>
            <button type="button" class="btn" data-qtab="create">New quotation</button>
            <button type="button" class="btn" data-qtab="clients">Clients</button>
            <button type="button" class="btn" data-qtab="services">Services</button>
            <button type="button" class="btn" data-qtab="settings">Company & GST</button>
          </div>
          <div class="quote-metrics">
            <div class="quote-metric"><span>Quotes</span><strong>${m.totalQuoteCount ?? 0}</strong></div>
            <div class="quote-metric"><span>Pipeline</span><strong>${inr(m.totalQuoteValuePaise)}</strong></div>
            <div class="quote-metric"><span>Collected</span><strong>${inr(m.collectedPaise)}</strong></div>
            <div class="quote-metric"><span>Outstanding</span><strong>${inr(m.outstandingPaise)}</strong></div>
          </div>
          <div class="card">
            <h3>Recent quotations</h3>
            <div class="quote-table-wrap">
              <table class="quote-table">
                <thead><tr><th>Number</th><th>Client</th><th>Status</th><th>Payment</th><th>Total</th><th></th></tr></thead>
                <tbody>
                  ${(dash.quotations || []).map((q) => `
                    <tr>
                      <td><code>${escapeHtml(q.quotationNumber)}</code></td>
                      <td>${escapeHtml(q.companyName || "")}</td>
                      <td>${escapeHtml(q.status)}</td>
                      <td>${escapeHtml(q.paymentStatus)}</td>
                      <td>${inr(q.grandTotalPaise)}</td>
                      <td class="quote-row-actions">
                        <button type="button" class="btn btn-sm" data-copy="${escapeHtml(q.publicUrl)}">Copy link</button>
                        <button type="button" class="btn btn-sm btn-gold" data-send="${escapeHtml(q.id)}">Send</button>
                      </td>
                    </tr>`).join("") || `<tr><td colspan="6" class="muted">No quotations yet. Create one.</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        </div>`;
    } else if (tab === "clients") {
      const list = await quotesApi("clients_list");
      wrap.innerHTML = `
        <div class="quote-hub">
          <div class="quote-tabs">
            <button type="button" class="btn" data-qtab="dashboard">Dashboard</button>
            <button type="button" class="btn" data-qtab="create">New quotation</button>
            <button type="button" class="btn btn-gold" data-qtab="clients">Clients</button>
            <button type="button" class="btn" data-qtab="services">Services</button>
            <button type="button" class="btn" data-qtab="settings">Company & GST</button>
          </div>
          <div class="card">
            <h3>Add client</h3>
            <div class="grid grid-2">
              <label>Company<input id="qc-company" /></label>
              <label>Contact<input id="qc-contact" /></label>
              <label>Email<input id="qc-email" type="email" /></label>
              <label>Mobile<input id="qc-mobile" /></label>
              <label>GSTIN<input id="qc-gstin" /></label>
              <label>State<input id="qc-state" placeholder="Maharashtra" /></label>
              <label class="full">Address<textarea id="qc-address" rows="2"></textarea></label>
            </div>
            <button type="button" class="btn btn-gold" id="qc-save" style="margin-top:10px">Save client</button>
          </div>
          <div class="card">
            <h3>Clients</h3>
            <ul class="quote-list">${(list.data||[]).map(c => `<li><strong>${escapeHtml(c.companyName)}</strong> · ${escapeHtml(c.clientCode)} · ${escapeHtml(c.state||"")} · ${escapeHtml(c.mobile||"")}</li>`).join("") || "<li class='muted'>None yet</li>"}</ul>
          </div>
        </div>`;
      $("#qc-save").onclick = async () => {
        try {
          await quotesApi("clients_save", {
            companyName: $("#qc-company").value,
            contactPerson: $("#qc-contact").value,
            email: $("#qc-email").value,
            mobile: $("#qc-mobile").value,
            gstin: $("#qc-gstin").value,
            state: $("#qc-state").value,
            address: $("#qc-address").value,
          });
          toast("Client saved");
          loadQuotationsWorkspace("clients");
        } catch (e) { toast(e.message, "err"); }
      };
    } else if (tab === "services") {
      const list = await quotesApi("services_list");
      wrap.innerHTML = `
        <div class="quote-hub">
          <div class="quote-tabs">
            <button type="button" class="btn" data-qtab="dashboard">Dashboard</button>
            <button type="button" class="btn" data-qtab="create">New quotation</button>
            <button type="button" class="btn" data-qtab="clients">Clients</button>
            <button type="button" class="btn btn-gold" data-qtab="services">Services</button>
            <button type="button" class="btn" data-qtab="settings">Company & GST</button>
          </div>
          <div class="card">
            <h3>Add service</h3>
            <div class="grid grid-2">
              <label>Category<input id="qs-cat" value="General" /></label>
              <label>Name<input id="qs-name" /></label>
              <label>Price (INR)<input id="qs-price" type="number" min="0" step="1" /></label>
              <label>GST %<input id="qs-gst" type="number" value="18" /></label>
              <label class="full">Description<textarea id="qs-desc" rows="2"></textarea></label>
            </div>
            <button type="button" class="btn btn-gold" id="qs-save" style="margin-top:10px">Save service</button>
          </div>
          <div class="card">
            <h3>Catalog</h3>
            <ul class="quote-list">${(list.data||[]).map(s => `<li><strong>${escapeHtml(s.name)}</strong> · ${escapeHtml(s.category)} · ${inr(s.unitPricePaise)} + ${s.gstPercent}% GST</li>`).join("")}</ul>
          </div>
        </div>`;
      $("#qs-save").onclick = async () => {
        try {
          await quotesApi("services_save", {
            category: $("#qs-cat").value,
            name: $("#qs-name").value,
            unitPriceInr: Number($("#qs-price").value || 0),
            gstPercent: Number($("#qs-gst").value || 18),
            description: $("#qs-desc").value,
          });
          toast("Service saved");
          loadQuotationsWorkspace("services");
        } catch (e) { toast(e.message, "err"); }
      };
    } else if (tab === "settings") {
      const co = await quotesApi("company_get");
      const d = co.data || {};
      wrap.innerHTML = `
        <div class="quote-hub">
          <div class="quote-tabs">
            <button type="button" class="btn" data-qtab="dashboard">Dashboard</button>
            <button type="button" class="btn" data-qtab="create">New quotation</button>
            <button type="button" class="btn" data-qtab="clients">Clients</button>
            <button type="button" class="btn" data-qtab="services">Services</button>
            <button type="button" class="btn btn-gold" data-qtab="settings">Company & GST</button>
          </div>
          <div class="card">
            <h3>Company profile</h3>
            <div class="grid grid-2">
              <label>Legal name<input id="qp-legal" value="${escapeHtml(d.legalName||"")}" /></label>
              <label>Brand<input id="qp-brand" value="${escapeHtml(d.brandName||"")}" /></label>
              <label>GSTIN<input id="qp-gstin" value="${escapeHtml(d.gstin||"")}" /></label>
              <label>Phone<input id="qp-phone" value="${escapeHtml(d.phone||"")}" /></label>
              <label>Email<input id="qp-email" value="${escapeHtml(d.email||"")}" /></label>
              <label>State<input id="qp-state" value="${escapeHtml(d.state||"")}" /></label>
              <label>Default GST %<input id="qp-gst" type="number" value="${Number(d.defaultGstPercent||18)}" /></label>
              <label>Default advance %<input id="qp-adv" type="number" value="${Number(d.defaultAdvancePct||60)}" /></label>
              <label class="full">Registered address<textarea id="qp-addr" rows="2">${escapeHtml(d.registeredAddress||"")}</textarea></label>
            </div>
            <button type="button" class="btn btn-gold" id="qp-save" style="margin-top:10px">Save settings</button>
          </div>
        </div>`;
      $("#qp-save").onclick = async () => {
        try {
          await quotesApi("company_save", {
            legalName: $("#qp-legal").value,
            brandName: $("#qp-brand").value,
            gstin: $("#qp-gstin").value,
            phone: $("#qp-phone").value,
            email: $("#qp-email").value,
            state: $("#qp-state").value,
            defaultGstPercent: Number($("#qp-gst").value || 18),
            defaultAdvancePct: Number($("#qp-adv").value || 60),
            registeredAddress: $("#qp-addr").value,
          });
          toast("Company settings saved");
        } catch (e) { toast(e.message, "err"); }
      };
    } else if (tab === "create") {
      const [clients, services, company] = await Promise.all([
        quotesApi("clients_list"),
        quotesApi("services_list"),
        quotesApi("company_get"),
      ]);
      const adv = Number(company.data?.defaultAdvancePct || 60);
      wrap.innerHTML = `
        <div class="quote-hub">
          <div class="quote-tabs">
            <button type="button" class="btn" data-qtab="dashboard">Dashboard</button>
            <button type="button" class="btn btn-gold" data-qtab="create">New quotation</button>
            <button type="button" class="btn" data-qtab="clients">Clients</button>
            <button type="button" class="btn" data-qtab="services">Services</button>
            <button type="button" class="btn" data-qtab="settings">Company & GST</button>
          </div>
          <div class="card">
            <h3>New quotation</h3>
            <div class="grid grid-2">
              <label>Client
                <select id="qq-client">
                  <option value="">Select client</option>
                  ${(clients.data||[]).map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.companyName)}</option>`).join("")}
                </select>
              </label>
              <label>Advance %<input id="qq-adv" type="number" value="${adv}" /></label>
              <label class="full">Title<input id="qq-title" placeholder="Website + Local SEO package" /></label>
              <label class="full">Notes<textarea id="qq-notes" rows="2"></textarea></label>
            </div>
            <h4 style="margin:14px 0 8px">Line items</h4>
            <div id="qq-items" class="quote-items"></div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
              <button type="button" class="btn" id="qq-add-blank">Add blank line</button>
              <select id="qq-add-service"><option value="">Add from catalog…</option>${(services.data||[]).filter(s=>s.isActive!==false).map(s=>`<option value="${escapeHtml(s.id)}" data-name="${escapeHtml(s.name)}" data-cat="${escapeHtml(s.category||"")}" data-price="${s.unitPriceInr}" data-gst="${s.gstPercent}" data-desc="${escapeHtml(s.description||"")}">${escapeHtml(s.name)} (${inr(s.unitPricePaise)})</option>`).join("")}</select>
            </div>
            <button type="button" class="btn btn-gold" id="qq-create" style="margin-top:14px">Create draft</button>
          </div>
        </div>`;
      const itemsEl = $("#qq-items");
      const lines = [];
      const redraw = () => {
        itemsEl.innerHTML = lines.map((l, i) => `
          <div class="quote-item-row">
            <input data-i="${i}" data-k="serviceName" value="${escapeHtml(l.serviceName)}" placeholder="Service" />
            <input data-i="${i}" data-k="quantity" type="number" min="0" step="0.01" value="${l.quantity}" style="max-width:90px" />
            <input data-i="${i}" data-k="unitPriceInr" type="number" min="0" step="1" value="${l.unitPriceInr}" style="max-width:120px" />
            <input data-i="${i}" data-k="gstPercent" type="number" value="${l.gstPercent}" style="max-width:80px" />
            <button type="button" class="btn btn-sm btn-danger" data-del="${i}">Remove</button>
          </div>`).join("") || `<p class="muted">Add at least one line.</p>`;
        itemsEl.querySelectorAll("input").forEach((inp) => {
          inp.oninput = () => {
            const i = Number(inp.dataset.i);
            const k = inp.dataset.k;
            lines[i][k] = k === "serviceName" ? inp.value : Number(inp.value || 0);
          };
        });
        itemsEl.querySelectorAll("[data-del]").forEach((btn) => {
          btn.onclick = () => { lines.splice(Number(btn.dataset.del), 1); redraw(); };
        });
      };
      $("#qq-add-blank").onclick = () => { lines.push({ serviceName: "Service", quantity: 1, unitPriceInr: 0, gstPercent: 18, discountPercent: 0 }); redraw(); };
      $("#qq-add-service").onchange = (e) => {
        const opt = e.target.selectedOptions[0];
        if (!opt?.value) return;
        lines.push({
          serviceName: opt.dataset.name,
          category: opt.dataset.cat,
          description: opt.dataset.desc,
          quantity: 1,
          unitPriceInr: Number(opt.dataset.price || 0),
          gstPercent: Number(opt.dataset.gst || 18),
          discountPercent: 0,
        });
        e.target.value = "";
        redraw();
      };
      $("#qq-create").onclick = async () => {
        try {
          if (!$("#qq-client").value) throw new Error("Select a client");
          if (!lines.length) throw new Error("Add line items");
          const created = await quotesApi("quotation_create", {
            clientId: $("#qq-client").value,
            title: $("#qq-title").value,
            notes: $("#qq-notes").value,
            advancePercent: Number($("#qq-adv").value || 60),
            items: lines,
          });
          toast("Draft " + created.data.quotationNumber + " created");
          loadQuotationsWorkspace("dashboard");
        } catch (e) { toast(e.message, "err"); }
      };
      redraw();
    }

    wrap.querySelectorAll("[data-qtab]").forEach((btn) => {
      btn.onclick = () => loadQuotationsWorkspace(btn.dataset.qtab);
    });
    wrap.querySelectorAll("[data-copy]").forEach((btn) => {
      btn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(btn.dataset.copy);
          toast("Public link copied");
        } catch { toast(btn.dataset.copy); }
      };
    });
    wrap.querySelectorAll("[data-send]").forEach((btn) => {
      btn.onclick = async () => {
        try {
          const sent = await quotesApi("quotation_send", { id: btn.dataset.send });
          try { await navigator.clipboard.writeText(sent.publicUrl || sent.data?.publicUrl || ""); } catch (_) {}
          toast("Sent — public link copied");
          loadQuotationsWorkspace("dashboard");
        } catch (e) { toast(e.message, "err"); }
      };
    });
  } catch (e) {
    wrap.innerHTML = `<div class="quote-hub"><div class="help-banner" style="border-color:#d63638;background:#fcf0f1">${escapeHtml(e.message)}</div>
      <p class="muted">If this is the first run, confirm <code>admin/quotes/local.php</code> has the MariaDB password and Razorpay keys, then reopen this menu.</p></div>`;
  }
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
    setQuoteWorkspace(false);
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
    citations: renderCitations,
    backlinks: renderBacklinks,
    tracking: renderTracking,
    settings: renderSettings,
  };
  wrap.innerHTML = (map[key] || (() => `<pre>${escapeHtml(JSON.stringify(d, null, 2))}</pre>`))(d);
  bindFields(wrap);
  wrap.querySelectorAll("[data-action]").forEach((btn) => {
    btn.onclick = () => handleAction(btn.dataset.action, btn.dataset.index);
  });
  if (key === "company") bindCatalogueUpload();
  bindImageUploads(wrap);
}

function bindCatalogueUpload() {
  const btn = $("#catalogue-upload-btn");
  const input = $("#catalogue-file");
  if (!btn || !input) return;
  btn.onclick = async () => {
    const file = input.files && input.files[0];
    if (!file) {
      toast("Choose a PDF first", "err");
      return;
    }
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") {
      toast("Only PDF files are allowed", "err");
      return;
    }
    btn.disabled = true;
    btn.textContent = "Uploading…";
    try {
      const fd = new FormData();
      fd.append("file", file);
      const headers = {};
      if (state.token) {
        headers.Authorization = `Bearer ${state.token}`;
        headers["X-DA-Admin-Token"] = state.token;
      }
      const res = await fetch(`${API}?action=upload-catalogue`, {
        method: "POST",
        credentials: "include",
        headers,
        body: fd,
      });
      const json = await res.json().catch(() => ({ ok: false, error: "Invalid response" }));
      if (res.status === 401 || json.code === "auth") {
        state.authed = false;
        state.token = "";
        localStorage.removeItem(TOKEN_KEY);
        showLogin(true);
        throw new Error(json.error || "Please log in again");
      }
      if (!res.ok || json.ok === false) {
        throw new Error(json.error || "Upload failed");
      }
      if (json.data && typeof json.data === "object") {
        state.data = json.data;
      } else {
        state.data.catalogueUrl = json.url;
        state.data.catalogueFileName = json.fileName || "DisplayAvenue-Catalogue.pdf";
        state.data.catalogueUpdatedAt = new Date().toISOString();
      }
      setDirty(false);
      renderEditor();
      refreshPreview();
      toast(json.message || "Catalogue uploaded");
    } catch (e) {
      toast(e.message || "Upload failed", "err");
      btn.disabled = false;
      btn.textContent = "Upload catalogue";
    }
  };
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
    <section class="card" id="catalogue-card">
      <h3>Mobile sticky · Catalogue PDF</h3>
      <p class="hint" style="margin-top:0">
        Upload a PDF here. The mobile sticky bar uses <strong>WhatsApp + Catalogue</strong>.
        Replacing the file updates the live download link automatically.
      </p>
      <div class="grid">
        ${field("Catalogue URL", "catalogueUrl", d.catalogueUrl || "/catalogue/DisplayAvenue-Catalogue.pdf")}
        ${field("Download filename", "catalogueFileName", d.catalogueFileName || "DisplayAvenue-Catalogue.pdf")}
        <div class="field full">
          <label>Upload new catalogue (PDF)</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <input type="file" id="catalogue-file" accept="application/pdf,.pdf" />
            <button type="button" class="btn btn-gold" id="catalogue-upload-btn">Upload catalogue</button>
            ${
              d.catalogueUrl
                ? `<a class="btn btn-ghost" href="${escapeAttr(d.catalogueUrl)}" target="_blank" rel="noreferrer">Open current PDF</a>`
                : ""
            }
          </div>
          <p class="hint" style="margin:.5rem 0 0">
            Last upload: ${escapeHtml(d.catalogueUpdatedAt || "not uploaded yet")}
          </p>
        </div>
      </div>
    </section>
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
    ${imageField("Hero image", "hero.image", d.hero?.image, "root")}
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
          ${imageField("Photo", `reviews.${i}.profilePhotoUrl`, r.profilePhotoUrl || "", "reviews")}
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
          ${imageField("Image", `items.${i}.image`, item.image || "", "awards")}
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
        Upload any JPG/PNG — it is converted to <strong>WebP</strong> automatically.
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
          ${imageField("Image", `items.${i}.image`, item.image || "", "certs")}
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
        Edit certificates here. Upload any JPG/PNG — saved as <strong>WebP</strong> under <code>/images/certs/</code>.
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

function renderCitations(d) {
  const dirs = (d.directories || [])
    .map(
      (row, i) => `
      <div class="list-item">
        <div class="list-item-head">
          <strong>${escapeHtml(row.name || "Directory")}</strong>
          <button type="button" class="btn btn-ghost" data-action="del-citation" data-index="${i}">Delete</button>
        </div>
        <div class="grid">
          ${field("Name", `directories.${i}.name`, row.name)}
          ${field("URL", `directories.${i}.url`, row.url)}
          ${field("Category", `directories.${i}.category`, row.category)}
          ${field("Priority", `directories.${i}.priority`, row.priority)}
          ${field("Authority hint", `directories.${i}.daHint`, row.daHint)}
          ${field("NAP / fields", `directories.${i}.napFields`, row.napFields)}
          ${field("Notes", `directories.${i}.notes`, row.notes, "textarea")}
          ${field("ID", `directories.${i}.id`, row.id)}
        </div>
      </div>`,
    )
    .join("");
  const templates = (d.templates || [])
    .map(
      (row, i) => `
      <div class="list-item">
        <div class="list-item-head">
          <strong>${escapeHtml(row.name || "Template")}</strong>
          <button type="button" class="btn btn-ghost" data-action="del-outreach-template" data-index="${i}">Delete</button>
        </div>
        <div class="grid">
          ${field("Name", `templates.${i}.name`, row.name)}
          ${field("Subject", `templates.${i}.subject`, row.subject)}
          ${field("Body", `templates.${i}.body`, row.body, "textarea")}
          ${field("ID", `templates.${i}.id`, row.id)}
        </div>
      </div>`,
    )
    .join("");
  return `
  ${card(
    "Citation kit settings",
    `
    ${field("Title", "title", d.title)}
    ${field("Lead", "lead", d.lead, "textarea")}
    ${field("Optional Google Sheet URL", "sheetUrl", d.sheetUrl || "")}
  `,
  )}
  <div class="card">
    <h3>Directories</h3>
    <p class="hint">Public page: /free-tools/citation-directory</p>
    ${dirs || `<p class="empty">No directories yet.</p>`}
    <button type="button" class="btn btn-gold" data-action="add-citation">Add directory</button>
  </div>
  <div class="card">
    <h3>Outreach templates</h3>
    ${templates || `<p class="empty">No templates yet.</p>`}
    <button type="button" class="btn btn-gold" data-action="add-outreach-template">Add template</button>
  </div>`;
}

function renderBacklinks(d) {
  const workflow = (d.workflow || []).join("\n");
  const items = (d.items || [])
    .map(
      (row, i) => `
      <div class="list-item">
        <div class="list-item-head">
          <strong>${escapeHtml(row.domain || "Prospect")}</strong>
          <button type="button" class="btn btn-ghost" data-action="del-backlink" data-index="${i}">Delete</button>
        </div>
        <div class="grid">
          ${field("Domain", `items.${i}.domain`, row.domain)}
          ${field("Live URL (when published)", `items.${i}.url`, row.url)}
          ${field("Target URL on our site", `items.${i}.targetUrl`, row.targetUrl)}
          ${field("Type", `items.${i}.type`, row.type)}
          ${field("Status (prospect/outreach-sent/in-progress/live/lost/rejected)", `items.${i}.status`, row.status)}
          ${field("Contact email", `items.${i}.contactEmail`, row.contactEmail)}
          ${field("DA estimate", `items.${i}.daEstimate`, row.daEstimate)}
          ${field("Anchor", `items.${i}.anchor`, row.anchor)}
          ${field("Next action", `items.${i}.nextAction`, row.nextAction)}
          ${field("Last touched (YYYY-MM-DD)", `items.${i}.lastTouched`, row.lastTouched)}
          ${field("Notes", `items.${i}.notes`, row.notes, "textarea")}
          ${field("ID", `items.${i}.id`, row.id)}
        </div>
      </div>`,
    )
    .join("");
  return `
  ${card(
    "Backlink tracker",
    `
    ${field("Title", "title", d.title)}
    ${field("Notes", "notes", d.notes, "textarea")}
    ${field("Optional Google Sheet URL", "sheetUrl", d.sheetUrl || "")}
    <div class="field full"><label>Workflow (one step per line)</label>
      <textarea data-path="workflow" data-array="true">${escapeHtml(workflow)}</textarea>
    </div>
  `,
  )}
  <div class="card">
    <h3>Outreach pipeline</h3>
    <p class="hint">Admin-only tracker. Prefer citations, partners, and resource mentions over bought links.</p>
    ${items || `<p class="empty">No prospects yet.</p>`}
    <button type="button" class="btn btn-gold" data-action="add-backlink">Add prospect</button>
  </div>`;
}

function renderSettings(d) {
  const pingEngines = d.seoPings?.engines || {};
  const pingRows = Object.keys(pingEngines)
    .map((name) => {
      const eng = pingEngines[name] || {};
      const ok = eng.ok ? "OK" : "fail";
      const status = eng.status ? ` HTTP ${eng.status}` : "";
      return `<li><code>${escapeHtml(name)}</code>: ${ok}${status}</li>`;
    })
    .join("");
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
    <h3>Auto sitemap &amp; AI discovery</h3>
    <p style="color:var(--muted);font-size:.92rem;line-height:1.55;margin:0 0 1rem">
      Every CMS save rebuilds <code>sitemap.xml</code>, <code>llms.txt</code>, and <code>robots.txt</code>,
      then notifies engines via <strong>IndexNow</strong> (Bing + partners) so Search Console and AI tools
      (ChatGPT, Claude, Perplexity, etc.) can discover fresh URLs. Submit
      <code>https://displayavenue.com/sitemap.xml</code> once in Google Search Console → Sitemaps if you have not already
      (Google no longer supports the old public ping URL).
    </p>
    <p style="margin:0 0 .75rem;font-size:.9rem">
      <strong>Last sync:</strong> ${escapeHtml(d.seoSyncedAt || "not yet")}<br />
      <strong>URLs in sitemap:</strong> ${escapeHtml(String(d.sitemapUrlCount ?? "—"))}<br />
      <strong>Sitemap:</strong> <a href="${escapeHtml(d.sitemapUrl || "https://displayavenue.com/sitemap.xml")}" target="_blank" rel="noreferrer">${escapeHtml(d.sitemapUrl || "https://displayavenue.com/sitemap.xml")}</a>
    </p>
    ${
      pingRows
        ? `<ul style="margin:0 0 1rem;padding-left:1.2rem;font-size:.88rem;color:var(--muted)">${pingRows}</ul>`
        : ""
    }
    <button type="button" class="btn" data-action="sync-seo">Rebuild sitemap &amp; ping engines now</button>
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
      image: "/images/awards/award-01.webp",
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
      image: "/images/certs/cert-01.webp",
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
  } else if (action === "sync-seo") {
    syncSeoArtifacts();
    return;
  } else if (action === "add-citation") {
    d.directories = d.directories || [];
    d.directories.unshift({
      id: `dir-${Date.now()}`,
      name: "New directory",
      url: "https://",
      category: "General",
      daHint: "Medium",
      napFields: "Name, address, phone, website",
      notes: "",
      priority: "Medium",
    });
  } else if (action === "del-citation") {
    if (!confirm("Delete this directory?")) return;
    d.directories.splice(Number(index), 1);
  } else if (action === "add-outreach-template") {
    d.templates = d.templates || [];
    d.templates.unshift({
      id: `tpl-${Date.now()}`,
      name: "New outreach template",
      subject: "Quick note about {{business_name}}",
      body: "Hi {{name}},\n\n",
    });
  } else if (action === "del-outreach-template") {
    if (!confirm("Delete this template?")) return;
    d.templates.splice(Number(index), 1);
  } else if (action === "add-backlink") {
    d.items = d.items || [];
    d.items.unshift({
      id: `bl-${Date.now()}`,
      domain: "example.com",
      url: "",
      targetUrl: "https://displayavenue.com/",
      type: "Directory",
      status: "prospect",
      contactEmail: "",
      daEstimate: "",
      anchor: "DisplayAvenue",
      notes: "",
      nextAction: "Send outreach",
      lastTouched: new Date().toISOString().slice(0, 10),
    });
  } else if (action === "del-backlink") {
    if (!confirm("Delete this prospect?")) return;
    d.items.splice(Number(index), 1);
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

async function syncSeoArtifacts() {
  try {
    toast("Rebuilding sitemap and pinging Google / Bing / IndexNow…");
    const res = await api("sync-seo", {});
    if (state.current === "settings") {
      await openCollection("settings");
    }
    const count = res.seo?.urlCount ?? "—";
    toast(`Sitemap synced (${count} URLs) and search engines notified`);
  } catch (e) {
    toast(e.message, "err");
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
        ${l.page ? `<p style="margin:0;font-size:.82rem;color:var(--muted)">Page: ${escapeHtml(l.page)}</p>` : ""}
        ${l.journey ? `<p style="margin:.25rem 0 0;font-size:.82rem;color:var(--muted)">${escapeHtml(l.journey)}</p>` : ""}
        ${l.message ? `<p style="margin:.35rem 0 0;color:var(--muted);font-size:.88rem">${escapeHtml(l.message)}</p>` : ""}
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
  if (state.current === "livechat") {
    openLiveChat();
    return;
  }
  if (state.current === "automation") {
    openAutomation();
    return;
  }
  if (state.current === "quotations") {
    openQuotations();
    return;
  }
  if (state.current === "invoices") {
    openInvoices();
    return;
  }
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
  $("#reload-btn").onclick = () => {
    if (state.current === "livechat") openLiveChat();
    else if (state.current === "quotations") openQuotations();
    else if (state.current === "invoices") openInvoices();
    else if (state.current) openCollection(state.current);
  };
  const previewBtn = $("#preview-btn");
  if (previewBtn) previewBtn.onclick = refreshPreview;

  const navToggle = $("#nav-toggle");
  const navClose = $("#nav-close");
  const navBackdrop = $("#nav-backdrop");
  if (navToggle) navToggle.onclick = () => setMobileNav(!document.body.classList.contains("nav-open"));
  if (navClose) navClose.onclick = () => setMobileNav(false);
  if (navBackdrop) navBackdrop.onclick = () => setMobileNav(false);
  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) setMobileNav(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMobileNav(false);
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

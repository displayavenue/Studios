(() => {
  const { industries, cities } = window.DA_DATA;
  const form = document.getElementById("extract-form");
  const industryEl = document.getElementById("industry");
  const cityEl = document.getElementById("city");
  const radiusEl = document.getElementById("radius");
  const focusEl = document.getElementById("focus");
  const btn = document.getElementById("extract-btn");
  const tbody = document.querySelector("#results tbody");
  const stats = document.getElementById("stats");
  const toolbar = document.getElementById("toolbar");
  const searchEl = document.getElementById("search");
  const statusLine = document.getElementById("status-line");
  const playbooksGrid = document.getElementById("playbooks-grid");
  const dirGrid = document.getElementById("dir-grid");

  let leads = [];
  let filtered = [];

  function industryById(id) {
    return industries.find((i) => i.id === id) || industries[0];
  }

  function cityById(id) {
    return cities.find((c) => c.id === id) || cities[0];
  }

  function fillSelects() {
    industryEl.innerHTML = industries
      .map((i) => `<option value="${i.id}">${i.title}</option>`)
      .join("");
    cityEl.innerHTML = cities.map((c) => `<option value="${c.id}">${c.title}</option>`).join("");
    industryEl.value = "restaurants";
    cityEl.value = "mumbai";
  }

  function scoreLead(lead) {
    let score = 40;
    if (!lead.website) score += 35;
    if (lead.phone) score += 15;
    if (!lead.phone) score -= 5;
    if (lead.website && /facebook|instagram|linktr\.ee/i.test(lead.website)) score += 10;
    if (!lead.name || lead.name.length < 3) score -= 10;
    return Math.max(5, Math.min(99, score));
  }

  function scoreClass(score) {
    if (score >= 75) return "score--hot";
    if (score >= 55) return "score--warm";
    return "score--cool";
  }

  function mapsLink(lead) {
    if (lead.lat && lead.lon) {
      return `https://www.google.com/maps?q=${lead.lat},${lead.lon}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + " " + (lead.city || ""))}`;
  }

  function waLink(phone, name, industryTitle) {
    const digits = String(phone || "").replace(/\D/g, "");
    if (!digits) return null;
    const local = digits.length === 10 ? `91${digits}` : digits;
    const text = encodeURIComponent(
      `Hi ${name || "there"}, this is DisplayAvenue. We help ${industryTitle} businesses get more qualified enquiries online. Open to a quick idea for ${leadCityLabel()}?`,
    );
    return `https://wa.me/${local}?text=${text}`;
  }

  function leadCityLabel() {
    return cityById(cityEl.value).title;
  }

  function applyFocus(list) {
    const focus = focusEl.value;
    if (focus === "no_website") return list.filter((l) => !l.website);
    if (focus === "has_phone") return list.filter((l) => l.phone);
    if (focus === "has_website") return list.filter((l) => l.website);
    return list;
  }

  function applySearch(list) {
    const q = (searchEl.value || "").trim().toLowerCase();
    if (!q) return list;
    return list.filter((l) =>
      [l.name, l.address, l.phone, l.website].filter(Boolean).join(" ").toLowerCase().includes(q),
    );
  }

  function updateStats(list) {
    const hot = list.filter((l) => !l.website).length;
    const phone = list.filter((l) => l.phone).length;
    const avg = list.length
      ? Math.round(list.reduce((s, l) => s + l.score, 0) / list.length)
      : 0;
    document.getElementById("stat-total").textContent = String(list.length);
    document.getElementById("stat-hot").textContent = String(hot);
    document.getElementById("stat-phone").textContent = String(phone);
    document.getElementById("stat-avg").textContent = String(avg);
    stats.hidden = false;
    toolbar.hidden = false;
  }

  function renderTable(list) {
    filtered = list;
    if (!list.length) {
      tbody.innerHTML = `<tr class="empty"><td colspan="7">No leads matched this filter. Try “All businesses” or a wider radius.</td></tr>`;
      return;
    }
    const ind = industryById(industryEl.value);
    tbody.innerHTML = list
      .map((lead) => {
        const wa = waLink(lead.phone, lead.name, ind.title);
        return `<tr>
          <td><span class="score ${scoreClass(lead.score)}">${lead.score}</span></td>
          <td><span class="biz-name">${escapeHtml(lead.name)}</span>
            <span class="biz-meta">${escapeHtml(lead.source || "OpenStreetMap")}</span></td>
          <td><span class="tag">${escapeHtml(ind.title)}</span>
            <span class="biz-meta">${escapeHtml(ind.sell)}</span></td>
          <td>${lead.phone ? escapeHtml(lead.phone) : "—"}</td>
          <td>${lead.website ? `<a href="${escapeAttr(absUrl(lead.website))}" target="_blank" rel="noreferrer">Site</a>` : "<em>None</em>"}</td>
          <td>${escapeHtml(lead.address || lead.city || "—")}</td>
          <td class="row-actions">
            <a href="${mapsLink(lead)}" target="_blank" rel="noreferrer">Maps</a>
            ${wa ? `<a href="${wa}" target="_blank" rel="noreferrer">WhatsApp</a>` : ""}
            <button type="button" data-copy="${escapeAttr(outreachLine(lead, ind))}">Copy pitch</button>
          </td>
        </tr>`;
      })
      .join("");
  }

  function outreachLine(lead, ind) {
    return `Prospect: ${lead.name}\nCity: ${lead.city || leadCityLabel()}\nPhone: ${lead.phone || "n/a"}\nWebsite: ${lead.website || "NONE (hot)"}\nAngle: ${ind.sell}\nMaps: ${mapsLink(lead)}`;
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, "&#39;");
  }

  function absUrl(url) {
    if (!url) return "#";
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url.replace(/^\/\//, "")}`;
  }

  function refreshView() {
    const list = applySearch(applyFocus(leads));
    updateStats(list);
    renderTable(list);
  }

  function normalizeLeads(rawLeads, city) {
    return (rawLeads || []).map((raw) => {
      const lead = {
        name: raw.name || "Unnamed business",
        phone: raw.phone || "",
        website: raw.website || "",
        address: raw.address || "",
        lat: raw.lat,
        lon: raw.lon,
        city: city.title,
        source: raw.source || "OpenStreetMap",
      };
      lead.score = scoreLead(lead);
      return lead;
    });
  }

  function overpassQuery(industry, city, radiusKm) {
    const radiusM = Math.round(radiusKm * 1000);
    return `[out:json][timeout:25];\n(${industry.osm}(around:${radiusM},${city.lat},${city.lon});\n);\nout center tags 80;`;
  }

  function parseOverpass(json, city) {
    const seen = new Set();
    const out = [];
    for (const el of json.elements || []) {
      const tags = el.tags || {};
      const name = (tags.name || "").trim();
      if (!name) continue;
      const key = name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const phone = tags.phone || tags["contact:phone"] || tags.mobile || "";
      const website = tags.website || tags["contact:website"] || tags.url || "";
      const parts = [
        tags["addr:housenumber"],
        tags["addr:street"],
        tags["addr:suburb"] || tags["addr:neighbourhood"],
        tags["addr:city"],
        tags["addr:postcode"],
      ].filter(Boolean);
      out.push({
        name,
        phone,
        website,
        address: parts.join(", ") || city.title,
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        source: "OpenStreetMap",
      });
    }
    return out;
  }

  async function extractViaBrowser(industry, city, radiusKm) {
    const query = overpassQuery(industry, city, radiusKm);
    const endpoints = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
    ];
    let lastErr = null;
    for (const endpoint of endpoints) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 28000);
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({ data: query }),
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return parseOverpass(json, city);
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr || new Error("Overpass blocked");
  }

  async function extractLeads(e) {
    e.preventDefault();
    const industry = industryById(industryEl.value);
    const city = cityById(cityEl.value);
    const radius = Number(radiusEl.value) || 10;
    btn.disabled = true;
    btn.textContent = "Extracting…";
    statusLine.textContent = `Querying open map data around ${city.title} for ${industry.title}…`;
    tbody.innerHTML = `<tr class="empty"><td colspan="7">Extracting businesses…</td></tr>`;

    try {
      let rawLeads = [];
      let provider = "OpenStreetMap";

      // Prefer browser → Overpass (works when Hostinger outbound is slow)
      try {
        rawLeads = await extractViaBrowser(industry, city, radius);
        provider = "OpenStreetMap (browser)";
      } catch (browserErr) {
        const res = await fetch("./api/extract.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            industry: industry.id,
            osm: industry.osm,
            city: city.title,
            lat: city.lat,
            lon: city.lon,
            radiusKm: radius,
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          throw new Error(data.error || browserErr.message || "Extract failed");
        }
        rawLeads = data.leads || [];
        provider = data.provider || "OpenStreetMap";
      }

      leads = normalizeLeads(rawLeads, city);
      leads.sort((a, b) => b.score - a.score);
      if (!leads.length) throw new Error("No businesses found in this radius");
      statusLine.textContent = `Loaded ${leads.length} businesses from ${provider} · ${city.title} · ${industry.title}. Hot score = no website + phone present.`;
      refreshView();
      renderDirectories();
    } catch (err) {
      console.error(err);
      statusLine.textContent = `Live map extract unavailable (${err.message}). Showing industry target samples for ${industry.title} in ${city.title} — use Directory shortcuts for live lists.`;
      leads = demoLeads(industry, city).map((lead) => ({ ...lead, score: scoreLead(lead) }));
      leads.sort((a, b) => b.score - a.score);
      refreshView();
      renderDirectories();
    } finally {
      btn.disabled = false;
      btn.textContent = "Extract leads";
    }
  }

  function demoLeads(industry, city) {
    const niches = industry.targets || ["Local business"];
    return niches.flatMap((niche, idx) => [
      {
        name: `${niche} Co. ${city.title}`,
        phone: idx % 2 === 0 ? `98${String(10000000 + idx * 111).slice(0, 8)}` : "",
        website: idx % 3 === 0 ? "" : `https://example-${industry.id}-${idx}.in`,
        address: `${city.title} · sample ${niche.toLowerCase()} cluster`,
        lat: city.lat + idx * 0.01,
        lon: city.lon + idx * 0.008,
        city: city.title,
        source: "Demo sample (replace with live extract)",
      },
      {
        name: `${city.title} ${niche} Hub`,
        phone: `97${String(20000000 + idx * 222).slice(0, 8)}`,
        website: "",
        address: `${city.title} commercial area`,
        lat: city.lat - idx * 0.008,
        lon: city.lon + idx * 0.006,
        city: city.title,
        source: "Demo sample (replace with live extract)",
      },
    ]);
  }

  function exportCsv() {
    const rows = [
      ["Score", "Business", "Industry", "Phone", "Website", "Address", "City", "Maps"],
      ...filtered.map((l) => [
        l.score,
        l.name,
        industryById(industryEl.value).title,
        l.phone,
        l.website,
        l.address,
        l.city,
        mapsLink(l),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `displayavenue-data-${industryEl.value}-${cityEl.value}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function copyOutreachPack() {
    const ind = industryById(industryEl.value);
    const top = filtered.slice(0, 15);
    const text = [
      `DisplayAvenue Data · Outreach pack`,
      `Industry: ${ind.title}`,
      `City: ${leadCityLabel()}`,
      `Sell angle: ${ind.sell}`,
      "",
      ...top.map((l, i) => `${i + 1}. ${outreachLine(l, ind)}`),
    ].join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      statusLine.textContent = `Copied outreach pack for top ${top.length} leads.`;
    });
  }

  function renderPlaybooks() {
    playbooksGrid.innerHTML = industries
      .map(
        (ind, i) => `<article class="card" style="animation-delay:${i * 40}ms">
        <h3>${escapeHtml(ind.title)}</h3>
        <p><strong>Sell:</strong> ${escapeHtml(ind.sell)}</p>
        <ul>${ind.targets.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul>
      </article>`,
      )
      .join("");
  }

  function renderDirectories() {
    const ind = industryById(industryEl.value);
    const city = cityById(cityEl.value);
    const q = encodeURIComponent(`${ind.maps} ${city.title}`);
    const links = [
      {
        title: "Google Maps",
        href: `https://www.google.com/maps/search/?api=1&query=${q}`,
        blurb: "Fastest density view for local SMEs.",
      },
      {
        title: "IndiaMART",
        href: `https://dir.indiamart.com/search.mp?ss=${encodeURIComponent(ind.indiamart + " " + city.title)}`,
        blurb: "B2B suppliers and manufacturers.",
      },
      {
        title: "Justdial",
        href: `https://www.justdial.com/${encodeURIComponent(city.title)}/${encodeURIComponent(ind.justdial)}`,
        blurb: "Phone-first local listings.",
      },
      {
        title: "LinkedIn search",
        href: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(ind.linkedin + " " + city.title)}`,
        blurb: "Decision-makers for warmer outreach.",
      },
      {
        title: "Google Business text search",
        href: `https://www.google.com/search?q=${encodeURIComponent(ind.maps + " in " + city.title)}`,
        blurb: "SERP + Maps pack for digital-gap spotting.",
      },
      {
        title: "Sulekha",
        href: `https://www.sulekha.com/${encodeURIComponent(ind.justdial.toLowerCase().replace(/\s+/g, "-"))}/${encodeURIComponent(city.title.toLowerCase())}`,
        blurb: "Services and local demand intents.",
      },
    ];
    dirGrid.innerHTML = links
      .map(
        (l) => `<article class="card">
        <h3>${escapeHtml(l.title)}</h3>
        <p>${escapeHtml(l.blurb)}</p>
        <p style="margin-top:.7rem"><a href="${l.href}" target="_blank" rel="noreferrer">Open extract view →</a></p>
      </article>`,
      )
      .join("");
  }

  tbody.addEventListener("click", (e) => {
    const btnEl = e.target.closest("button[data-copy]");
    if (!btnEl) return;
    navigator.clipboard.writeText(btnEl.getAttribute("data-copy") || "");
    statusLine.textContent = "Pitch copied.";
  });

  form.addEventListener("submit", extractLeads);
  searchEl.addEventListener("input", refreshView);
  focusEl.addEventListener("change", refreshView);
  industryEl.addEventListener("change", renderDirectories);
  cityEl.addEventListener("change", renderDirectories);
  document.getElementById("export-csv").addEventListener("click", exportCsv);
  document.getElementById("copy-outreach").addEventListener("click", copyOutreachPack);

  fillSelects();
  renderPlaybooks();
  renderDirectories();
})();

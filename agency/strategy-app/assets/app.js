(() => {
  const { industries, channels, catalog } = window.DA_STRATEGY;
  const engine = window.DA_STRATEGY_ENGINE;

  const form = document.getElementById("strategy-form");
  const industryEl = document.getElementById("industry");
  const channelGrid = document.getElementById("channel-grid");
  const serviceGrid = document.getElementById("service-grid");
  const catalogEl = document.getElementById("catalog");
  const planSection = document.getElementById("plan");
  const planOutput = document.getElementById("plan-output");
  const planTitle = document.getElementById("plan-title");
  const planSub = document.getElementById("plan-sub");
  let lastPlanText = "";
  let lastPlan = null;

  function fillIndustries() {
    industryEl.innerHTML = industries
      .map((i) => `<option value="${i.id}">${i.title}</option>`)
      .join("");
    industryEl.value = "healthcare";
  }

  function fillChannels() {
    channelGrid.innerHTML = channels
      .map(
        (c) => `<label class="chip"><input type="checkbox" name="channel" value="${c.id}" ${
          c.default ? "checked" : ""
        } /> ${c.title}</label>`,
      )
      .join("");
  }

  function allServices() {
    return catalog.flatMap((g) => g.items);
  }

  function fillServices(selectedIds) {
    const selected = new Set(selectedIds);
    serviceGrid.innerHTML = allServices()
      .map(
        (s) => `<label class="chip"><input type="checkbox" name="service" value="${s.id}" ${
          selected.has(s.id) ? "checked" : ""
        } /> ${s.label}</label>`,
      )
      .join("");
  }

  function selectedChannels() {
    return [...form.querySelectorAll('input[name="channel"]:checked')].map((el) => el.value);
  }

  function selectedServices() {
    return [...form.querySelectorAll('input[name="service"]:checked')].map((el) => el.value);
  }

  function defaultServicesFromChannels() {
    const ids = new Set(["analytics", "landing-pages", "corporate-websites", "ai-chatbots"]);
    channels.forEach((c) => {
      if (selectedChannels().includes(c.id)) ids.add(c.service);
    });
    const goal = form.goal.value;
    if (goal === "sales" || goal === "ecommerce") {
      ids.add("shopify");
      ids.add("cro");
    }
    if (goal === "pipeline") {
      ids.add("linkedin-ads");
      ids.add("crm");
      ids.add("content-marketing");
    }
    if (form.industry.value === "ecommerce" || form.industry.value === "fashion") {
      ids.add("product-shoots");
      ids.add("meta-ads");
    }
    return [...ids];
  }

  function renderCatalog() {
    catalogEl.innerHTML = catalog
      .map(
        (group) => `<article class="catalog-group">
        <h3>${group.title}</h3>
        <div class="catalog-links">
          ${group.items
            .map(
              (item) =>
                `<a href="https://displayavenue.com${item.href}" target="_blank" rel="noreferrer">${item.label}</a>`,
            )
            .join("")}
        </div>
      </article>`,
      )
      .join("");
  }

  function esc(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderPlan(plan) {
    lastPlan = plan;
    planSection.hidden = false;
    planTitle.textContent = plan.title;
    planSub.textContent = `${plan.budgetLabel}/month · Goal: ${plan.goalLabel} · ${plan.industryTitle}`;

    planOutput.innerHTML = `
      <article class="plan-block">
        <h3>Executive summary</h3>
        <p>${esc(plan.summary)}</p>
        <div class="kpi-grid">
          ${plan.kpis.map((k) => `<div class="kpi"><strong>${esc(k.value)}</strong><span>${esc(k.label)}</span></div>`).join("")}
        </div>
      </article>

      <article class="plan-block">
        <h3>Budget split</h3>
        <div class="split-grid">
          ${plan.splits
            .map((s) => {
              const title = (channels.find((c) => c.id === s.id) || {}).title || s.id;
              return `<div class="split"><strong>${engine.inr(s.amount)}</strong><span>${esc(title)} · ${s.pct}%</span></div>`;
            })
            .join("")}
        </div>
      </article>

      <article class="plan-block">
        <h3>Lead generation funnel</h3>
        ${plan.funnel
          .map(
            (f) => `<p><strong>${esc(f.stage)}</strong></p><ul>${f.items
              .map((i) => `<li>${esc(i)}</li>`)
              .join("")}</ul>`,
          )
          .join("")}
      </article>

      <article class="plan-block">
        <h3>Channel playbooks (Google, Meta & more)</h3>
        ${plan.channels
          .map(
            (c) => `<p><strong>${esc(c.title)}</strong></p><ul>${c.bullets
              .map((b) => `<li>${esc(b)}</li>`)
              .join("")}</ul>`,
          )
          .join("")}
      </article>

      <article class="plan-block">
        <h3>Sales conversion system</h3>
        <ul>${plan.sales.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
      </article>

      <article class="plan-block">
        <h3>90-day roadmap</h3>
        ${plan.roadmap
          .map(
            (r) => `<p><strong>${esc(r.title)}</strong></p><ul>${r.items
              .map((i) => `<li>${esc(i)}</li>`)
              .join("")}</ul>`,
          )
          .join("")}
      </article>

      <article class="plan-block">
        <h3>Recommended DisplayAvenue services</h3>
        <ul>
          ${plan.services
            .map(
              (s) =>
                `<li><a href="https://displayavenue.com${s.href}" target="_blank" rel="noreferrer">${esc(s.label)}</a> <em>(${esc(s.group)})</em></li>`,
            )
            .join("")}
        </ul>
      </article>
    `;

    lastPlanText = [
      plan.title,
      plan.sub || planSub.textContent,
      "",
      "SUMMARY",
      plan.summary,
      "",
      "KPIs",
      ...plan.kpis.map((k) => `- ${k.label}: ${k.value}`),
      "",
      "BUDGET SPLIT",
      ...plan.splits.map((s) => {
        const title = (channels.find((c) => c.id === s.id) || {}).title || s.id;
        return `- ${title}: ${engine.inr(s.amount)} (${s.pct}%)`;
      }),
      "",
      "FUNNEL",
      ...plan.funnel.flatMap((f) => [`${f.stage}:`, ...f.items.map((i) => `  - ${i}`)]),
      "",
      "CHANNELS",
      ...plan.channels.flatMap((c) => [`${c.title}:`, ...c.bullets.map((b) => `  - ${b}`)]),
      "",
      "SALES",
      ...plan.sales.map((s) => `- ${s}`),
      "",
      "90-DAY PLAN",
      ...plan.roadmap.flatMap((r) => [`${r.title}:`, ...r.items.map((i) => `  - ${i}`)]),
      "",
      "SERVICES",
      ...plan.services.map((s) => `- ${s.label} (${s.group}) — https://displayavenue.com${s.href}`),
      "",
      "Built with DisplayAvenue Strategy — https://strategy.displayavenue.com/",
    ].join("\n");

    const wa = document.getElementById("wa-plan");
    const msg = encodeURIComponent(
      `Hi DisplayAvenue, I generated a strategy for ${plan.title}.\nBudget ${plan.budgetLabel}/mo · Goal: ${plan.goalLabel}.\nPlease review and propose next steps.`,
    );
    wa.href = `https://wa.me/919222122333?text=${msg}`;

    planSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = {
      business: form.business.value.trim() || "Your Business",
      industry: form.industry.value,
      goal: form.goal.value,
      budget: Number(form.budget.value) || 50000,
      cycle: form.cycle.value,
      capacity: form.capacity.value,
      channels: selectedChannels(),
      services: selectedServices(),
    };
    if (!input.channels.length) {
      alert("Select at least one priority channel.");
      return;
    }
    const plan = engine.build(input, catalog);
    renderPlan(plan);
  });

  channelGrid.addEventListener("change", () => {
    fillServices(defaultServicesFromChannels());
  });

  document.getElementById("copy-plan").addEventListener("click", () => {
    if (!lastPlanText) return;
    navigator.clipboard.writeText(lastPlanText).then(() => {
      planSub.textContent = "Plan copied to clipboard.";
    });
  });

  document.getElementById("print-plan").addEventListener("click", () => {
    window.print();
  });

  fillIndustries();
  fillChannels();
  fillServices(defaultServicesFromChannels());
  renderCatalog();
})();

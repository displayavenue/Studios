window.DA_STRATEGY_ENGINE = {
  inr(n) {
    return "₹" + Number(n).toLocaleString("en-IN");
  },

  goalLabel(goal) {
    return (
      {
        leads: "qualified leads",
        sales: "direct sales / bookings",
        pipeline: "B2B sales pipeline",
        brand: "brand awareness",
        retention: "retention & LTV",
      }[goal] || goal
    );
  },

  industryAngles(industryId) {
    const map = {
      healthcare: {
        offer: "appointment / consultation offers",
        proof: "doctor credentials, reviews, before-after (compliant)",
        keywords: "near me treatments, specialist, clinic booking",
        objection: "trust & safety",
      },
      "real-estate": {
        offer: "site visit + price sheet / brochure",
        proof: "project gallery, RERA, location advantages",
        keywords: "flats in [area], 2BHK, plots, commercial lease",
        objection: "price & location credibility",
      },
      education: {
        offer: "demo class / counselling call",
        proof: "results, faculty, placements",
        keywords: "coaching near me, admissions, courses",
        objection: "outcomes & fees",
      },
      restaurants: {
        offer: "table booking / festive menu / delivery promo",
        proof: "food photos, ratings, influencer reels",
        keywords: "best [cuisine] near me, cafe, buffet",
        objection: "taste & wait time perception",
      },
      ecommerce: {
        offer: "first-order discount + free shipping",
        proof: "UGC, reviews, unboxing",
        keywords: "buy [product], best [category] online",
        objection: "price vs quality",
      },
      saas: {
        offer: "demo / free trial / ROI calculator",
        proof: "case studies, integrations, security",
        keywords: "best [category] software, alternatives",
        objection: "implementation effort",
      },
      manufacturing: {
        offer: "RFQ + catalogue download",
        proof: "capacity, certifications, clients",
        keywords: "[product] manufacturers, suppliers India",
        objection: "MOQ & lead time",
      },
      hospitality: {
        offer: "direct booking rate vs OTA",
        proof: "rooms, amenities, guest reviews",
        keywords: "hotels in [city], resorts, banquet",
        objection: "price transparency",
      },
      finance: {
        offer: "free consultation / eligibility check",
        proof: "compliance, testimonials, process clarity",
        keywords: "CA near me, insurance, loan, tax filing",
        objection: "trust & confidentiality",
      },
      b2b: {
        offer: "strategy call + capability deck",
        proof: "logos, case studies, SLAs",
        keywords: "[service] company, agency, consultant",
        objection: "ROI clarity",
      },
      startups: {
        offer: "launch offer / waitlist / demo",
        proof: "founder story, early traction",
        keywords: "product category, alternatives",
        objection: "risk of new brand",
      },
    };
    return (
      map[industryId] || {
        offer: "clear primary CTA (call / form / WhatsApp)",
        proof: "reviews, portfolio, credentials",
        keywords: "category + city + intent terms",
        objection: "trust and price clarity",
      }
    );
  },

  budgetSplit(channels, budget, goal) {
    const weights = {};
    const set = new Set(channels);
    const add = (id, w) => {
      if (set.has(id)) weights[id] = (weights[id] || 0) + w;
    };

    add("google-ads", goal === "brand" ? 18 : 28);
    add("meta-ads", goal === "pipeline" ? 14 : 24);
    add("seo", 12);
    add("local-seo", goal === "pipeline" ? 6 : 10);
    add("linkedin-ads", goal === "pipeline" || goal === "leads" ? 16 : 8);
    add("social", 8);
    add("email", 5);
    add("content", 6);
    add("influencer", 7);
    add("cro", 8);
    add("whatsapp", 6);

    const totalW = Object.values(weights).reduce((a, b) => a + b, 0) || 1;
    const rows = Object.entries(weights).map(([id, w]) => {
      const pct = Math.round((w / totalW) * 100);
      const amount = Math.round((budget * w) / totalW / 500) * 500;
      return { id, pct, amount };
    });
    // normalize pct to ~100
    const pctSum = rows.reduce((a, r) => a + r.pct, 0);
    if (rows.length && pctSum !== 100) rows[0].pct += 100 - pctSum;
    return rows.sort((a, b) => b.amount - a.amount);
  },

  channelPlay(id, ctx) {
    const { business, industryTitle, angles, goal } = ctx;
    const plays = {
      "google-ads": {
        title: "Google Ads",
        bullets: [
          `Search campaigns on high-intent terms: ${angles.keywords}.`,
          `Brand + competitor conquest (careful bidding) for ${business}.`,
          `Use call + WhatsApp + lead form extensions; send traffic to focused landing pages.`,
          goal === "sales"
            ? "Optimize to purchases/bookings with enhanced conversions."
            : "Optimize to qualified leads (not raw form fills).",
          "Weekly search-term mining; negate junk queries fast.",
        ],
      },
      "meta-ads": {
        title: "Meta Ads (Facebook / Instagram)",
        bullets: [
          `Cold prospecting creatives around ${angles.offer}.`,
          "Retarget site visitors, video viewers, and form openers for 7–30 days.",
          `Creative angles: ${angles.proof}; test 3 hooks × 2 formats (reel + static).`,
          "Advantage+ or ASC only after creative winners exist.",
          "Lead ads OK for speed; prefer on-site forms when quality matters.",
        ],
      },
      seo: {
        title: "SEO",
        bullets: [
          `Map service/location pages for ${industryTitle} demand.`,
          "Technical hygiene: speed, indexation, schema, internal links.",
          "Publish weekly intent content tied to paid keyword gaps.",
          "Build citations + digital PR instead of buying spam links.",
        ],
      },
      "local-seo": {
        title: "Local SEO / Google Business Profile",
        bullets: [
          "Complete GBP categories, services, products, photos weekly.",
          "Review engine: ask after every happy job; reply to all reviews.",
          "NAP consistency across Justdial / IndiaMART / maps listings.",
          "Post offers and FAQs to support local pack rankings.",
        ],
      },
      "linkedin-ads": {
        title: "LinkedIn Ads",
        bullets: [
          "Job title + seniority + industry targeting for decision makers.",
          "Lead gen forms with soft CTA (guide / audit / demo).",
          "Thought-leadership creatives + case study document ads.",
          "Route leads into CRM with SDR follow-up SLA < 1 business day.",
        ],
      },
      social: {
        title: "Social Media Marketing",
        bullets: [
          "3–5 posts/week: proof, offer, process, FAQs, UGC.",
          "Short-form video as always-on creative farm for ads.",
          "Community replies and DMs treated as sales queue.",
        ],
      },
      email: {
        title: "Email Marketing",
        bullets: [
          "Welcome + nurture sequence tied to lead magnet.",
          "Weekly value newsletter; bi-weekly offer push.",
          "Segment by intent (demo, pricing, abandoned form).",
        ],
      },
      content: {
        title: "Content Marketing",
        bullets: [
          "Pillar pages + comparison pages for category keywords.",
          "Case studies that sell the next similar client.",
          "Repurpose every asset into ads, email, and sales decks.",
        ],
      },
      influencer: {
        title: "Influencer Marketing",
        bullets: [
          "Micro-creators in city/niche for trust transfer.",
          "Whitelisting / spark ads on winning organic posts.",
          "Track unique codes or UTMs per creator.",
        ],
      },
      cro: {
        title: "CRO & Landing Pages",
        bullets: [
          "One page = one offer = one CTA.",
          `Above-the-fold promise: ${angles.offer}.`,
          "Social proof, FAQ objection handling, fast mobile form.",
          "A/B test headline, hero, and CTA weekly after traffic is stable.",
        ],
      },
      whatsapp: {
        title: "WhatsApp / Sales Ops",
        bullets: [
          "Instant WhatsApp CTA from ads and site.",
          "Saved replies + qualification checklist for speed-to-lead.",
          "Missed-call / after-hours auto reply with booking link.",
          "Daily pipeline review: new → contacted → meeting → won/lost.",
        ],
      },
    };
    return plays[id] || { title: id, bullets: ["Execute with clear KPI and weekly optimization."] };
  },

  funnel(goal, angles) {
    return [
      {
        stage: "Attract",
        items: [
          "Paid search + social reach on intent audiences",
          "SEO / GBP for compounding discovery",
          `Hook creatives around ${angles.offer}`,
        ],
      },
      {
        stage: "Capture",
        items: [
          "Landing page or lead form with single CTA",
          "WhatsApp / call click-to-connect",
          "UTM + CRM tagging on every lead",
        ],
      },
      {
        stage: "Qualify",
        items: [
          "5-question scorecard (budget, timeline, fit, authority, need)",
          goal === "pipeline" ? "SDR discovery call" : "Speed-to-lead < 5 minutes",
          `Handle main objection: ${angles.objection}`,
        ],
      },
      {
        stage: "Convert",
        items: [
          goal === "sales" ? "Checkout / booking flow" : "Proposal / consultation close",
          "Proof pack ready (reviews, case studies, demos)",
          "Follow-up cadence Day 0 / 1 / 3 / 7",
        ],
      },
      {
        stage: "Retain",
        items: [
          "Onboarding + review request",
          "Email/WhatsApp nurture for repeat & referrals",
          "Upsell adjacent services from DisplayAvenue stack",
        ],
      },
    ];
  },

  kpis(budget, goal, cycle) {
    const cpl =
      goal === "brand"
        ? Math.round(budget / 200)
        : goal === "pipeline"
          ? Math.round(budget / 25)
          : Math.round(budget / 40);
    const leads = Math.max(8, Math.round(budget / Math.max(cpl, 1)));
    const closeRate = cycle === "instant" ? 0.28 : cycle === "short" ? 0.18 : cycle === "medium" ? 0.12 : 0.08;
    const customers = Math.max(1, Math.round(leads * closeRate));
    return [
      { label: "Target leads / mo", value: String(leads) },
      { label: "Target CPL band", value: this.inr(Math.round(cpl * 0.75)) + "–" + this.inr(Math.round(cpl * 1.25)) },
      { label: "Expected closes / mo", value: String(customers) },
      { label: "Speed-to-lead SLA", value: cycle === "long" ? "< 4 business hrs" : "< 5 minutes" },
    ];
  },

  days90(channels, industryTitle) {
    return [
      {
        title: "Days 1–30 · Foundation",
        items: [
          "Tracking: GA4, Ads pixels, WhatsApp/call logging, CRM pipeline",
          "Offer + landing page + creative pack (8–12 assets)",
          `Launch Google and/or Meta with tight ${industryTitle} geo + intent`,
          "Sales scripts + response SLAs live",
        ],
      },
      {
        title: "Days 31–60 · Optimize",
        items: [
          "Kill losers; scale winners 20–30% weekly",
          "Expand keyword / audience based on converting cohorts",
          "CRO tests on headline + form friction",
          channels.includes("seo") || channels.includes("local-seo")
            ? "Publish 4 SEO/GBP assets; citation cleanup"
            : "Add remarketing + email nurture",
        ],
      },
      {
        title: "Days 61–90 · Scale",
        items: [
          "Increase budget on channels beating CPL/ROAS targets",
          "Case study from early wins → new ads + sales deck",
          "Introduce secondary channels (LinkedIn / influencers / automation)",
          "Quarterly strategy review with DisplayAvenue",
        ],
      },
    ];
  },

  salesPlay(capacity, cycle, angles) {
    const owner =
      capacity === "founder"
        ? "Founder handles all hot leads personally"
        : capacity === "dedicated"
          ? "Dedicated sales owner in CRM with managers reviewing daily"
          : "Front-desk / small team with shared WhatsApp inbox";
    return [
      owner,
      `Primary CTA: ${angles.offer}`,
      cycle === "long"
        ? "Multi-thread stakeholders; send deck + ROI one-pager after discovery"
        : "Same-day proposal or booking link after qualification",
      "Follow-up sequence: call → WhatsApp → email → reminder",
      "Lost-lead reason codes every week to feed creative & offer tests",
    ];
  },

  build(input, catalog) {
    const angles = this.industryAngles(input.industry);
    const industryTitle =
      (window.DA_STRATEGY.industries.find((i) => i.id === input.industry) || {}).title || input.industry;
    const ctx = {
      business: input.business,
      industryTitle,
      angles,
      goal: input.goal,
    };
    const splits = this.budgetSplit(input.channels, input.budget, input.goal);
    const channelIds = input.channels;
    const serviceIds = new Set(input.services);
    // ensure channel-linked services included
    window.DA_STRATEGY.channels.forEach((c) => {
      if (channelIds.includes(c.id)) serviceIds.add(c.service);
    });

    const serviceRows = [];
    catalog.forEach((group) => {
      group.items.forEach((item) => {
        if (serviceIds.has(item.id)) serviceRows.push({ ...item, group: group.title });
      });
    });

    return {
      title: `${input.business} · ${industryTitle} growth strategy`,
      summary: `Drive ${this.goalLabel(input.goal)} for ${input.business} (${industryTitle}) with a ${this.inr(input.budget)}/month mix across ${channelIds.length} channels, tight landing/CRO, and a sales SLA that protects paid spend.`,
      kpis: this.kpis(input.budget, input.goal, input.cycle),
      splits,
      funnel: this.funnel(input.goal, angles),
      channels: channelIds.map((id) => this.channelPlay(id, ctx)),
      sales: this.salesPlay(input.capacity, input.cycle, angles),
      roadmap: this.days90(channelIds, industryTitle),
      services: serviceRows,
      angles,
      industryTitle,
      budgetLabel: this.inr(input.budget),
      goalLabel: this.goalLabel(input.goal),
    };
  },
};

import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { SEO, FAQPageSchema, BreadcrumbSchema } from "../components/SEO";
import { useCms } from "../cms/CmsProvider";
import { getStoredUtm, getVisitorId } from "../components/VisitorTracker";
import { whatsappWithText } from "../lib/geoContext";
import "./AgencyPartner.css";

const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

const WHY = [
  {
    title: "30+ in-house professionals",
    text: "Specialists across marketing, creative, technology, and digital transformation — without building that payroll yourself.",
  },
  {
    title: "360° digital capabilities",
    text: "From ads and SEO to websites, ecommerce, CRM, AI automation, and creative production.",
  },
  {
    title: "Your client stays your client",
    text: "We respect your relationship and operate by the partnership model you choose.",
  },
  {
    title: "No bypassing",
    text: "For partner-managed projects, we do not approach your client to sell directly.",
  },
  {
    title: "Transparent pricing",
    text: "Clear scope, clear costing, clear deliverables — before work starts.",
  },
  {
    title: "Scale without hiring",
    text: "Take larger projects and more services without immediately expanding headcount.",
  },
];

const MODELS = [
  {
    id: "refer",
    num: "01",
    title: "Refer & Earn",
    lead: "Introduce the client. Earn from the project.",
    body: "Have a business contact who needs digital marketing, websites, software, branding, or digital transformation? Introduce the opportunity. You earn 10% of the project management cost — we handle qualification and execution.",
    steps: [
      "Refer — introduce a business or project",
      "We qualify — understand the need and prepare the proposal",
      "Project starts — we handle agreed execution",
      "You earn — 10% of project management cost (per agreed terms)",
    ],
    perfectFor: [
      "Business consultants",
      "Freelancers",
      "Influencers",
      "IT consultants",
      "Designers",
      "Sales professionals",
      "Entrepreneurs",
    ],
    cta: "Start referring",
    href: "#partner-form",
  },
  {
    id: "lead",
    num: "02",
    title: "You lead. We execute.",
    lead: "Your agency stays in control of the client.",
    body: "You already have the client and own the relationship. Send us the requirement — we execute the agreed scope behind the scenes. We do not talk to your client unless you authorize it.",
    youManage: [
      "Client relationship & meetings",
      "Strategy ownership",
      "Communication",
      "Commercial relationship",
      "Final approvals",
    ],
    weManage: [
      "Research, design, development",
      "SEO & paid advertising",
      "Content, social, video",
      "Technology & automation",
      "Reporting support",
    ],
    cta: "Outsource a project",
    href: "#partner-form",
  },
  {
    id: "white-label",
    num: "03",
    title: "White-label team",
    lead: "Your agency brand. Our execution team.",
    body: "Offer services your current team cannot run alone. White-label DisplayAvenue as an extension of your team under your brand and operating model. Your client sees your agency — we work behind the scenes.",
    offer: [
      "Digital marketing & lead generation",
      "SEO, Google Ads, Meta Ads",
      "Websites, Shopify, WordPress, Magento",
      "CRM, ERP, AI & automation",
      "UI/UX, design, video, branding",
    ],
    cta: "Build my white-label team",
    href: "#partner-form",
  },
];

const PRINCIPLES = [
  {
    n: "01",
    title: "Your relationship comes first",
    text: "The partner owns the client relationship according to the agreed model.",
  },
  {
    n: "02",
    title: "No bypassing",
    text: "We do not intentionally bypass a partner to pursue direct business with their client.",
  },
  {
    n: "03",
    title: "Controlled communication",
    text: "For back-end execution, we communicate through you unless direct contact is approved.",
  },
  {
    n: "04",
    title: "Transparent commercials",
    text: "Pricing, scope, and deliverables are agreed clearly before execution.",
  },
  {
    n: "05",
    title: "Professional execution",
    text: "Work is assigned to the right specialists inside our team.",
  },
  {
    n: "06",
    title: "Long-term thinking",
    text: "We build lasting agency relationships — not one-time transactions.",
  },
];

const CAPABILITIES = [
  {
    title: "Digital marketing",
    items: [
      "SEO · Local SEO · AI SEO / GEO",
      "Google Ads · Meta Ads · LinkedIn Ads",
      "Lead generation · Performance marketing",
      "Social · Content · Email · Influencer",
      "Marketing automation · Analytics",
    ],
  },
  {
    title: "Web & ecommerce",
    items: [
      "Corporate sites · Landing pages",
      "WordPress · Webflow",
      "Shopify · WooCommerce · Magento",
      "Custom ecommerce & web apps",
    ],
  },
  {
    title: "Technology & AI",
    items: [
      "CRM · ERP · SaaS development",
      "AI chatbots · Agents · Workflows",
      "Custom software · Mobile apps",
      "Admin dashboards · Cloud & DevOps",
    ],
  },
  {
    title: "Creative & production",
    items: [
      "Branding · Graphic design · UI/UX",
      "Photography · Videography",
      "Video editing · Motion · Animation",
      "Product shoots · Brand films",
    ],
  },
];

const WHO = [
  "Digital marketing agencies needing capacity or specialists",
  "Web companies that want to add growth services",
  "Freelancers & consultants taking larger projects",
  "Branding agencies adding digital and technology",
  "IT companies needing marketing and creative support",
  "Social agencies needing ads, design, and tech backend",
  "Business consultants packaging digital solutions",
  "New agencies scaling without large fixed costs",
];

const STEPS = [
  { n: "01", title: "Connect", text: "Tell us about your agency, clients, and needs." },
  { n: "02", title: "Select your model", text: "Refer & Earn, Back-End Execution, or White-Label." },
  { n: "03", title: "Agree commercials", text: "Scope, pricing, responsibilities, and communication." },
  { n: "04", title: "Start execution", text: "Our specialists get to work." },
  { n: "05", title: "Scale", text: "Expand services as your pipeline grows." },
];

const FAQS = [
  {
    question: "Will DisplayAvenue approach my client directly?",
    answer:
      "For partner-managed projects, we respect the partner relationship and do not bypass you to pursue direct business. Client-facing involvement follows the agreed partnership model.",
  },
  {
    question: "Can I use my own pricing?",
    answer:
      "Yes. In back-end and white-label models, your agency sets its client commercial model while DisplayAvenue provides the agreed execution service.",
  },
  {
    question: "Will the client know DisplayAvenue is involved?",
    answer:
      "That depends on the model. With white-label / back-end execution, your agency can remain the client-facing brand.",
  },
  {
    question: "Can you work under my agency’s brand?",
    answer: "Yes. That is the purpose of Model 3 — White-Label / Agency Team.",
  },
  {
    question: "Do you only provide digital marketing?",
    answer:
      "No. We operate across digital marketing, web, ecommerce, technology, AI, automation, creative, and broader digital transformation.",
  },
  {
    question: "Can I start with one project?",
    answer: "Yes. Partnerships can begin with a single project and expand as trust builds.",
  },
  {
    question: "How does the referral commission work?",
    answer:
      "Under Model 1, the referral partner earns 10% of the project management cost, subject to agreed project and partnership terms.",
  },
];

const PARTNER_TYPES = [
  "Agency",
  "Freelancer",
  "Consultant",
  "IT / Technology Company",
  "Branding / Creative Agency",
  "Other",
];

const PARTNER_MODELS = [
  "Refer & Earn",
  "Back-End Execution",
  "White-Label Team",
  "Not Sure — Help Me Choose",
];

export function AgencyPartner() {
  const { company } = useCms();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  const partnerWa = whatsappWithText(
    company.whatsappHref,
    "Hi DisplayAvenue — I'm interested in the Agency Partner Program. Can we talk models?",
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const agency = String(data.get("agency") || "").trim();
    const email = String(data.get("email") || "").trim();
    const website = String(data.get("site") || "").trim();
    const type = String(data.get("type") || "").trim();
    const model = String(data.get("model") || "").trim();
    const services = String(data.get("services") || "").trim();
    const volume = String(data.get("volume") || "").trim();
    const message = String(data.get("message") || "").trim();
    const hp = String(data.get("website") || "").trim();

    if (!name || !phone || !agency) {
      setStatus("err");
      setError("Please add your name, phone, and agency name.");
      return;
    }

    const composed = [
      "Agency Partner enquiry",
      agency ? `Agency: ${agency}` : "",
      type ? `Type: ${type}` : "",
      model ? `Model: ${model}` : "",
      website ? `Website/IG: ${website}` : "",
      services ? `Services needed: ${services}` : "",
      volume ? `Volume: ${volume}` : "",
      message ? `Notes: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    setStatus("sending");
    setError("");
    try {
      const res = await fetch(`${base}admin/contact-submit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          business: agency,
          city: "",
          interest: model || "Agency Partner",
          tags: ["Agency Partner", type, model].filter(Boolean),
          message: composed,
          website: hp,
          page: "/agency-partner",
          visitorId: getVisitorId(),
          utm: getStoredUtm(),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not send.");
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Could not send.");
    }
  }

  return (
    <div className="ap-page">
      <SEO
        title="Agency Partner Program | DisplayAvenue"
        description="Grow your agency with DisplayAvenue as your behind-the-scenes execution team. Refer & Earn, back-end execution, or white-label. 30+ specialists. Partner-first."
        path="/agency-partner"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Agency Partner", path: "/agency-partner" },
        ]}
      />
      <FAQPageSchema faqs={FAQS} />

      <section className="ap-hero">
        <div className="ap-wrap">
          <p className="ap-brand">DisplayAvenue</p>
          <p className="ap-eyebrow">Agency Partner Program</p>
          <h1>Grow your agency. We’ll handle the execution.</h1>
          <p className="ap-lead">
            Your client. Your brand. Your relationship. Our 30+ member execution team — so you can
            offer more without hiring more.
          </p>
          <div className="ap-actions">
            <a className="ap-btn ap-btn--primary" href="#partner-form">
              Become an agency partner
            </a>
            <a className="ap-btn ap-btn--ghost" href={partnerWa} target="_blank" rel="noreferrer">
              Talk to partnership team
            </a>
          </div>
        </div>
      </section>

      <section className="ap-section">
        <div className="ap-wrap">
          <h2>You don’t need 10 specialists to offer 100+ services</h2>
          <p className="ap-sub">
            Don’t turn away projects because your team is overloaded. Don’t lose a client because
            you cannot execute in-house. Partner with DisplayAvenue as your behind-the-scenes
            digital execution team — refer, lead, or white-label.
          </p>
        </div>
      </section>

      <section className="ap-section ap-section--tint">
        <div className="ap-wrap">
          <h2>Why agencies partner with DisplayAvenue</h2>
          <p className="ap-sub">You focus on relationships. We focus on execution.</p>
          <ul className="ap-why">
            {WHY.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ap-section" id="models">
        <div className="ap-wrap">
          <h2>3 ways to partner</h2>
          <p className="ap-sub">Refer. Lead. Or white-label.</p>
          <div className="ap-models">
            {MODELS.map((m) => (
              <article key={m.id} className="ap-model" id={`model-${m.id}`}>
                <p className="ap-model__num">Model {m.num}</p>
                <h3>{m.title}</h3>
                <p className="ap-model__lead">{m.lead}</p>
                <p>{m.body}</p>
                {"steps" in m && m.steps ? (
                  <ol className="ap-ol">
                    {m.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                ) : null}
                {"youManage" in m && m.youManage ? (
                  <div className="ap-split">
                    <div>
                      <h4>You manage</h4>
                      <ul>
                        {m.youManage.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>We manage</h4>
                      <ul>
                        {m.weManage!.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
                {"offer" in m && m.offer ? (
                  <ul className="ap-checklist">
                    {m.offer.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                ) : null}
                {"perfectFor" in m && m.perfectFor ? (
                  <p className="ap-perfect">
                    <strong>Perfect for:</strong> {m.perfectFor.join(" · ")}
                  </p>
                ) : null}
                <a className="ap-btn ap-btn--outline" href={m.href}>
                  {m.cta}
                </a>
              </article>
            ))}
          </div>
          <p className="ap-flow">
            Client → Your Agency → DisplayAvenue execution team. Not Client → Agency → DisplayAvenue →
            Client.
          </p>
        </div>
      </section>

      <section className="ap-section ap-section--tint">
        <div className="ap-wrap">
          <h2>100% partner-first</h2>
          <p className="ap-sub">
            Your client relationship is your asset. An execution partner should never become a
            threat to the agency that brought the business.
          </p>
          <ol className="ap-principles">
            {PRINCIPLES.map((p) => (
              <li key={p.n}>
                <span>{p.n}</span>
                <div>
                  <strong>{p.title}</strong>
                  <p>{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ap-section">
        <div className="ap-wrap">
          <h2>A complete digital execution ecosystem</h2>
          <p className="ap-sub">One partner. Multiple specialist teams.</p>
          <div className="ap-caps">
            {CAPABILITIES.map((c) => (
              <div key={c.title} className="ap-cap">
                <h3>{c.title}</h3>
                <ul>
                  {c.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ap-section ap-section--tint">
        <div className="ap-wrap">
          <h2>Why build an internal team for everything?</h2>
          <div className="ap-compare">
            <div>
              <h3>Traditional</h3>
              <ul>
                <li>Hire, train, manage, replace</li>
                <li>Salaries and freelancer chaos</li>
                <li>Capacity bottlenecks</li>
              </ul>
            </div>
            <div>
              <h3>Partner approach</h3>
              <ul>
                <li>Sell the project</li>
                <li>Share the requirement</li>
                <li>Our specialists execute</li>
                <li>You deliver to your client</li>
                <li>You scale</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="ap-section">
        <div className="ap-wrap">
          <h2>Transparent pricing</h2>
          <p className="ap-sub">
            No mystery costs. Defined scopes, deliverables, and project costs. You know what is
            executed, what it costs, and who owns what. In Models 2 and 3, you set client pricing —
            we agree your execution cost, and your agency keeps its margin.
          </p>
        </div>
      </section>

      <section className="ap-section ap-section--tint">
        <div className="ap-wrap">
          <h2>Who should become a partner?</h2>
          <ul className="ap-who">
            {WHO.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ap-section">
        <div className="ap-wrap">
          <h2>How the partnership works</h2>
          <ol className="ap-steps">
            {STEPS.map((s) => (
              <li key={s.n}>
                <span>{s.n}</span>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="ap-section ap-section--tint" id="faq">
        <div className="ap-wrap">
          <h2>FAQ</h2>
          <div className="ap-faqs">
            {FAQS.map((f) => (
              <details key={f.question} className="ap-faq">
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ap-section" id="partner-form">
        <div className="ap-wrap ap-form-wrap">
          <h2>Partner enquiry</h2>
          <p className="ap-sub">
            Tell us about your agency — we’ll recommend the right model. Information is treated
            confidentially.
          </p>

          {status === "ok" ? (
            <div className="ap-success">
              <h3>Thanks — we got your partner enquiry</h3>
              <p>Our partnership team will reply soon. Prefer WhatsApp?</p>
              <a className="ap-btn ap-btn--primary" href={partnerWa} target="_blank" rel="noreferrer">
                Message us on WhatsApp
              </a>
            </div>
          ) : (
            <form className="ap-form" onSubmit={onSubmit} noValidate>
              <label>
                <span>Name *</span>
                <input name="name" required autoComplete="name" placeholder="Your name" />
              </label>
              <label>
                <span>Agency / company *</span>
                <input name="agency" required autoComplete="organization" placeholder="Agency name" />
              </label>
              <label>
                <span>Phone / WhatsApp *</span>
                <input name="phone" required inputMode="tel" autoComplete="tel" placeholder="Phone" />
              </label>
              <label>
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" placeholder="Email" />
              </label>
              <label>
                <span>Website / Instagram</span>
                <input name="site" placeholder="Website or profile" />
              </label>
              <label>
                <span>What best describes you?</span>
                <select name="type" defaultValue="">
                  <option value="">Select</option>
                  {PARTNER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Partnership interest</span>
                <select name="model" defaultValue="">
                  <option value="">Select</option>
                  {PARTNER_MODELS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Services you need support with</span>
                <input name="services" placeholder="SEO, ads, websites, AI…" />
              </label>
              <label className="ap-form__full">
                <span>Approximate monthly project volume</span>
                <input name="volume" placeholder="e.g. 2–5 projects / month" />
              </label>
              <label className="ap-form__full">
                <span>Tell us about your requirement</span>
                <textarea name="message" rows={4} placeholder="Clients, goals, timeline…" />
              </label>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="ap-honeypot"
              />
              {status === "err" && error ? (
                <p className="ap-form__error" role="alert">
                  {error}
                </p>
              ) : null}
              <button className="ap-btn ap-btn--primary" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Become a partner"}
              </button>
            </form>
          )}
        </div>
      </section>

      <section className="ap-closing">
        <div className="ap-wrap">
          <p className="ap-brand ap-brand--light">DisplayAvenue</p>
          <h2>Your agency + our execution team</h2>
          <p>
            More capability. More opportunities. More growth. Refer. Lead. Or white-label.
          </p>
          <div className="ap-actions">
            <a className="ap-btn ap-btn--primary" href="#partner-form">
              Become a DisplayAvenue partner
            </a>
            <a className="ap-btn ap-btn--ghost" href={company.phoneHref}>
              Call {company.phone}
            </a>
            <Link className="ap-btn ap-btn--ghost" to="/contact">
              General contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

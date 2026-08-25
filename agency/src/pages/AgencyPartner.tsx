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
    text: "Access specialists across marketing, creative, technology, and digital transformation — without building that payroll yourself.",
  },
  {
    title: "360° digital capabilities",
    text: "From marketing and websites to AI, automation, ecommerce, CRM, and technology implementation.",
  },
  {
    title: "Transparent pricing",
    text: "Clear scope, clear costing, and clear deliverables before work starts.",
  },
  {
    title: "Your client remains your client",
    text: "We respect your relationship and operate according to the agreed partnership model.",
  },
  {
    title: "No direct client approach",
    text: "For partner-managed projects, we do not bypass you to sell directly to your client.",
  },
  {
    title: "Flexible collaboration",
    text: "Refer projects, outsource execution, or build an entire white-label delivery model.",
  },
  {
    title: "Reliable execution",
    text: "Professional processes, specialist teams, and structured project management.",
  },
  {
    title: "Scale without hiring",
    text: "Take on larger projects without immediately increasing your payroll.",
  },
];

type PartnerModel = {
  id: string;
  num: string;
  title: string;
  lead: string;
  body: string;
  steps?: string[];
  youManage?: string[];
  weManage?: string[];
  offer?: string[];
  perfectFor?: string[];
  opportunity?: string;
  cta: string;
  href: string;
};

const MODELS: PartnerModel[] = [
  {
    id: "refer",
    num: "01",
    title: "Refer & Earn",
    lead: "Introduce the client. Earn from the project.",
    body: "Have a business contact who needs digital marketing, website development, software, branding, or digital transformation? Simply introduce the opportunity to us. You earn 10% of the project management cost. You don’t need to manage the project, build the team, or handle execution.",
    steps: [
      "01 — Refer: introduce a business or project to DisplayAvenue",
      "02 — We qualify: our team understands the requirement and prepares the proposal",
      "03 — Project starts: we handle the agreed execution",
      "04 — You earn: 10% of the project management cost (subject to agreed partnership terms)",
    ],
    perfectFor: [
      "Business consultants",
      "Freelancers",
      "Influencers",
      "IT consultants",
      "Designers",
      "Sales professionals",
      "Business communities",
      "Entrepreneurs",
      "Referral partners",
    ],
    opportunity: "One introduction can become recurring income.",
    cta: "Start referring",
    href: "#partner-form",
  },
  {
    id: "lead",
    num: "02",
    title: "You lead the client. We do the back-end execution.",
    lead: "Your agency remains in control.",
    body: "You already have the client. You understand their requirements. You manage communication and relationships — but you don’t want to execute everything yourself. You send us the requirement. We execute the agreed scope behind the scenes.",
    youManage: [
      "Client relationship",
      "Client meetings",
      "Strategy ownership",
      "Communication",
      "Commercial relationship",
      "Final approvals",
    ],
    weManage: [
      "Research",
      "Design",
      "Development",
      "SEO",
      "Paid advertising",
      "Content",
      "Social media",
      "Video editing",
      "Technology",
      "Automation",
      "Reporting support",
      "Technical execution",
    ],
    opportunity:
      "We do not talk directly to your client unless you specifically authorize it. Think of DisplayAvenue as your invisible execution department.",
    cta: "Outsource a project",
    href: "#partner-form",
  },
  {
    id: "white-label",
    num: "03",
    title: "Your agency brand. Our execution team.",
    lead: "Build a bigger agency without building a bigger payroll.",
    body: "Want to offer services your current team cannot execute? Take larger clients? Provide complete digital transformation? Look like a full-service agency without hiring 30+ specialists? White-label DisplayAvenue. We work as an extension of your team under your agreed brand and operating model. Your client sees your agency. Your brand remains at the front. Our team works behind the scenes.",
    offer: [
      "Digital Marketing",
      "SEO",
      "Google Ads",
      "Meta Ads",
      "Social Media Marketing",
      "Content Marketing",
      "Website Development",
      "Ecommerce Development",
      "Shopify · WordPress · Magento",
      "CRM · ERP Solutions",
      "AI Solutions · AI Automation",
      "Lead Generation · Marketing Automation",
      "UI/UX · Graphic Design",
      "Video Editing · Photography · Videography",
      "Branding · Digital Strategy",
      "Technology Development",
    ],
    opportunity: "Your agency can sell. Our team can build. Your agency can grow.",
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
    text: "We do not intentionally bypass a partner to approach their client for direct business.",
  },
  {
    n: "03",
    title: "Controlled communication",
    text: "For back-end execution projects, we communicate through the partner unless direct communication is specifically approved.",
  },
  {
    n: "04",
    title: "Transparent commercial structure",
    text: "Pricing, scope, and deliverables are discussed clearly before execution.",
  },
  {
    n: "05",
    title: "Professional execution",
    text: "Projects are assigned to the appropriate specialists inside our team.",
  },
  {
    n: "06",
    title: "Long-term thinking",
    text: "We are interested in building long-term agency relationships, not one-time transactions.",
  },
];

const CAN_HANDLE = [
  "Website",
  "SEO",
  "Google & Meta Ads",
  "Social media",
  "Ecommerce",
  "CRM, automation, AI or custom technology",
];

const CAPABILITIES = [
  {
    title: "Digital marketing",
    items: [
      "SEO",
      "Local SEO",
      "AI SEO / GEO",
      "Google Ads",
      "Meta Ads",
      "LinkedIn Ads",
      "Performance Marketing",
      "Lead Generation",
      "Social Media Marketing",
      "Content Marketing",
      "Email Marketing",
      "Influencer Marketing",
      "Marketing Automation",
      "Analytics & Tracking",
    ],
  },
  {
    title: "Web & ecommerce",
    items: [
      "Corporate Websites",
      "Landing Pages",
      "WordPress",
      "Webflow",
      "Shopify",
      "WooCommerce",
      "Magento",
      "Custom Ecommerce",
      "Custom Web Development",
    ],
  },
  {
    title: "Technology & digital transformation",
    items: [
      "CRM Systems",
      "ERP Solutions",
      "SaaS Development",
      "AI Chatbots",
      "AI Agents",
      "AI Automation",
      "AI Workflows",
      "Custom Software",
      "Mobile Applications",
      "Admin Dashboards",
      "Cloud & DevOps",
    ],
  },
  {
    title: "Creative & production",
    items: [
      "Branding",
      "Graphic Design",
      "UI/UX",
      "Photography",
      "Videography",
      "Video Editing",
      "Motion Graphics",
      "Animation",
      "Product Shoots",
      "Brand Films",
      "Social Media Creatives",
    ],
  },
];

const GROWTH_CHAIN = [
  "Website",
  "SEO",
  "Paid advertising",
  "Social media",
  "Content",
  "Automation",
  "CRM",
  "Digital transformation",
];

const WHO = [
  {
    title: "Digital marketing agencies",
    text: "Need additional execution capacity or specialist services?",
  },
  {
    title: "Web development companies",
    text: "Want to offer marketing and growth services after launching websites?",
  },
  {
    title: "Freelancers & consultants",
    text: "Want to take larger projects without hiring a team?",
  },
  {
    title: "Branding agencies",
    text: "Want to add digital marketing, websites, and technology?",
  },
  {
    title: "IT companies",
    text: "Need marketing and creative execution support?",
  },
  {
    title: "Social media agencies",
    text: "Need backend content, design, advertising, and technology support?",
  },
  {
    title: "Business consultants",
    text: "Want to add complete digital solutions to your offering?",
  },
  {
    title: "New agencies",
    text: "Want to start lean and scale without large fixed costs?",
  },
];

const YOU_GET = [
  "Dedicated project coordination",
  "Specialist execution teams",
  "Structured workflows",
  "Transparent costing",
  "Professional deliverables",
  "Technical expertise",
  "Scalable capacity",
  "Multiple service capabilities",
  "Partner-first communication",
  "Long-term collaboration",
];

const STEPS = [
  { n: "01", title: "Connect", text: "Tell us about your agency, clients, and requirements." },
  {
    n: "02",
    title: "Select your model",
    text: "Refer & Earn, Back-End Execution, or White-Label Team.",
  },
  {
    n: "03",
    title: "Agree the commercials",
    text: "Define scope, pricing, responsibilities, and communication structure.",
  },
  { n: "04", title: "Start execution", text: "Our team gets to work." },
  {
    n: "05",
    title: "Scale",
    text: "As your business grows, expand the services you offer.",
  },
];

const FAQS = [
  {
    question: "Will DisplayAvenue approach my client directly?",
    answer:
      "For partner-managed projects, our operating principle is to respect the partner relationship and not bypass the partner to pursue direct business. Communication and client-facing involvement are handled according to the agreed partnership model.",
  },
  {
    question: "Can I use my own pricing?",
    answer:
      "Yes. In the back-end and white-label models, your agency can structure its own client commercial model while DisplayAvenue provides the agreed execution service.",
  },
  {
    question: "Will the client know DisplayAvenue is involved?",
    answer:
      "That depends on the partnership model. With white-label / back-end execution, the operating arrangement can be structured so your agency remains the client-facing brand.",
  },
  {
    question: "Can you work under my agency’s brand?",
    answer: "Yes. That’s the purpose of Model 3 — White-Label / Agency Team.",
  },
  {
    question: "Do you only provide digital marketing?",
    answer:
      "No. DisplayAvenue operates across digital marketing, web development, ecommerce, technology, AI, automation, creative, and broader digital transformation services.",
  },
  {
    question: "Can I start with one project?",
    answer:
      "Yes. A partnership can begin with a single project and expand as the relationship develops.",
  },
  {
    question: "Do I need to hire your team?",
    answer:
      "No. The objective is to give your agency access to execution capabilities without requiring you to build every specialist function internally.",
  },
  {
    question: "Can you handle multiple clients?",
    answer:
      "Yes. The partnership is designed to support agencies that need scalable execution capacity.",
  },
  {
    question: "How does the referral commission work?",
    answer:
      "Under Model 1, the referral partner earns 10% of the project management cost, subject to the agreed project and partnership terms.",
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

    if (!name || !phone || !agency || !email || !type || !model) {
      setStatus("err");
      setError("Please complete the required fields (name, agency, phone, email, type, and model).");
      return;
    }

    const composed = [
      "Agency Partner enquiry",
      `Agency: ${agency}`,
      `Type: ${type}`,
      `Model: ${model}`,
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
        <div className="ap-wrap ap-hero__inner">
          <p className="ap-brand">DisplayAvenue</p>
          <p className="ap-eyebrow">Agency Partner Program</p>
          <h1>
            Grow your agency.
            <span className="ap-hero__line2"> We’ll handle the execution.</span>
          </h1>
          <p className="ap-lead">
            Your client. Your brand. Your relationship. Our 30+ member execution team.
          </p>
          <div className="ap-actions">
            <a className="ap-btn ap-btn--primary" href="#partner-form">
              Become an agency partner
            </a>
            <a className="ap-btn ap-btn--ghost" href={partnerWa} target="_blank" rel="noreferrer">
              Talk to our partnership team
            </a>
          </div>
        </div>
      </section>

      <section className="ap-section">
        <div className="ap-wrap">
          <h2>You don’t need to hire 10 specialists to offer 100+ digital services</h2>
          <p className="ap-sub">
            You don’t need to turn away projects because your team is overloaded. And you don’t need
            to lose a client because you cannot execute a project in-house. Partner with
            DisplayAvenue and turn us into your behind-the-scenes digital execution team — whether
            you want to earn by referring, keep full client control while outsourcing execution, or
            operate with a full digital team under your own agency brand.
          </p>
          <div className="ap-actions ap-actions--inline">
            <a className="ap-btn ap-btn--primary" href="#models">
              Refer. Lead. Or white-label.
            </a>
          </div>
        </div>
      </section>

      <section className="ap-section ap-section--tint">
        <div className="ap-wrap">
          <h2>Why agencies partner with DisplayAvenue</h2>
          <p className="ap-sub">
            You focus on relationships. We focus on execution. Running an agency requires more than
            winning clients — strategists, designers, developers, performance marketers, SEO
            specialists, content creators, video editors, technology experts, and account support.
            Building that team internally is expensive. Managing freelancers is unpredictable.
            Hiring specialists for every project is exhausting. DisplayAvenue gives you access to an
            in-house digital execution team without the overhead of building one yourself.
          </p>
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
          <h2>Choose your partnership model</h2>
          <p className="ap-sub">3 ways to partner — refer, lead, or white-label.</p>
          <div className="ap-models">
            {MODELS.map((m) => (
              <article key={m.id} className="ap-model" id={`model-${m.id}`}>
                <p className="ap-model__num">Model {m.num}</p>
                <h3>{m.title}</h3>
                <p className="ap-model__lead">{m.lead}</p>
                <p>{m.body}</p>
                {m.steps ? (
                  <>
                    <h4 className="ap-h4">How it works</h4>
                    <ol className="ap-ol">
                      {m.steps.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  </>
                ) : null}
                {m.youManage && m.weManage ? (
                  <div className="ap-split">
                    <div>
                      <h4 className="ap-h4">You manage</h4>
                      <ul>
                        {m.youManage.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="ap-h4">We manage</h4>
                      <ul>
                        {m.weManage.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
                {m.offer ? (
                  <>
                    <h4 className="ap-h4">You can offer</h4>
                    <ul className="ap-checklist ap-checklist--grid">
                      {m.offer.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {m.perfectFor ? (
                  <p className="ap-perfect">
                    <strong>Perfect for:</strong> {m.perfectFor.join(" · ")}
                  </p>
                ) : null}
                {m.opportunity ? <p className="ap-opportunity">{m.opportunity}</p> : null}
                <a className="ap-btn ap-btn--outline" href={m.href}>
                  {m.cta}
                </a>
              </article>
            ))}
          </div>
          <p className="ap-flow">
            <strong>Client → Your Agency → DisplayAvenue execution team.</strong>
            <br />
            Not: Client → Your Agency → DisplayAvenue → Client. Your relationship stays protected.
          </p>
        </div>
      </section>

      <section className="ap-section ap-section--tint">
        <div className="ap-wrap">
          <h2>100% partner-first approach</h2>
          <p className="ap-sub">
            We understand one thing: your client relationship is your asset. We don’t believe an
            execution partner should become a threat to the agency that brought the business. That’s
            why our Agency Partner model is built around trust, confidentiality, and clearly defined
            responsibilities.
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
          <h2>Built for agencies that want to scale</h2>
          <p className="ap-quote">
            Stop saying “We don’t offer that service.” Start saying “Yes, we can handle that.”
          </p>
          <ul className="ap-can">
            {CAN_HANDLE.map((item) => (
              <li key={item}>
                <span>Your client needs {item.toLowerCase()}?</span>
                <strong>We can execute it.</strong>
              </li>
            ))}
          </ul>
          <p className="ap-sub">
            You don’t have to build every capability yourself. Build your agency around sales,
            relationships, and strategy — and use DisplayAvenue as your execution engine.
          </p>
        </div>
      </section>

      <section className="ap-section ap-section--tint">
        <div className="ap-wrap">
          <h2>A complete digital execution ecosystem</h2>
          <p className="ap-sub">One partner. Multiple specialist teams.</p>
          <div className="ap-caps">
            {CAPABILITIES.map((c) => (
              <div key={c.title} className="ap-cap">
                <h3>{c.title}</h3>
                <ul className="ap-cap__list">
                  {c.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="ap-section">
        <div className="ap-wrap">
          <h2>Why build an internal team for everything?</h2>
          <div className="ap-compare">
            <div>
              <h3>Traditional approach</h3>
              <ul>
                <li>Hire</li>
                <li>Train</li>
                <li>Manage</li>
                <li>Replace</li>
                <li>Pay salaries</li>
                <li>Manage freelancers</li>
                <li>Handle workload</li>
                <li>Deal with capacity issues</li>
              </ul>
            </div>
            <div>
              <h3>Partner approach</h3>
              <ol className="ap-partner-flow">
                <li>Sell the project</li>
                <li>Share the requirement</li>
                <li>Our specialists execute</li>
                <li>You deliver to your client</li>
                <li>You scale</li>
              </ol>
              <p className="ap-perfect">
                More capabilities. Less overhead. Faster scaling.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ap-section ap-section--tint">
        <div className="ap-wrap">
          <h2>Transparent pricing</h2>
          <p className="ap-sub">
            No mystery costs. No confusing markups. A successful agency partnership needs predictable
            economics — defined scopes, deliverables, and project costs. You know what is being
            executed, what it costs, what will be delivered, and who is responsible for what.
          </p>
          <p className="ap-sub">
            For white-label and back-end execution, the commercial model can be structured around
            your agency’s requirements, project volume, and operating model. Want your own agency
            margin? That’s exactly what Model 2 and Model 3 are designed for. You decide what you
            charge your client. We agree on your execution cost. Your agency keeps its commercial
            margin.
          </p>
        </div>
      </section>

      <section className="ap-section">
        <div className="ap-wrap">
          <h2>From one project to a long-term partnership</h2>
          <p className="ap-sub">
            A website project can become an SEO client. SEO can become paid advertising. Paid
            advertising can become social media. The bigger your capability, the bigger the client
            opportunity.
          </p>
          <ol className="ap-chain">
            {GROWTH_CHAIN.map((step, i) => (
              <li key={step}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {step}
              </li>
            ))}
          </ol>
          <p className="ap-sub" style={{ marginTop: "1.5rem" }}>
            Agency partnerships aren’t new to us. We’ve worked this way for 5+ years, helping
            agencies extend execution without building everything internally. The goal isn’t to
            become another agency competing with you. The goal is to become the team behind your
            agency.
          </p>
        </div>
      </section>

      <section className="ap-section ap-section--tint">
        <div className="ap-wrap">
          <h2>Who should become a DisplayAvenue agency partner?</h2>
          <ul className="ap-who-grid">
            {WHO.map((w) => (
              <li key={w.title}>
                <strong>{w.title}</strong>
                <span>{w.text}</span>
              </li>
            ))}
          </ul>
          <p className="ap-quote ap-quote--soft">
            Your agency can look bigger without hiring bigger. You don’t need 30 employees on your
            payroll. You need access to the right 30+ specialists. That’s the difference.
          </p>
        </div>
      </section>

      <section className="ap-section">
        <div className="ap-wrap">
          <h2>What you get as a partner</h2>
          <p className="ap-sub">A complete execution backend — essentially an extended digital department.</p>
          <ul className="ap-get">
            {YOU_GET.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ap-section ap-section--tint">
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

      <section className="ap-band">
        <div className="ap-wrap">
          <h2>Your clients should never know how big your backend is</h2>
          <p>They only need to know one thing: your agency can deliver.</p>
          <div className="ap-actions">
            <a className="ap-btn ap-btn--primary" href="#partner-form">
              Become a DisplayAvenue partner
            </a>
            <a className="ap-btn ap-btn--ghost" href={partnerWa} target="_blank" rel="noreferrer">
              Talk to partnership team
            </a>
          </div>
        </div>
      </section>

      <section className="ap-section" id="faq">
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

      <section className="ap-section ap-section--tint" id="partner-form">
        <div className="ap-wrap ap-form-wrap">
          <h2>Partner enquiry</h2>
          <p className="ap-sub">
            Let’s build your execution engine. Tell us a little about your agency and we’ll discuss
            the most suitable partnership model. Your information is treated confidentially and used
            only to discuss the partnership opportunity.
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
                <span>Agency / company name *</span>
                <input
                  name="agency"
                  required
                  autoComplete="organization"
                  placeholder="Agency name"
                />
              </label>
              <label>
                <span>Phone / WhatsApp *</span>
                <input
                  name="phone"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Phone number"
                />
              </label>
              <label>
                <span>Email *</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email address"
                />
              </label>
              <label>
                <span>Website / Instagram</span>
                <input name="site" placeholder="Website or profile" />
              </label>
              <label>
                <span>What best describes you? *</span>
                <select name="type" required defaultValue="">
                  <option value="" disabled>
                    Select
                  </option>
                  {PARTNER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Which partnership are you interested in? *</span>
                <select name="model" required defaultValue="">
                  <option value="" disabled>
                    Select
                  </option>
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
          <p className="ap-eyebrow">Digital growth. Digital transformation. Execution at scale.</p>
          <h2>Your agency + our execution team</h2>
          <p>
            More capability. More opportunities. More growth. Refer. Lead. Or white-label. Let’s
            build something bigger — together.
          </p>
          <ul className="ap-closing__meta">
            <li>Digital Marketing · Digital Transformation · Technology</li>
            <li>AI & Automation · Web & Ecommerce · Creative & Production</li>
            <li>30+ in-house team members · India & international markets</li>
          </ul>
          <div className="ap-actions">
            <a className="ap-btn ap-btn--primary" href="#partner-form">
              Become an agency partner
            </a>
            <a className="ap-btn ap-btn--ghost" href={partnerWa} target="_blank" rel="noreferrer">
              WhatsApp {company.phone}
            </a>
            <a className="ap-btn ap-btn--ghost" href={company.emailHref}>
              {company.email}
            </a>
            <Link className="ap-btn ap-btn--ghost" to="/">
              displayavenue.com
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

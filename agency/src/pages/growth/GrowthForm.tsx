import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  growthBudgets,
  growthCurrentMarketing,
  growthIndustries,
  growthNeeds,
  growthPlans,
  growthTimelines,
  scoreGrowthLead,
  type GrowthLeadPayload,
} from "./growthData";
import {
  captureGrowthAttribution,
  deviceType,
  newEventId,
} from "./growthAttribution";
import { trackGrowthEvent } from "./growthAnalytics";

type FormState = {
  name: string;
  business_name: string;
  phone: string;
  email: string;
  industry: string;
  services_required: string[];
  current_marketing: string[];
  budgetId: string;
  planId: string;
  timelineId: string;
  business_description: string;
  consent: boolean;
  website: string;
};

const initial: FormState = {
  name: "",
  business_name: "",
  phone: "",
  email: "",
  industry: "",
  services_required: [],
  current_marketing: [],
  budgetId: "",
  planId: "",
  timelineId: "",
  business_description: "",
  consent: false,
  website: "",
};

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function isValidIndianPhone(v: string) {
  const digits = v.replace(/\D/g, "");
  if (digits.length === 10) return /^[6-9]/.test(digits);
  if (digits.length === 12 && digits.startsWith("91")) return /^91[6-9]/.test(digits);
  if (digits.length === 11 && digits.startsWith("0")) return /^0[6-9]/.test(digits);
  return digits.length >= 10 && digits.length <= 15;
}

function toggleIn(list: string[], value: string) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value];
}

type Props = {
  initialPlanId?: string;
  onSubmitted?: (leadId: string) => void;
};

export function GrowthForm({ initialPlanId = "", onSubmitted }: Props) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormState>(() => ({
    ...initial,
    planId: initialPlanId || "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [started, setStarted] = useState(false);
  const total = 8;

  useEffect(() => {
    if (initialPlanId) {
      setData((d) => ({ ...d, planId: initialPlanId }));
    }
  }, [initialPlanId]);

  const progress = useMemo(() => Math.round((step / total) * 100), [step]);

  const markStart = () => {
    if (started) return;
    setStarted(true);
    trackGrowthEvent("form_start", { form_step: 1, landing_page: "/growth" });
  };

  const validateStep = (s: number): boolean => {
    const next: Record<string, string> = {};
    if (s === 1) {
      if (!data.name.trim()) next.name = "Enter your full name";
      if (!data.business_name.trim()) next.business_name = "Enter your business name";
      if (!data.phone.trim()) next.phone = "Enter your WhatsApp number";
      else if (!isValidIndianPhone(data.phone)) next.phone = "Enter a valid Indian mobile number";
      if (!data.email.trim()) next.email = "Enter your email";
      else if (!isValidEmail(data.email)) next.email = "Enter a valid email address";
    }
    if (s === 2 && !data.industry) next.industry = "Select an industry";
    if (s === 3 && data.services_required.length === 0) {
      next.services_required = "Select at least one requirement";
    }
    if (s === 4 && data.current_marketing.length === 0) {
      next.current_marketing = "Select at least one option";
    }
    if (s === 5 && !data.budgetId) next.budgetId = "Select a budget range";
    if (s === 6 && !data.planId) next.planId = "Select a plan";
    if (s === 7 && !data.timelineId) next.timelineId = "Select a timeline";
    if (s === 8) {
      if (!data.business_description.trim()) {
        next.business_description = "Tell us a bit about your requirements";
      }
      if (!data.consent) next.consent = "Consent is required to contact you";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    markStart();
    if (!validateStep(step)) return;
    trackGrowthEvent("form_step_complete", {
      form_step: step,
      industry: data.industry,
      selected_plan: data.planId,
      timeline: data.timelineId,
    });
    setStep((s) => Math.min(total, s + 1));
  };

  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const submit = async () => {
    markStart();
    if (!validateStep(8)) return;
    setSubmitting(true);
    setSubmitError("");
    const scoring = scoreGrowthLead({
      budgetId: data.budgetId,
      planId: data.planId,
      timelineId: data.timelineId,
      servicesRequired: data.services_required,
      currentMarketing: data.current_marketing,
    });
    const { first, last } = captureGrowthAttribution();
    const eventId = newEventId();
    const budgetLabel = growthBudgets.find((b) => b.id === data.budgetId)?.label || data.budgetId;
    const planLabel = growthPlans.find((p) => p.id === data.planId)?.label || data.planId;
    const timelineLabel =
      growthTimelines.find((t) => t.id === data.timelineId)?.label || data.timelineId;

    const payload: GrowthLeadPayload = {
      name: data.name.trim(),
      business_name: data.business_name.trim(),
      phone: data.phone.trim(),
      email: data.email.trim(),
      industry: data.industry,
      services_required: data.services_required,
      current_marketing: data.current_marketing,
      monthly_marketing_budget: budgetLabel,
      selected_plan: planLabel,
      timeline: timelineLabel,
      business_description: data.business_description.trim(),
      lead_score: scoring.lead_score,
      lead_temperature: scoring.lead_temperature,
      consent: data.consent,
      first_utm_source: first.utm_source,
      first_utm_medium: first.utm_medium,
      first_utm_campaign: first.utm_campaign,
      first_utm_content: first.utm_content,
      last_utm_source: last.utm_source,
      last_utm_medium: last.utm_medium,
      last_utm_campaign: last.utm_campaign,
      last_utm_content: last.utm_content,
      fbclid: last.fbclid || first.fbclid,
      landing_page: "/growth",
      referrer: document.referrer || "",
      device: deviceType(),
      event_id: eventId,
      page: "/growth",
      website: data.website,
    };

    try {
      const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
      const res = await fetch(`${base}admin/growth-submit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        lead_id?: string;
      };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Could not submit. Please try WhatsApp.");
      }

      trackGrowthEvent("form_submit", {
        form_step: 8,
        industry: data.industry,
        selected_plan: planLabel,
        budget_range: budgetLabel,
        timeline: timelineLabel,
        event_id: eventId,
      });
      // Lead fires only after successful submission
      trackGrowthEvent("lead", {
        industry: data.industry,
        selected_plan: planLabel,
        budget_range: budgetLabel,
        timeline: timelineLabel,
        event_id: eventId,
        value: scoring.lead_score,
      });

      try {
        sessionStorage.setItem(
          "da_growth_lead",
          JSON.stringify({
            lead_id: json.lead_id,
            business_name: payload.business_name,
            services_required: payload.services_required,
            selected_plan: payload.selected_plan,
          }),
        );
      } catch {
        /* ignore */
      }

      onSubmitted?.(json.lead_id || "");
      navigate("/growth/thank-you", { replace: true });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="growth-form" id="growth-form">
      <div className="growth-form__head">
        <p className="growth-eyebrow">Qualification</p>
        <h2>Let’s Build Your Growth Plan</h2>
        <p>
          Tell us about your business, current marketing and goals. We’ll use this
          information to understand which services may be relevant.
        </p>
        <div className="growth-form__progress" aria-hidden>
          <div style={{ width: `${progress}%` }} />
        </div>
        <p className="growth-form__step">
          {String(step).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </div>

      {step === 1 && (
        <div className="growth-form__grid">
          <Field label="Full Name *" error={errors.name}>
            <input
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              onFocus={markStart}
              autoComplete="name"
            />
          </Field>
          <Field label="Business Name *" error={errors.business_name}>
            <input
              value={data.business_name}
              onChange={(e) => setData({ ...data, business_name: e.target.value })}
              autoComplete="organization"
            />
          </Field>
          <Field label="WhatsApp Number *" error={errors.phone}>
            <input
              value={data.phone}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              inputMode="tel"
              autoComplete="tel"
              placeholder="+91"
            />
          </Field>
          <Field label="Email Address *" error={errors.email}>
            <input
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              type="email"
              autoComplete="email"
            />
          </Field>
        </div>
      )}

      {step === 2 && (
        <ChoiceGrid
          label="What industry is your business in?"
          error={errors.industry}
          options={[...growthIndustries]}
          value={data.industry ? [data.industry] : []}
          onToggle={(v) => setData({ ...data, industry: v })}
          single
        />
      )}

      {step === 3 && (
        <ChoiceGrid
          label="What do you need help with?"
          hint="Select all that apply"
          error={errors.services_required}
          options={[...growthNeeds]}
          value={data.services_required}
          onToggle={(v) =>
            setData({ ...data, services_required: toggleIn(data.services_required, v) })
          }
        />
      )}

      {step === 4 && (
        <ChoiceGrid
          label="What are you currently doing?"
          hint="Select all that apply"
          error={errors.current_marketing}
          options={[...growthCurrentMarketing]}
          value={data.current_marketing}
          onToggle={(v) =>
            setData({ ...data, current_marketing: toggleIn(data.current_marketing, v) })
          }
        />
      )}

      {step === 5 && (
        <ChoiceGrid
          label="What is your approximate current monthly marketing investment?"
          error={errors.budgetId}
          options={growthBudgets.map((b) => b.label)}
          value={
            data.budgetId
              ? [growthBudgets.find((b) => b.id === data.budgetId)?.label || ""]
              : []
          }
          onToggle={(label) => {
            const id = growthBudgets.find((b) => b.label === label)?.id || "";
            setData({ ...data, budgetId: id });
          }}
          single
        />
      )}

      {step === 6 && (
        <ChoiceGrid
          label="Which monthly plan are you considering?"
          error={errors.planId}
          options={growthPlans.map((p) => p.label)}
          value={
            data.planId
              ? [growthPlans.find((p) => p.id === data.planId)?.label || ""]
              : []
          }
          onToggle={(label) => {
            const id = growthPlans.find((p) => p.label === label)?.id || "";
            setData({ ...data, planId: id });
          }}
          single
        />
      )}

      {step === 7 && (
        <ChoiceGrid
          label="When are you planning to start?"
          error={errors.timelineId}
          options={growthTimelines.map((t) => t.label)}
          value={
            data.timelineId
              ? [growthTimelines.find((t) => t.id === data.timelineId)?.label || ""]
              : []
          }
          onToggle={(label) => {
            const id = growthTimelines.find((t) => t.label === label)?.id || "";
            setData({ ...data, timelineId: id });
          }}
          single
        />
      )}

      {step === 8 && (
        <div className="growth-form__grid growth-form__grid--single">
          <Field
            label="Tell us about your business, current marketing challenges and what you want to achieve."
            error={errors.business_description}
          >
            <textarea
              rows={5}
              value={data.business_description}
              onChange={(e) =>
                setData({ ...data, business_description: e.target.value })
              }
            />
          </Field>
          <label className={`growth-check ${errors.consent ? "is-error" : ""}`}>
            <input
              type="checkbox"
              checked={data.consent}
              onChange={(e) => setData({ ...data, consent: e.target.checked })}
            />
            <span>
              I agree to be contacted by DisplayAvenue regarding my enquiry.{" "}
              <Link to="/privacy">Privacy Policy</Link> · <Link to="/terms">Terms</Link>
            </span>
          </label>
          {errors.consent && <p className="growth-field__error">{errors.consent}</p>}
          {/* honeypot */}
          <input
            className="growth-hp"
            tabIndex={-1}
            autoComplete="off"
            value={data.website}
            onChange={(e) => setData({ ...data, website: e.target.value })}
            aria-hidden
          />
        </div>
      )}

      {submitError && <p className="growth-form__error">{submitError}</p>}

      <div className="growth-form__nav">
        {step > 1 ? (
          <button type="button" className="growth-btn growth-btn--outline" onClick={goBack}>
            Back
          </button>
        ) : (
          <span />
        )}
        {step < total ? (
          <button type="button" className="growth-btn growth-btn--primary" onClick={goNext}>
            Next <span className="growth-btn__arrow">→</span>
          </button>
        ) : (
          <button
            type="button"
            className="growth-btn growth-btn--primary"
            onClick={submit}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Get My Growth Plan"}
            {!submitting && <span className="growth-btn__arrow">→</span>}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className={`growth-field ${error ? "is-error" : ""}`}>
      <span>{label}</span>
      {children}
      {error && (
        <span className="growth-field__error" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

function ChoiceGrid({
  label,
  hint,
  options,
  value,
  onToggle,
  single,
  error,
}: {
  label: string;
  hint?: string;
  options: string[];
  value: string[];
  onToggle: (v: string) => void;
  single?: boolean;
  error?: string;
}) {
  return (
    <fieldset className="growth-choices">
      <legend>{label}</legend>
      {hint && <p className="growth-choices__hint">{hint}</p>}
      <div className="growth-choices__grid">
        {options.map((opt) => {
          const active = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              className={`growth-chip ${active ? "is-active" : ""}`}
              aria-pressed={active}
              onClick={() => onToggle(opt)}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="growth-field__error" role="alert">
          {error}
        </p>
      )}
      {single ? null : null}
    </fieldset>
  );
}

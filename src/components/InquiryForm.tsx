import { useState, type FormEvent } from "react";
import { submitInquiry, type InquiryType } from "../utils/submitInquiry";

type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
};

type Props = {
  type: InquiryType;
  title?: string;
  submitLabel?: string;
  fields: Field[];
  hidden?: Record<string, string>;
};

export function InquiryForm({
  type,
  title,
  submitLabel = "Send enquiry",
  fields,
  hidden,
}: Props) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await submitInquiry(type, { ...hidden, ...values });
      setDone(true);
      setValues({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="inquiry-success">
        <h3>Thank you</h3>
        <p>
          We received your enquiry. Our Mira Road desk will respond on call or
          WhatsApp shortly.
        </p>
        <button className="btn btn--outline" type="button" onClick={() => setDone(false)}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form className="inquiry-form" onSubmit={onSubmit}>
      {title ? <h3>{title}</h3> : null}
      <div className="form-grid">
        {fields.map((field) => (
          <div className="field" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            {field.options ? (
              <select
                id={field.name}
                required={field.required}
                value={values[field.name] || ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [field.name]: e.target.value }))
                }
              >
                <option value="">Select</option>
                {field.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : field.type === "textarea" ? (
              <textarea
                id={field.name}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [field.name]: e.target.value }))
                }
              />
            ) : (
              <input
                id={field.name}
                type={field.type || "text"}
                required={field.required}
                placeholder={field.placeholder}
                value={values[field.name] || ""}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [field.name]: e.target.value }))
                }
              />
            )}
          </div>
        ))}
      </div>
      {error ? <p className="form-note form-note--err">{error}</p> : null}
      <button className="btn btn--primary" type="submit" disabled={loading}>
        {loading ? "Sending…" : submitLabel}
      </button>
      <p className="form-note">
        Prefer faster? WhatsApp us, we usually reply quicker there.
      </p>
    </form>
  );
}

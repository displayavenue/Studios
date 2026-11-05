"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/clientApi";
import { LoadingBlock, ModuleNotReady } from "@/components/ModuleState";

type CompanyProfile = {
  id?: string;
  legalName?: string;
  brandName?: string;
  gstin?: string;
  phone?: string;
  whatsapp?: string | null;
  email?: string | null;
  website?: string | null;
  registeredAddress?: string | null;
  billingAddress?: string | null;
  state?: string;
  city?: string | null;
  pincode?: string | null;
  defaultGstPercent?: number;
  defaultAdvancePct?: number;
  defaultValidityDays?: number;
  quotationPrefix?: string;
  quotationDigits?: number;
  invoicePrefix?: string;
  receiptPrefix?: string;
  showWhyChoose?: boolean;
  whyChooseItems?: string[] | null;
  trustItems?: string[] | null;
};

const DEFAULTS: CompanyProfile = {
  legalName: "Mediashouter",
  brandName: "DisplayAvenue",
  gstin: "27ALJPY9454C1ZJ",
  phone: "9222122333",
  email: "",
  registeredAddress: "",
  billingAddress: "",
  state: "Maharashtra",
  defaultGstPercent: 18,
  defaultAdvancePct: 60,
  defaultValidityDays: 15,
  quotationPrefix: "DA",
  quotationDigits: 5,
  invoicePrefix: "DAV",
  receiptPrefix: "DAR",
};

export default function QuoteSettingsPage() {
  const [form, setForm] = useState<CompanyProfile>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [notReady, setNotReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await apiFetch<CompanyProfile>("/api/company-profile");
      if (!res.ok && res.notReady) {
        setNotReady(true);
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setError(res.error || "Failed to load company profile");
        setLoading(false);
        return;
      }
      setForm({
        ...DEFAULTS,
        ...res.data,
        email: res.data.email ?? "",
        registeredAddress: res.data.registeredAddress ?? "",
        billingAddress: res.data.billingAddress ?? "",
      });
      setLoading(false);
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);
    const res = await apiFetch<CompanyProfile>("/api/company-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        email: form.email || null,
        registeredAddress: form.registeredAddress || null,
        billingAddress: form.billingAddress || null,
        defaultGstPercent: Number(form.defaultGstPercent) || 18,
        defaultAdvancePct: Number(form.defaultAdvancePct) || 60,
        defaultValidityDays: Number(form.defaultValidityDays) || 15,
        quotationDigits: Number(form.quotationDigits) || 5,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error || "Failed to save");
      return;
    }
    setForm({ ...DEFAULTS, ...res.data });
    setSaved(true);
  }

  if (loading) return <LoadingBlock label="Loading quote settings…" />;

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <h1 className="display" style={{ margin: "0 0 .35rem", color: "var(--navy)" }}>Quote settings</h1>
      <p style={{ margin: "0 0 1.25rem", color: "var(--muted)" }}>Company profile shown on client quotations.</p>

      {notReady && <ModuleNotReady moduleName="Company profile" />}
      {error && !notReady && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {saved && <p style={{ color: "var(--ok)", fontWeight: 700 }}>Saved</p>}

      {!notReady && (
        <form className="panel" style={{ padding: "1.2rem", display: "grid", gap: ".85rem", maxWidth: 720 }} onSubmit={save}>
          <div style={{ display: "grid", gap: ".75rem", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
            <TextField label="Legal name" value={form.legalName || ""} onChange={(v) => setForm({ ...form, legalName: v })} />
            <TextField label="Brand name" value={form.brandName || ""} onChange={(v) => setForm({ ...form, brandName: v })} />
            <TextField label="GSTIN" value={form.gstin || ""} onChange={(v) => setForm({ ...form, gstin: v })} />
            <TextField label="Phone" value={form.phone || ""} onChange={(v) => setForm({ ...form, phone: v })} />
            <TextField label="WhatsApp" value={form.whatsapp || ""} onChange={(v) => setForm({ ...form, whatsapp: v })} />
            <TextField label="Email (optional)" value={form.email || ""} onChange={(v) => setForm({ ...form, email: v })} placeholder="Leave blank" />
            <TextField label="Website" value={form.website || ""} onChange={(v) => setForm({ ...form, website: v })} />
            <TextField label="State" value={form.state || ""} onChange={(v) => setForm({ ...form, state: v })} />
            <TextField label="City" value={form.city || ""} onChange={(v) => setForm({ ...form, city: v })} />
            <NumField label="Default advance %" value={form.defaultAdvancePct ?? 60} onChange={(v) => setForm({ ...form, defaultAdvancePct: v })} />
            <NumField label="Default GST %" value={form.defaultGstPercent ?? 18} onChange={(v) => setForm({ ...form, defaultGstPercent: v })} />
            <NumField label="Validity days" value={form.defaultValidityDays ?? 15} onChange={(v) => setForm({ ...form, defaultValidityDays: v })} />
            <TextField label="Quotation prefix" value={form.quotationPrefix || ""} onChange={(v) => setForm({ ...form, quotationPrefix: v })} />
            <NumField label="Quotation digits" value={form.quotationDigits ?? 5} onChange={(v) => setForm({ ...form, quotationDigits: v })} />
            <TextField label="Invoice prefix" value={form.invoicePrefix || ""} onChange={(v) => setForm({ ...form, invoicePrefix: v })} />
            <TextField label="Receipt prefix" value={form.receiptPrefix || ""} onChange={(v) => setForm({ ...form, receiptPrefix: v })} />
          </div>

          <label style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
            Registered address (optional)
            <textarea
              className="input"
              rows={2}
              value={form.registeredAddress || ""}
              onChange={(e) => setForm({ ...form, registeredAddress: e.target.value })}
              placeholder="Leave blank"
              style={{ minHeight: 72 }}
            />
          </label>
          <label style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
            Billing address (optional)
            <textarea
              className="input"
              rows={2}
              value={form.billingAddress || ""}
              onChange={(e) => setForm({ ...form, billingAddress: e.target.value })}
              placeholder="Leave blank"
              style={{ minHeight: 72 }}
            />
          </label>

          <button type="submit" className="btn btn-primary" disabled={saving} style={{ width: "fit-content" }}>
            {saving ? "Saving…" : "Save settings"}
          </button>
        </form>
      )}
    </main>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
      {label}
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
      {label}
      <input className="input" type="number" min={0} step="any" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

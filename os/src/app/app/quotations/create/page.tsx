"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, asArray } from "@/lib/clientApi";
import { LoadingBlock, ModuleNotReady } from "@/components/ModuleState";
import { formatInrAmount, formatInrFromPaise } from "@/lib/quotations/format";
import { calcAdvancePaise, calcLine, calcQuoteTotals } from "@/lib/quotations/money";

type QuoteClient = {
  id: string;
  companyName: string;
  contactPerson?: string | null;
  email?: string | null;
  mobile?: string | null;
  state?: string | null;
  gstin?: string | null;
};

type CatalogService = {
  id: string;
  name: string;
  description?: string | null;
  defaultPriceInr?: number;
  gstPercent?: number;
  billingType?: string;
  category?: { name?: string } | string | null;
  categoryName?: string | null;
};

type CompanyProfile = {
  legalName?: string;
  brandName?: string;
  state?: string;
  defaultAdvancePct?: number;
  defaultGstPercent?: number;
  defaultValidityDays?: number;
};

type LineItem = {
  key: string;
  catalogServiceId?: string;
  serviceName: string;
  category: string;
  description: string;
  quantity: number;
  unitPriceInr: number;
  discountPercent: number;
  gstPercent: number;
  billingType: string;
};

const STEPS = ["Client", "Services", "Payment & terms", "Preview"] as const;

function newKey() {
  return `li_${Math.random().toString(36).slice(2, 10)}`;
}

export default function CreateQuotationPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [notReady, setNotReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [clients, setClients] = useState<QuoteClient[]>([]);
  const [services, setServices] = useState<CatalogService[]>([]);
  const [company, setCompany] = useState<CompanyProfile | null>(null);

  const [clientId, setClientId] = useState("");
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    mobile: "",
    state: "Maharashtra",
    gstin: "",
  });

  const [items, setItems] = useState<LineItem[]>([]);
  const [advancePercent, setAdvancePercent] = useState(60);
  const [validityDays, setValidityDays] = useState(15);
  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");
  const [paymentPlanType, setPaymentPlanType] = useState("ADVANCE_BALANCE");
  const [whyChooseEnabled, setWhyChooseEnabled] = useState(true);
  const [showTrust, setShowTrust] = useState(true);

  useEffect(() => {
    (async () => {
      const [c, s, p] = await Promise.all([
        apiFetch<{ clients: QuoteClient[] } | QuoteClient[]>("/api/quote-clients"),
        apiFetch<{ services: CatalogService[] } | CatalogService[]>("/api/quote-services"),
        apiFetch<CompanyProfile>("/api/company-profile"),
      ]);

      if ((!c.ok && c.notReady) && (!s.ok && s.notReady) && (!p.ok && p.notReady)) {
        setNotReady(true);
        setLoading(false);
        return;
      }

      if (c.ok) setClients(Array.isArray(c.data) ? c.data : asArray(c.data.clients));
      if (s.ok) setServices(Array.isArray(s.data) ? s.data : asArray(s.data.services));
      if (p.ok) {
        setCompany(p.data);
        setAdvancePercent(p.data.defaultAdvancePct ?? 60);
        setValidityDays(p.data.defaultValidityDays ?? 15);
      }
      if (!c.ok && !s.ok && !p.ok) setError(c.error || s.error || p.error || "Failed to load wizard data");
      setLoading(false);
    })();
  }, []);

  const selectedClient = clients.find((c) => c.id === clientId);

  const preview = useMemo(() => {
    const lines = items
      .filter((i) => i.serviceName.trim())
      .map((i) =>
        calcLine({
          quantity: i.quantity,
          unitPriceInr: i.unitPriceInr,
          discountPercent: i.discountPercent,
          gstPercent: i.gstPercent,
        }),
      );
    const totals = calcQuoteTotals(lines, company?.state || "Maharashtra", selectedClient?.state);
    const advance = calcAdvancePaise(totals.grandTotalPaise, advancePercent);
    return { lines, totals, ...advance };
  }, [items, company?.state, selectedClient?.state, advancePercent]);

  async function createClientInline() {
    setError("");
    if (!newClient.companyName.trim()) {
      setError("Company name is required");
      return;
    }
    const res = await apiFetch<QuoteClient>("/api/quote-clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient),
    });
    if (!res.ok) {
      setError(res.error || "Could not create client");
      return;
    }
    setClients((prev) => [res.data, ...prev]);
    setClientId(res.data.id);
    setShowNewClient(false);
    setNewClient({ companyName: "", contactPerson: "", email: "", mobile: "", state: "Maharashtra", gstin: "" });
  }

  function addFromCatalog(svc: CatalogService) {
    const category =
      typeof svc.category === "string"
        ? svc.category
        : svc.category?.name || svc.categoryName || "";
    setItems((prev) => [
      ...prev,
      {
        key: newKey(),
        catalogServiceId: svc.id,
        serviceName: svc.name,
        category,
        description: svc.description || "",
        quantity: 1,
        unitPriceInr: svc.defaultPriceInr ?? 0,
        discountPercent: 0,
        gstPercent: svc.gstPercent ?? company?.defaultGstPercent ?? 18,
        billingType: svc.billingType || "one_time",
      },
    ]);
  }

  function addBlankLine() {
    setItems((prev) => [
      ...prev,
      {
        key: newKey(),
        serviceName: "",
        category: "",
        description: "",
        quantity: 1,
        unitPriceInr: 0,
        discountPercent: 0,
        gstPercent: company?.defaultGstPercent ?? 18,
        billingType: "one_time",
      },
    ]);
  }

  function updateItem(key: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  }

  function removeItem(key: string) {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  function canNext() {
    if (step === 0) return Boolean(clientId);
    if (step === 1) return items.some((i) => i.serviceName.trim() && i.quantity > 0);
    return true;
  }

  async function submit() {
    setSaving(true);
    setError("");
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validityDays);

    const res = await apiFetch<{ id: string }>("/api/quotations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        advancePercent,
        paymentPlanType,
        notes,
        termsSnapshot: terms || undefined,
        whyChooseEnabled,
        showTrust,
        validUntil: validUntil.toISOString(),
        items: items
          .filter((i) => i.serviceName.trim())
          .map((i, idx) => ({
            sortOrder: idx,
            catalogServiceId: i.catalogServiceId,
            serviceName: i.serviceName,
            category: i.category || undefined,
            description: i.description || undefined,
            quantity: i.quantity,
            unitPriceInr: i.unitPriceInr,
            discountPercent: i.discountPercent,
            gstPercent: i.gstPercent,
            billingType: i.billingType,
          })),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error || "Failed to create quotation");
      return;
    }
    router.push(`/app/quotations/${res.data.id}`);
  }

  if (loading) return <LoadingBlock label="Loading quotation wizard…" />;

  return (
    <main className="container" style={{ padding: "1.25rem 0 3rem" }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link href="/app/quotations" style={{ color: "var(--muted)", fontWeight: 600, fontSize: ".9rem" }}>
          ← Quotations
        </Link>
        <h1 className="display" style={{ margin: ".35rem 0", color: "var(--navy)" }}>Create quotation</h1>
      </div>

      {notReady && <ModuleNotReady moduleName="Quotations" />}
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {!notReady && (
        <>
          <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                className="btn btn-secondary"
                onClick={() => i < step && setStep(i)}
                style={{
                  padding: ".45rem .9rem",
                  minHeight: 36,
                  fontSize: ".85rem",
                  background: i === step ? "var(--blue-soft)" : undefined,
                  borderColor: i === step ? "rgba(31,111,235,.45)" : undefined,
                }}
              >
                {i + 1}. {label}
              </button>
            ))}
          </div>

          {step === 0 && (
            <section className="panel" style={{ padding: "1.2rem" }}>
              <h2 className="display" style={{ marginTop: 0, fontSize: "1.15rem", color: "var(--navy)" }}>Select client</h2>
              <label style={{ display: "block", fontWeight: 700, marginBottom: ".4rem" }}>Client</label>
              <select className="input" value={clientId} onChange={(e) => setClientId(e.target.value)}>
                <option value="">Choose a client…</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName}
                    {c.contactPerson ? ` — ${c.contactPerson}` : ""}
                  </option>
                ))}
              </select>

              <div style={{ marginTop: "1rem" }}>
                <button type="button" className="btn btn-secondary" style={{ padding: ".55rem 1rem" }} onClick={() => setShowNewClient((v) => !v)}>
                  {showNewClient ? "Hide new client form" : "Create client inline"}
                </button>
              </div>

              {showNewClient && (
                <div style={{ marginTop: "1rem", display: "grid", gap: ".75rem", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))" }}>
                  <Field label="Company name *" value={newClient.companyName} onChange={(v) => setNewClient({ ...newClient, companyName: v })} />
                  <Field label="Contact person" value={newClient.contactPerson} onChange={(v) => setNewClient({ ...newClient, contactPerson: v })} />
                  <Field label="Email" value={newClient.email} onChange={(v) => setNewClient({ ...newClient, email: v })} />
                  <Field label="Mobile" value={newClient.mobile} onChange={(v) => setNewClient({ ...newClient, mobile: v })} />
                  <Field label="State" value={newClient.state} onChange={(v) => setNewClient({ ...newClient, state: v })} />
                  <Field label="GSTIN" value={newClient.gstin} onChange={(v) => setNewClient({ ...newClient, gstin: v })} />
                  <div style={{ gridColumn: "1 / -1" }}>
                    <button type="button" className="btn btn-primary" style={{ padding: ".65rem 1.1rem" }} onClick={createClientInline}>
                      Save client
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}

          {step === 1 && (
            <section className="panel" style={{ padding: "1.2rem" }}>
              <h2 className="display" style={{ marginTop: 0, fontSize: "1.15rem", color: "var(--navy)" }}>Services & line items</h2>
              {services.length > 0 && (
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ fontWeight: 700, marginBottom: ".5rem" }}>Add from catalog</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: ".45rem" }}>
                    {services.slice(0, 24).map((svc) => (
                      <button
                        key={svc.id}
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: ".4rem .75rem", minHeight: 36, fontSize: ".82rem" }}
                        onClick={() => addFromCatalog(svc)}
                      >
                        + {svc.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gap: ".85rem" }}>
                {items.map((item) => (
                  <div key={item.key} style={{ border: "1px solid var(--line)", borderRadius: 14, padding: ".9rem", background: "#fff" }}>
                    <div style={{ display: "grid", gap: ".65rem", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))" }}>
                      <Field label="Service" value={item.serviceName} onChange={(v) => updateItem(item.key, { serviceName: v })} />
                      <Field label="Category" value={item.category} onChange={(v) => updateItem(item.key, { category: v })} />
                      <NumField label="Qty" value={item.quantity} onChange={(v) => updateItem(item.key, { quantity: v })} />
                      <NumField label="Rate (₹)" value={item.unitPriceInr} onChange={(v) => updateItem(item.key, { unitPriceInr: v })} />
                      <NumField label="Discount %" value={item.discountPercent} onChange={(v) => updateItem(item.key, { discountPercent: v })} />
                      <NumField label="GST %" value={item.gstPercent} onChange={(v) => updateItem(item.key, { gstPercent: v })} />
                    </div>
                    <div style={{ marginTop: ".65rem" }}>
                      <Field label="Description" value={item.description} onChange={(v) => updateItem(item.key, { description: v })} />
                    </div>
                    <div style={{ marginTop: ".65rem", display: "flex", justifyContent: "space-between", gap: ".5rem", flexWrap: "wrap" }}>
                      <span style={{ color: "var(--muted)", fontSize: ".9rem" }}>
                        Line total:{" "}
                        {formatInrFromPaise(
                          calcLine({
                            quantity: item.quantity,
                            unitPriceInr: item.unitPriceInr,
                            discountPercent: item.discountPercent,
                            gstPercent: item.gstPercent,
                          }).totalPaise,
                        )}
                      </span>
                      <button type="button" className="btn btn-secondary" style={{ padding: ".35rem .75rem", minHeight: 34 }} onClick={() => removeItem(item.key)}>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" className="btn btn-secondary" style={{ marginTop: "1rem", padding: ".55rem 1rem" }} onClick={addBlankLine}>
                Add blank line
              </button>
            </section>
          )}

          {step === 2 && (
            <section className="panel" style={{ padding: "1.2rem", display: "grid", gap: ".85rem", maxWidth: 560 }}>
              <h2 className="display" style={{ margin: 0, fontSize: "1.15rem", color: "var(--navy)" }}>Payment & terms</h2>
              <NumField label="Advance %" value={advancePercent} onChange={setAdvancePercent} />
              <NumField label="Validity (days)" value={validityDays} onChange={setValidityDays} />
              <label style={{ display: "grid", gap: ".35rem", fontWeight: 700 }}>
                Payment plan
                <select className="input" value={paymentPlanType} onChange={(e) => setPaymentPlanType(e.target.value)}>
                  <option value="ADVANCE_BALANCE">Advance + balance</option>
                  <option value="FULL">Full payment</option>
                  <option value="CUSTOM_PERCENT">Custom percent</option>
                  <option value="MILESTONE">Milestone</option>
                  <option value="SUBSCRIPTION">Subscription</option>
                </select>
              </label>
              <label style={{ display: "grid", gap: ".35rem", fontWeight: 700 }}>
                Client-facing notes
                <textarea className="input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} style={{ minHeight: 88 }} />
              </label>
              <label style={{ display: "grid", gap: ".35rem", fontWeight: 700 }}>
                Terms (optional override)
                <textarea className="input" rows={6} value={terms} onChange={(e) => setTerms(e.target.value)} style={{ minHeight: 140 }} placeholder="Leave blank to use default terms" />
              </label>
              <label style={{ display: "flex", gap: ".55rem", alignItems: "center", fontWeight: 600 }}>
                <input type="checkbox" checked={whyChooseEnabled} onChange={(e) => setWhyChooseEnabled(e.target.checked)} />
                Show “Why Choose DisplayAvenue”
              </label>
              <label style={{ display: "flex", gap: ".55rem", alignItems: "center", fontWeight: 600 }}>
                <input type="checkbox" checked={showTrust} onChange={(e) => setShowTrust(e.target.checked)} />
                Show trust signals
              </label>
            </section>
          )}

          {step === 3 && (
            <section className="panel" style={{ padding: "1.2rem" }}>
              <h2 className="display" style={{ marginTop: 0, fontSize: "1.15rem", color: "var(--navy)" }}>Preview</h2>
              <p style={{ color: "var(--muted)", marginTop: 0 }}>
                Prepared for <strong>{selectedClient?.companyName || "—"}</strong>
                {company?.brandName ? ` · From ${company.brandName}` : ""}
              </p>
              <ul style={{ paddingLeft: "1.1rem", margin: "0 0 1rem" }}>
                {items.filter((i) => i.serviceName.trim()).map((i) => (
                  <li key={i.key} style={{ marginBottom: ".35rem" }}>
                    {i.serviceName} × {i.quantity} @ {formatInrAmount(i.unitPriceInr)}
                    {i.discountPercent ? ` (−${i.discountPercent}%)` : ""} · GST {i.gstPercent}%
                  </li>
                ))}
              </ul>
              <div style={{ display: "grid", gap: ".35rem", maxWidth: 360 }}>
                <Row label="Taxable" value={formatInrFromPaise(preview.totals.taxablePaise)} />
                {preview.totals.gstMode === "CGST_SGST" && (
                  <>
                    <Row label="CGST" value={formatInrFromPaise(preview.totals.cgstPaise)} />
                    <Row label="SGST" value={formatInrFromPaise(preview.totals.sgstPaise)} />
                  </>
                )}
                {preview.totals.gstMode === "IGST" && <Row label="IGST" value={formatInrFromPaise(preview.totals.igstPaise)} />}
                <Row label="Grand total" value={formatInrFromPaise(preview.totals.grandTotalPaise)} bold />
                <Row label={`Pay now (${advancePercent}%)`} value={formatInrFromPaise(preview.advancePaise)} bold />
                <Row label="Balance" value={formatInrFromPaise(preview.balancePaise)} />
              </div>
            </section>
          )}

          <div style={{ display: "flex", gap: ".65rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
            {step > 0 && (
              <button type="button" className="btn btn-secondary" onClick={() => setStep((s) => s - 1)} disabled={saving}>
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button type="button" className="btn btn-primary" disabled={!canNext()} onClick={() => setStep((s) => s + 1)}>
                Continue
              </button>
            ) : (
              <button type="button" className="btn btn-primary" disabled={saving || !canNext()} onClick={submit}>
                {saving ? "Creating…" : "Create quotation"}
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
      {label}
      <input className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}

function NumField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label style={{ display: "grid", gap: ".3rem", fontWeight: 700, fontSize: ".9rem" }}>
      {label}
      <input
        className="input"
        type="number"
        min={0}
        step="any"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", fontWeight: bold ? 800 : 600 }}>
      <span style={{ color: "var(--muted)" }}>{label}</span>
      <span style={{ color: "var(--navy)" }}>{value}</span>
    </div>
  );
}

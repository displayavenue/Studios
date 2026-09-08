"use client";
import { useMemo, useState } from "react";
import { simulateBusiness } from "@/services/profit/client-sim";
import { formatINR } from "@/lib/utils";

export default function SimulatorPage() {
  const [aov, setAov] = useState(2500);
  const [orders, setOrders] = useState(40);
  const [conversion, setConversion] = useState(2);
  const [cac, setCac] = useState(600);
  const [margin, setMargin] = useState(40);
  const [shipping, setShipping] = useState(80);
  const [refundRate, setRefundRate] = useState(0.05);
  const [rtoRate, setRtoRate] = useState(0.08);

  const result = useMemo(
    () =>
      simulateBusiness({
        aov, orders, conversionRate: conversion, cac,
        productMarginPercent: margin, shippingPerOrder: shipping,
        refundRate, rtoRate, taxRate: 0.18, paymentFeeRate: 0.02,
      }),
    [aov, orders, conversion, cac, margin, shipping, refundRate, rtoRate],
  );

  const Field = ({ label, value, set, step = 1 }: { label: string; value: number; set: (n: number) => void; step?: number }) => (
    <label className="block text-sm">
      <span className="text-[#8fa396]">{label}</span>
      <input type="number" step={step} value={value} onChange={(e) => set(Number(e.target.value))}
        className="mt-1 h-10 w-full rounded-md border border-white/10 bg-black/20 px-3" />
    </label>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-white">Daily Target Simulator</h1>
        <p className="mt-2 text-sm text-amber-300/90">SIMULATION ONLY — not a forecast or guarantee.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-panel grid gap-3 p-5 sm:grid-cols-2">
          <Field label="AOV (₹)" value={aov} set={setAov} />
          <Field label="Orders" value={orders} set={setOrders} />
          <Field label="Conversion %" value={conversion} set={setConversion} step={0.1} />
          <Field label="CAC (₹)" value={cac} set={setCac} />
          <Field label="Product margin %" value={margin} set={setMargin} />
          <Field label="Shipping / order" value={shipping} set={setShipping} />
          <Field label="Refund rate" value={refundRate} set={setRefundRate} step={0.01} />
          <Field label="RTO rate" value={rtoRate} set={setRtoRate} step={0.01} />
        </div>
        <div className="admin-panel space-y-3 p-5 text-sm">
          <Row label="Revenue" value={formatINR(result.revenue)} />
          <Row label="Ad spend" value={formatINR(result.adSpend)} />
          <Row label="Contribution before ads" value={formatINR(result.contributionBeforeAds)} />
          <Row label="Net contribution" value={formatINR(result.netContribution)} />
          <Row label="Visitors required" value={String(result.visitors)} />
          <Row label="Orders for ₹1L revenue" value={String(result.requiredOrdersFor1Lakh ?? "—")} />
          <p className="pt-2 text-xs text-[#6f7f74]">{result.note}</p>
          <div className="grid grid-cols-3 gap-2 pt-4 text-center text-xs">
            <div className="rounded border border-white/10 p-3"><div className="text-[#8fa396]">Conservative</div><div className="mt-1 text-lg text-white">₹50k</div></div>
            <div className="rounded border border-emerald-500/30 p-3"><div className="text-[#8fa396]">Base</div><div className="mt-1 text-lg text-white">₹1L</div></div>
            <div className="rounded border border-white/10 p-3"><div className="text-[#8fa396]">Aggressive</div><div className="mt-1 text-lg text-white">₹2L</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 py-2">
      <span className="text-[#8fa396]">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}

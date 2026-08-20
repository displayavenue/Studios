<?php
declare(strict_types=1);
/**
 * Public quotation page: /q/{number}/{token}
 * Served via public/q/.htaccess rewrite.
 */
$uri = $_SERVER['REQUEST_URI'] ?? '';
$path = parse_url($uri, PHP_URL_PATH) ?: '';
$parts = array_values(array_filter(explode('/', trim($path, '/'))));
// Expect: q / NUMBER / TOKEN
$number = $parts[1] ?? ($_GET['number'] ?? '');
$token = $parts[2] ?? ($_GET['token'] ?? '');
$number = rawurldecode((string) $number);
$token = rawurldecode((string) $token);
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Quotation · DisplayAvenue</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>
    :root { --navy:#071833; --blue:#1f6feb; --muted:#5b6b7c; --sand:#f4f7fb; --ok:#0a7a3e; --line:rgba(15,40,70,.12); }
    * { box-sizing: border-box; }
    body { margin:0; font-family:Manrope,system-ui,sans-serif; color:#102033; background:radial-gradient(900px 420px at 10% -10%, rgba(31,111,235,.16), transparent 55%), linear-gradient(180deg,#f7f4ee,#eef3f8 45%,#f8fafc); min-height:100vh; }
    .wrap { width:min(920px, calc(100% - 2rem)); margin:0 auto; padding:1.5rem 0 3rem; }
    .brand { font-family:Fraunces,Georgia,serif; font-size:1.35rem; color:var(--navy); font-weight:700; }
    .tag { font-size:.72rem; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
    .panel { background:rgba(255,255,255,.9); border:1px solid var(--line); border-radius:18px; padding:1.25rem; margin-top:1rem; box-shadow:0 12px 40px rgba(7,24,51,.06); }
    h1 { font-family:Fraunces,Georgia,serif; font-size:clamp(1.6rem,4vw,2.2rem); margin:.35rem 0 .5rem; color:var(--navy); }
    .muted { color:var(--muted); }
    .grid { display:grid; gap:.75rem; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); }
    .metric { background:#f8fafc; border-radius:12px; padding:.85rem 1rem; }
    .metric strong { display:block; font-size:1.05rem; color:var(--navy); }
    table { width:100%; border-collapse:collapse; font-size:.92rem; }
    th, td { text-align:left; padding:.65rem .35rem; border-bottom:1px solid var(--line); vertical-align:top; }
    th { color:var(--muted); font-weight:600; font-size:.78rem; text-transform:uppercase; letter-spacing:.04em; }
    .actions { display:flex; flex-wrap:wrap; gap:.6rem; margin-top:1rem; }
    button, .btn { appearance:none; border:0; border-radius:999px; min-height:44px; padding:.75rem 1.15rem; font-weight:800; cursor:pointer; font:inherit; text-decoration:none; display:inline-flex; align-items:center; }
    .primary { background:var(--navy); color:#fff; }
    .secondary { background:#fff; color:var(--navy); border:1px solid var(--line); }
    .ok { color:var(--ok); font-weight:700; }
    .err { color:#b42318; }
    .terms { white-space:pre-wrap; font-size:.88rem; line-height:1.55; color:#334; }
    input { width:100%; min-height:42px; border:1px solid var(--line); border-radius:10px; padding:.55rem .75rem; font:inherit; }
    label { display:grid; gap:.3rem; font-size:.85rem; font-weight:600; color:var(--muted); }
    .accept { display:grid; gap:.75rem; margin-top:1rem; }
  </style>
</head>
<body>
  <div class="wrap" id="app">
    <div class="tag">Secure quotation</div>
    <div class="brand">DisplayAvenue</div>
    <p class="muted" id="loading">Loading quotation…</p>
  </div>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <script>
    const NUMBER = <?= json_encode($number) ?>;
    const TOKEN = <?= json_encode($token) ?>;
    const API = "/admin/quotes/api.php";
    const inr = (paise) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format((Number(paise||0))/100);

    async function api(action, payload) {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, number: NUMBER, token: TOKEN, ...payload }),
      });
      const json = await res.json().catch(() => ({ ok:false, error:"Bad response" }));
      if (!res.ok || json.ok === false) throw new Error(json.error || "Request failed");
      return json;
    }

    function render(data) {
      const app = document.getElementById("app");
      const c = data.company || {};
      const client = data.client || {};
      const remaining = Math.max(0, (data.grandTotalPaise||0) - (data.paidPaise||0));
      const canAccept = ["SENT","VIEWED"].includes(data.status);
      const canPay = ["ACCEPTED","PARTIALLY_PAID","VIEWED","SENT"].includes(data.status) && remaining > 0;
      app.innerHTML = `
        <div class="tag">${c.brandName || "DisplayAvenue"} · Mediashouter</div>
        <div class="brand">${c.brandName || "DisplayAvenue"}</div>
        <div class="panel">
          <div class="tag">Quotation ${data.quotationNumber}</div>
          <h1>${client.companyName || "Your quotation"}</h1>
          <p class="muted">Valid until ${data.validUntil} · Status: <strong>${data.status}</strong> · Payment: <strong>${data.paymentStatus}</strong></p>
          <div class="grid" style="margin-top:1rem">
            <div class="metric"><span class="muted">Grand total</span><strong>${inr(data.grandTotalPaise)}</strong></div>
            <div class="metric"><span class="muted">Advance (${data.advancePercent}%)</span><strong>${inr(data.advancePaise)}</strong></div>
            <div class="metric"><span class="muted">Paid</span><strong>${inr(data.paidPaise)}</strong></div>
            <div class="metric"><span class="muted">Remaining</span><strong>${inr(remaining)}</strong></div>
          </div>
        </div>
        <div class="panel">
          <h3 style="margin:0 0 .75rem;color:var(--navy)">Line items</h3>
          <table>
            <thead><tr><th>Service</th><th>Qty</th><th>Amount</th></tr></thead>
            <tbody>
              ${(data.items||[]).map(it => `<tr>
                <td><strong>${escapeHtml(it.serviceName)}</strong><div class="muted">${escapeHtml(it.description||"")}</div></td>
                <td>${it.quantity}</td>
                <td>${inr(it.totalPaise)}</td>
              </tr>`).join("")}
            </tbody>
          </table>
          <div style="margin-top:1rem;text-align:right" class="muted">
            Taxable ${inr(data.taxablePaise)} · GST ${inr(data.totalGstPaise)} (${data.gstMode}) · <strong style="color:var(--navy)">${inr(data.grandTotalPaise)}</strong>
          </div>
        </div>
        <div class="panel">
          <h3 style="margin:0 0 .5rem;color:var(--navy)">Terms</h3>
          <div class="terms">${escapeHtml(data.termsSnapshot||"")}</div>
          ${canAccept ? `
            <div class="accept">
              <label>Your name<input id="aname" placeholder="Full name" /></label>
              <label>Email<input id="aemail" type="email" placeholder="you@company.com" /></label>
              <div class="actions">
                <button class="primary" id="accept-btn">Accept quotation</button>
              </div>
            </div>` : `<p class="ok" style="margin-top:1rem">Accepted${data.acceptedName ? " by " + escapeHtml(data.acceptedName) : ""}.</p>`}
          ${canPay ? `<div class="actions"><button class="primary" id="pay-btn">Pay ${inr(Math.min(data.advancePaise, remaining))} now</button></div>` : ""}
          <p id="msg" class="muted" style="margin-top:.75rem"></p>
        </div>
        <p class="muted" style="margin-top:1rem;font-size:.85rem">${escapeHtml(c.legalName||"")} · GSTIN ${escapeHtml(c.gstin||"")} · ${escapeHtml(c.phone||"")}</p>
      `;
      const acceptBtn = document.getElementById("accept-btn");
      if (acceptBtn) acceptBtn.onclick = async () => {
        const msg = document.getElementById("msg");
        try {
          acceptBtn.disabled = true;
          const json = await api("public_accept", { name: document.getElementById("aname").value, email: document.getElementById("aemail").value });
          render(json.data);
        } catch (e) { msg.textContent = e.message; msg.className = "err"; acceptBtn.disabled = false; }
      };
      const payBtn = document.getElementById("pay-btn");
      if (payBtn) payBtn.onclick = () => startPay(data);
    }

    async function startPay(data) {
      const msg = document.getElementById("msg");
      try {
        const json = await api("public_pay", { kind: "ADVANCE" });
        const d = json.data;
        const rzp = new Razorpay({
          key: d.keyId,
          amount: d.amountPaise,
          currency: d.currency,
          name: d.name,
          description: d.description,
          order_id: d.orderId,
          handler: async function (response) {
            try {
              const verified = await api("public_verify", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              render(verified.data);
              document.getElementById("msg").textContent = "Payment successful.";
              document.getElementById("msg").className = "ok";
            } catch (e) {
              msg.textContent = e.message;
              msg.className = "err";
            }
          },
        });
        rzp.open();
      } catch (e) {
        msg.textContent = e.message;
        msg.className = "err";
      }
    }

    function escapeHtml(s) {
      return String(s||"").replace(/[&<>"']/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]));
    }

    (async () => {
      try {
        if (!NUMBER || !TOKEN) throw new Error("Invalid quotation link");
        const json = await api("public_get", {});
        render(json.data);
      } catch (e) {
        document.getElementById("app").innerHTML = `<h1>Link unavailable</h1><p class="err">${escapeHtml(e.message)}</p>`;
      }
    })();
  </script>
</body>
</html>

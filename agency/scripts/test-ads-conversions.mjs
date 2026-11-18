/** Smoke-test Ads send_to resolution (mirrors adsConversions.ts). */
function resolveSendTo(adsId, raw) {
  raw = String(raw || "").trim();
  if (!raw) return null;
  if (raw.includes("/")) return raw;
  adsId = String(adsId || "").trim();
  if (!adsId) return null;
  return `${adsId}/${raw}`;
}

const id = "AW-11371180411";
const cases = [
  ["", null],
  ["AbC-label", `${id}/AbC-label`],
  [`${id}/Full-Label`, `${id}/Full-Label`],
];
for (const [raw, expect] of cases) {
  const got = resolveSendTo(id, raw);
  if (got !== expect) {
    console.error("FAIL", { raw, expect, got });
    process.exit(1);
  }
}
console.log("ads conversion send_to resolution OK");

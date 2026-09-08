import { PDFDocument, StandardFonts, rgb, type PDFPage } from "pdf-lib";

export type PdfChapter = { title: string; body: string };

export type ReportPdfInput = {
  title: string;
  productSlug: string;
  personName: string;
  place: string;
  dob: string;
  birthTime?: string | null;
  birthTimeUnknown?: boolean;
  shortDescription?: string | null;
  overview: string;
  personality: string;
  guidance: string;
  chapters: PdfChapter[];
  included: string[];
  whoFor: string[];
  outcomes: string[];
  chartSummary: {
    mock: boolean;
    ascendant?: string;
    moonSign?: string;
    sunSign?: string;
    engineNote?: string;
    planets?: Record<string, { sign: string; house: number; note: string; formatted?: string; nakshatra?: string }>;
  };
  disclaimer: string;
  isSample?: boolean;
};

const PAGE_W = 595;
const PAGE_H = 842;
const MARGIN = 48;
const MAX_Y = PAGE_H - MARGIN;
const MIN_Y = 56;
const GOLD = rgb(0.78, 0.64, 0.15);
const INK = rgb(0.05, 0.08, 0.14);
const MUTED = rgb(0.4, 0.45, 0.52);
const LINE = rgb(0.85, 0.87, 0.9);

export async function buildReportPdf(input: ReportPdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const ctx = {
    doc,
    font,
    bold,
    page: null as PDFPage | null,
    y: MAX_Y,
  };

  const ensureSpace = (needed: number) => {
    if (!ctx.page || ctx.y - needed < MIN_Y) {
      ctx.page = doc.addPage([PAGE_W, PAGE_H]);
      ctx.y = MAX_Y;
      if (input.isSample) {
        ctx.page.drawText("SAMPLE — NOT A PERSONAL CHART", {
          x: MARGIN,
          y: PAGE_H - 28,
          size: 8,
          font: bold,
          color: rgb(0.75, 0.35, 0.1),
        });
      }
      // footer page hint drawn at end for each page via pass — keep simple footer now
      ctx.page.drawText("JyotishKundali · Interpretive guidance for reflection", {
        x: MARGIN,
        y: 28,
        size: 8,
        font,
        color: MUTED,
      });
    }
  };

  const write = (text: string, size = 11, useBold = false, color = INK, gapAfter = 6) => {
    ensureSpace(size + 10);
    const f = useBold ? bold : font;
    const maxChars = Math.floor((PAGE_W - MARGIN * 2) / (size * 0.52));
    const lines = wrapText(text, Math.max(40, maxChars));
    for (const line of lines) {
      ensureSpace(size + 8);
      ctx.page!.drawText(sanitize(line), {
        x: MARGIN,
        y: ctx.y,
        size,
        font: f,
        color,
      });
      ctx.y -= size + 4;
    }
    ctx.y -= gapAfter;
  };

  const hrule = () => {
    ensureSpace(12);
    ctx.page!.drawLine({
      start: { x: MARGIN, y: ctx.y + 4 },
      end: { x: PAGE_W - MARGIN, y: ctx.y + 4 },
      thickness: 0.6,
      color: LINE,
    });
    ctx.y -= 12;
  };

  // ── Cover ──────────────────────────────────────────────
  ensureSpace(200);
  write("JyotishKundali", 20, true, GOLD, 4);
  write(input.isSample ? "Sample Report Preview" : "Personal Interpretive Report", 10, false, MUTED, 10);
  write(input.title, 18, true, INK, 8);
  if (input.shortDescription) write(input.shortDescription, 11, false, MUTED, 12);
  hrule();
  write(`Prepared for: ${input.personName}`, 12, true);
  write(`Date of birth: ${input.dob}`);
  write(
    `Birth time: ${
      input.birthTimeUnknown || !input.birthTime
        ? "Unknown / approximate (time-sensitive notes marked carefully)"
        : input.birthTime
    }`,
  );
  write(`Place of birth: ${input.place}`);
  write(`Report id theme: ${input.productSlug}`, 9, false, MUTED, 14);
  if (input.chartSummary.engineNote) {
    write(`Calculation engine: ${input.chartSummary.engineNote}`, 9, false, MUTED, 8);
  }
  if (input.chartSummary.mock) {
    write(
      "Chart engine note: interpretive demo placements are used when a live ephemeris is not configured. This is not a scientific or predictive guarantee.",
      9,
      false,
      MUTED,
      12,
    );
  }

  // ── Chart snapshot ─────────────────────────────────────
  write("Chart snapshot", 14, true, GOLD, 8);
  write(`Ascendant (Lagna): ${input.chartSummary.ascendant || "—"}`);
  write(`Moon sign: ${input.chartSummary.moonSign || "—"}`);
  write(`Sun sign: ${input.chartSummary.sunSign || "—"}`, 11, false, INK, 10);
  if (input.chartSummary.planets) {
    write("Planetary placement table", 12, true, INK, 6);
    for (const [name, p] of Object.entries(input.chartSummary.planets)) {
      const detail = p.formatted
        ? `${name}: ${p.formatted}, house ${p.house}${p.nakshatra ? `, ${p.nakshatra}` : ""}`
        : `${name}: ${p.sign}, house ${p.house} - ${p.note}`;
      write(detail, 10, false, MUTED, 2);
    }
    ctx.y -= 8;
  }

  // ── Core sections ──────────────────────────────────────
  write("Overview", 14, true, GOLD, 8);
  write(input.overview, 11, false, INK, 12);
  write("Personality themes", 14, true, GOLD, 8);
  write(input.personality, 11, false, INK, 12);
  write("Guidance for reflection", 14, true, GOLD, 8);
  write(input.guidance, 11, false, INK, 14);

  // ── Product chapters ───────────────────────────────────
  if (input.chapters.length) {
    write("Report chapters", 14, true, GOLD, 8);
    input.chapters.forEach((ch, i) => {
      write(`${String(i + 1).padStart(2, "0")}. ${ch.title}`, 12, true, INK, 4);
      write(ch.body, 11, false, MUTED, 10);
    });
  }

  // ── What you get / who for / outcomes ──────────────────
  if (input.included.length) {
    write("What this report includes", 14, true, GOLD, 8);
    for (const item of input.included) write(`• ${item}`, 10, false, INK, 2);
    ctx.y -= 8;
  }
  if (input.whoFor.length) {
    write("Who this report is for", 14, true, GOLD, 8);
    for (const item of input.whoFor) write(`• ${item}`, 10, false, INK, 2);
    ctx.y -= 8;
  }
  if (input.outcomes.length) {
    write("Reflective outcomes (not guarantees)", 14, true, GOLD, 8);
    for (const item of input.outcomes) write(`• ${item}`, 10, false, INK, 2);
    ctx.y -= 8;
  }

  // ── Disclaimer ─────────────────────────────────────────
  hrule();
  write("Disclaimer", 12, true, INK, 6);
  write(input.disclaimer, 9, false, MUTED, 6);
  write(
    "Astrology, numerology, and face-reading content from JyotishKundali is interpretive entertainment for personal reflection. It is not medical, legal, financial, or relationship advice and does not predict or guarantee future events.",
    9,
    false,
    MUTED,
    10,
  );
  write(`Generated ${new Date().toISOString().slice(0, 10)} · jyotishkundali.com`, 8, false, MUTED, 0);

  return doc.save();
}

/** pdf-lib WinAnsi cannot encode many Unicode chars — strip/replace safely. */
function sanitize(text: string) {
  return text
    .replace(/[–—]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/•/g, "-")
    .replace(/₹/g, "INR ")
    .replace(/[^\x20-\x7E\n]/g, "?");
}

function wrapText(text: string, maxChars: number) {
  const words = sanitize(text).split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars) {
      if (current) lines.push(current);
      if (word.length > maxChars) {
        for (let i = 0; i < word.length; i += maxChars) lines.push(word.slice(i, i + maxChars));
        current = "";
      } else {
        current = word;
      }
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

export function parseProductWhatsIncluded(raw: unknown): {
  included: string[];
  chapters: string[];
  whoFor: string[];
  outcomes: string[];
} {
  if (Array.isArray(raw)) {
    return { included: raw as string[], chapters: [], whoFor: [], outcomes: [] };
  }
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    return {
      included: Array.isArray(o.included) ? (o.included as string[]) : [],
      chapters: Array.isArray(o.chapters) ? (o.chapters as string[]) : [],
      whoFor: Array.isArray(o.whoFor) ? (o.whoFor as string[]) : [],
      outcomes: Array.isArray(o.outcomes) ? (o.outcomes as string[]) : [],
    };
  }
  return { included: [], chapters: [], whoFor: [], outcomes: [] };
}

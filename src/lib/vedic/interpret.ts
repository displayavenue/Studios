import type { VedicChart } from "./chart";
import { ashtakoota } from "./ashtakoota";
import { buildLifeStory } from "./storytelling";

export type Interpretation = {
  sections: Record<string, string>;
  chapters: Array<{ title: string; body: string }>;
};

function planetLine(chart: VedicChart, name: string) {
  const p = chart.planets.find((x) => x.name === name);
  if (!p) return `${name}: n/a`;
  return `${name} at ${p.formatted} in house ${p.house}, nakshatra ${p.nakshatra} (pada ${p.pada}, lord ${p.nakshatraLord})`;
}

/**
 * Build template-aware chapters from REAL calculated placements,
 * always including a past / present / future life-story arc.
 */
export function interpretVedicChart(
  chart: VedicChart,
  templateKey: string,
  chapterTitles: string[] = [],
  partnerMoonLon?: number,
): Interpretation {
  const lifeStory = buildLifeStory(chart, templateKey);

  const overview =
    `This report tells ${chart.birth.name}'s chart as a story — past seasons, the present chapter, and future horizons — ` +
    `using Lahiri sidereal placements and Vimshottari dasha timing. ` +
    `Lagna ${chart.lagna.formatted}; Moon ${chart.moon.formatted} in ${chart.moon.nakshatra} pada ${chart.moon.pada}; ` +
    `Sun ${chart.sun.formatted}. Current Mahadasha: ${chart.dasha.current?.lord || "n/a"} ` +
    `(${chart.dasha.current?.start} → ${chart.dasha.current?.end}). ` +
    `Focus: ${templateKey.replace(/-/g, " ")}. Narrative is reflective entertainment, not a fixed destiny.`;

  const personality =
    `Rising ${chart.lagna.sign} (lord ${chart.lagna.signLord}) is how the world first meets you; ` +
    `Moon in ${chart.moon.sign} / ${chart.moon.nakshatra} is the private narrator of need and memory; ` +
    `Sun in ${chart.sun.sign} (house ${chart.sun.house}) is the plotline of purpose. ` +
    `Together they cast you as the protagonist of the chapters that follow.`;

  const guidance =
    `Live the story in three tenses: honour the past without replaying it, inhabit the present Mahadasha with craft and care, ` +
    `and prepare for future lords by practicing their virtues early. ` +
    `Dosha flags remain informational — Manglik ${chart.dosha.manglik.present ? "noted" : "not indicated"}, ` +
    `Kaal Sarp ${chart.dosha.kaalSarp.present ? "pattern noted" : "not indicated"}, ` +
    `Sade Sati ${chart.dosha.sadeSati.active ? chart.dosha.sadeSati.phase : "not active"}. ` +
    `You hold the pen.`;

  const defaultTitles =
    chapterTitles.length > 0
      ? chapterTitles
      : [
          "Chart overview & calculation basis",
          "Lagna & temperament",
          "Moon & nakshatra",
          "Planetary placements",
          "Vimshottari dasha climate",
          "Dosha flags (informational)",
          "Reflection prompts",
        ];

  const productChapters = defaultTitles.map((raw) => {
    const title = raw.replace(/^\d+\.\s*/, "");
    const t = title.toLowerCase();
    let body = "";

    if (t.includes("overview") || t.includes("calculation") || t.includes("how to read")) {
      body =
        `${overview}\n\nAyanamsa at birth: ${chart.ayanamsa.degrees.toFixed(4)} deg (${chart.ayanamsa.name}). ` +
        `UTC used for ephemeris: ${chart.birth.utcIso}. Place: ${chart.birth.placeName} (${chart.birth.lat}, ${chart.birth.lng}). ` +
        (chart.birth.timeUnknown
          ? "Birth time unknown — Lagna is approximate (noon)."
          : `Birth time ${chart.birth.localTime} local.`);
    } else if (
      t.includes("lagna") ||
      t.includes("rising") ||
      t.includes("temperament") ||
      t.includes("personality")
    ) {
      body = `${personality}\n\n${planetLine(chart, "Sun")}. ${planetLine(chart, "Moon")}.`;
    } else if (t.includes("moon") || t.includes("nakshatra") || t.includes("rashi")) {
      body =
        `Moon ${chart.moon.formatted}, nakshatra ${chart.moon.nakshatra} pada ${chart.moon.pada}, ` +
        `nakshatra lord ${chart.moon.nakshatraLord}, house ${chart.moon.house}. ` +
        `In the life story, this is the emotional refrain that returns in every tense — past memory, present mood, future longing.`;
    } else if (t.includes("planet") || t.includes("portrait") || t.includes("graha")) {
      body =
        `The supporting cast of your story:\n` +
        chart.planets.map((p) => planetLine(chart, p.name)).join(". ") +
        ".";
    } else if (
      t.includes("dasha") ||
      t.includes("timeline") ||
      t.includes("mahadasha") ||
      t.includes("timing")
    ) {
      body =
        `Vimshottari is the clock of this memoir.\n` +
        chart.dasha.mahadashas.map((d) => `${d.lord}: ${d.start} → ${d.end} (${d.years}y)`).join("; ") +
        `. Current: ${chart.dasha.current?.lord}. ` +
        (chart.dasha.antardashas.length
          ? `Present sub-plots (Antardasha): ${chart.dasha.antardashas
              .slice(0, 5)
              .map((a) => `${a.lord} ${a.start}→${a.end}`)
              .join("; ")}.`
          : "") +
        ` See the Past / Present / Future story chapters for the narrative reading of this clock.`;
    } else if (
      t.includes("dosha") ||
      t.includes("manglik") ||
      t.includes("sade") ||
      t.includes("rahu") ||
      t.includes("ketu") ||
      t.includes("saturn")
    ) {
      body =
        `${chart.dosha.manglik.note} ${chart.dosha.manglik.cancellations.join(" ")} ` +
        `${chart.dosha.kaalSarp.note} ${chart.dosha.sadeSati.note}`;
    } else if (
      t.includes("guna") ||
      t.includes("milan") ||
      t.includes("match") ||
      t.includes("koot") ||
      t.includes("compatibility") ||
      t.includes("couple") ||
      t.includes("love") ||
      t.includes("synastry")
    ) {
      if (partnerMoonLon != null) {
        const m = ashtakoota(chart.moon.longitude, partnerMoonLon);
        body =
          `Two stories meeting — Ashtakoota total ${m.total}/${m.max} (${m.percent}%). ` +
          `A: ${m.boyRashi}/${m.boyNakshatra}, B: ${m.girlRashi}/${m.girlNakshatra}. ` +
          m.koots.map((k) => `${k.name} ${k.obtained}/${k.max}`).join("; ") +
          `. Matching scores are traditional conversation tools, not marriage verdicts.`;
      } else {
        body =
          `Partnership chapters refine when a second birth chart is supplied. ` +
          `Your Moon ${chart.moon.formatted} / ${chart.moon.nakshatra} is the emotional signature Ashtakoota will compare.`;
      }
    } else if (t.includes("navamsa") || t.includes("d9") || t.includes("d-9") || t.includes("marriage chart")) {
      const n = chart.navamsa;
      body =
        `Navamsa (D9) is the finer marital / dharma subplot. Navamsa Lagna: ${n.navLagnaSign}. ` +
        n.placements
          .map(
            (p) =>
              `${p.name}: Rasi ${p.rasiSign} → Navamsa ${p.navamsaSign} (${p.navamsaFormatted}), ` +
              `nakshatra ${p.navamsaNakshatra}, house from Navamsa Lagna ${p.houseFromNavLagna}`,
          )
          .join("; ") +
        `. D9 readings are classical symbolic layers — not predictions of relationship outcome.`;
    } else if (t.includes("house") || t.includes("life map") || t.includes("bhava")) {
      body =
        `Twelve rooms of the life story: ` +
        Object.entries(chart.houses)
          .map(([h, sign]) => `House ${h} ${sign}`)
          .join("; ") +
        `. Occupants: ` +
        chart.planets.map((p) => `${p.name} in H${p.house}`).join(", ") +
        ".";
    } else if (t.includes("career") || t.includes("profession") || t.includes("10")) {
      const tenth = chart.houses["10"];
      const inTenth = chart.planets.filter((p) => p.house === 10).map((p) => p.name);
      body =
        `In the vocation subplot, the 10th house is ${tenth}. Planets in 10th: ${inTenth.join(", ") || "none"}. ` +
        `${planetLine(chart, "Saturn")}. ${planetLine(chart, "Sun")}. ` +
        `Career themes are symbolic chapters — not hiring or financial advice.`;
    } else if (t.includes("wealth") || t.includes("money") || t.includes("finance") || t.includes("property")) {
      body =
        `Resource subplot: 2nd house ${chart.houses["2"]}, 11th ${chart.houses["11"]}, 4th ${chart.houses["4"]}. ` +
        `${planetLine(chart, "Jupiter")}. ${planetLine(chart, "Venus")}. Not investment advice.`;
    } else if (t.includes("past") || t.includes("present") || t.includes("future") || t.includes("story")) {
      // Prefer dedicated life-story chapters; still answer if product listed these titles
      const hit = lifeStory.find((c) => c.title.toLowerCase().includes(t.slice(0, 8))) || lifeStory[0];
      body = hit.body;
    } else {
      body =
        `${title} for ${chart.birth.name}: Lagna ${chart.lagna.sign}, Moon ${chart.moon.sign}/${chart.moon.nakshatra}. ` +
        `Reflect on what resonates; leave what does not. ${guidance}`;
    }

    return { title, body };
  });

  // Life story first (past/present/future), then product-specific technical chapters
  const chapters = [...lifeStory, ...productChapters];

  return {
    sections: {
      overview,
      personality,
      guidance,
      past: lifeStory[1]?.body || "",
      present: lifeStory[2]?.body || "",
      future: lifeStory[3]?.body || "",
    },
    chapters,
  };
}

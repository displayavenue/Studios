import type { VedicChart } from "./chart";
import { ashtakoota } from "./ashtakoota";

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
 * Build template-aware chapters from REAL calculated placements.
 * Language stays interpretive / reflective — never claims predictive certainty.
 */
export function interpretVedicChart(
  chart: VedicChart,
  templateKey: string,
  chapterTitles: string[] = [],
  partnerMoonLon?: number,
): Interpretation {
  const lagna = `${chart.lagna.formatted}`;
  const overview =
    `Calculated with ${chart.engine.ayanamsa}, ${chart.engine.houseSystem}. ` +
    `Lagna ${lagna}; Moon ${chart.moon.formatted} in ${chart.moon.nakshatra} pada ${chart.moon.pada}; ` +
    `Sun ${chart.sun.formatted}. Current Mahadasha: ${chart.dasha.current?.lord || "n/a"} ` +
    `(${chart.dasha.current?.start} → ${chart.dasha.current?.end}). ` +
    `Template focus: ${templateKey.replace(/-/g, " ")}.`;

  const personality =
    `Rising sign ${chart.lagna.sign} (lord ${chart.lagna.signLord}) describes how life approaches you. ` +
    `Moon in ${chart.moon.sign} / ${chart.moon.nakshatra} colours emotional rhythm and comfort needs. ` +
    `Use these as reflective mirrors, not fixed labels.`;

  const guidance =
    `Dosha scan (informational): Manglik ${chart.dosha.manglik.present ? "flag present" : "not indicated from Lagna checklist"}; ` +
    `Kaal Sarp pattern ${chart.dosha.kaalSarp.present ? "indicated" : "not indicated"}; ` +
    `Sade Sati ${chart.dosha.sadeSati.active ? `active (${chart.dosha.sadeSati.phase})` : "not active"}. ` +
    `Decisions remain yours — this report does not guarantee outcomes.`;

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

  const chapters = defaultTitles.map((raw) => {
    const title = raw.replace(/^\d+\.\s*/, "");
    const t = title.toLowerCase();
    let body = "";

    if (t.includes("overview") || t.includes("calculation") || t.includes("how to read")) {
      body =
        `${overview}\n\nAyanamsa at birth: ${chart.ayanamsa.degrees.toFixed(4)}° (${chart.ayanamsa.name}). ` +
        `UTC used for ephemeris: ${chart.birth.utcIso}. Place: ${chart.birth.placeName} (${chart.birth.lat}, ${chart.birth.lng}). ` +
        (chart.birth.timeUnknown ? "Birth time unknown — Lagna is approximate (noon)." : `Birth time ${chart.birth.localTime} local.`);
    } else if (t.includes("lagna") || t.includes("rising") || t.includes("temperament") || t.includes("personality")) {
      body = `${personality}\n\n${planetLine(chart, "Sun")}. ${planetLine(chart, "Moon")}.`;
    } else if (t.includes("moon") || t.includes("nakshatra") || t.includes("rashi")) {
      body =
        `Moon ${chart.moon.formatted}, nakshatra ${chart.moon.nakshatra} pada ${chart.moon.pada}, ` +
        `nakshatra lord ${chart.moon.nakshatraLord}, house ${chart.moon.house}. ` +
        `Deity tradition and pada colour are for symbolic journaling.`;
    } else if (t.includes("planet") || t.includes("portrait") || t.includes("graha")) {
      body = chart.planets.map((p) => planetLine(chart, p.name)).join(". ") + ".";
    } else if (t.includes("dasha") || t.includes("timeline") || t.includes("mahadasha") || t.includes("timing")) {
      body =
        `Vimshottari Mahadasha sequence (from Moon nakshatra lord):\n` +
        chart.dasha.mahadashas
          .map((d) => `${d.lord}: ${d.start} → ${d.end} (${d.years}y)`)
          .join("; ") +
        `. Current: ${chart.dasha.current?.lord}. ` +
        (chart.dasha.antardashas.length
          ? `Antardashas in current Mahadasha: ${chart.dasha.antardashas
              .slice(0, 4)
              .map((a) => `${a.lord} ${a.start}→${a.end}`)
              .join("; ")}…`
          : "");
    } else if (t.includes("dosha") || t.includes("manglik") || t.includes("sade") || t.includes("rahu") || t.includes("ketu") || t.includes("saturn")) {
      body =
        `${chart.dosha.manglik.note} ${chart.dosha.manglik.cancellations.join(" ")} ` +
        `${chart.dosha.kaalSarp.note} ${chart.dosha.sadeSati.note}`;
    } else if (t.includes("guna") || t.includes("milan") || t.includes("match") || t.includes("koot") || t.includes("compatibility") || t.includes("couple") || t.includes("love") || t.includes("synastry")) {
      if (partnerMoonLon != null) {
        const m = ashtakoota(chart.moon.longitude, partnerMoonLon);
        body =
          `Ashtakoota total ${m.total}/${m.max} (${m.percent}%). ` +
          `A: ${m.boyRashi}/${m.boyNakshatra}, B: ${m.girlRashi}/${m.girlNakshatra}. ` +
          m.koots.map((k) => `${k.name} ${k.obtained}/${k.max}`).join("; ") +
          `. Scores are traditional decision-support tools, not marriage verdicts.`;
      } else {
        body =
          `This template supports matching when a second birth chart is supplied. ` +
          `Natal Moon ${chart.moon.formatted} / ${chart.moon.nakshatra} is the basis for Ashtakoota.`;
      }
    } else if (t.includes("house") || t.includes("life map") || t.includes("bhava")) {
      body =
        Object.entries(chart.houses)
          .map(([h, sign]) => `House ${h}: ${sign}`)
          .join("; ") +
        `. Occupants: ` +
        chart.planets.map((p) => `${p.name} in H${p.house}`).join(", ") +
        ".";
    } else if (t.includes("career") || t.includes("profession") || t.includes("10")) {
      const tenth = chart.houses["10"];
      const inTenth = chart.planets.filter((p) => p.house === 10).map((p) => p.name);
      body =
        `10th house sign ${tenth}. Planets in 10th: ${inTenth.join(", ") || "none"}. ` +
        `${planetLine(chart, "Saturn")}. ${planetLine(chart, "Sun")}. ` +
        `Career themes are symbolic — not hiring or financial advice.`;
    } else if (t.includes("wealth") || t.includes("money") || t.includes("finance") || t.includes("property")) {
      body =
        `2nd house ${chart.houses["2"]}, 11th house ${chart.houses["11"]}, 4th house ${chart.houses["4"]}. ` +
        `${planetLine(chart, "Jupiter")}. ${planetLine(chart, "Venus")}. Not investment advice.`;
    } else {
      body =
        `${title} for ${chart.birth.name}: Lagna ${chart.lagna.sign}, Moon ${chart.moon.sign}/${chart.moon.nakshatra}. ` +
        `Reflect on what resonates; leave what does not. ${guidance}`;
    }

    return { title, body };
  });

  return {
    sections: { overview, personality, guidance },
    chapters,
  };
}

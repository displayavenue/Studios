import type { VedicChart } from "./chart";
import type { DashaPeriod } from "./dasha";

/** Symbolic dasha motifs for narrative storytelling (reflective, not predictive). */
const LORD_MOTIF: Record<
  string,
  { title: string; colour: string; lessons: string; gifts: string; caution: string }
> = {
  Sun: {
    title: "The Solar Chapter",
    colour: "visibility, dignity, purpose, and the courage to be seen",
    lessons: "learning to stand in your own light without burning others",
    gifts: "leadership presence, clarity of aim, and honest self-respect",
    caution: "pride or overwork can eclipse soft needs — rest is part of radiance",
  },
  Moon: {
    title: "The Lunar Chapter",
    colour: "feeling, belonging, home, and the tides of care",
    lessons: "naming what soothes you and what drains you",
    gifts: "empathy, intuition, and the ability to nurture bonds",
    caution: "moods are weather, not verdicts — do not let every wave rewrite your story",
  },
  Mars: {
    title: "The Martial Chapter",
    colour: "drive, heat, courage, and decisive motion",
    lessons: "channeling fire into craft instead of conflict",
    gifts: "initiative, athletic will, and protective loyalty",
    caution: "haste and sharpness can cut the very ties you mean to defend",
  },
  Mercury: {
    title: "The Mercurial Chapter",
    colour: "words, wit, learning, trade, and nimble curiosity",
    lessons: "choosing which conversations deserve your cleverness",
    gifts: "adaptability, study, humour, and bridge-building speech",
    caution: "scattered attention can turn brilliance into noise",
  },
  Jupiter: {
    title: "The Jupiterian Chapter",
    colour: "growth, faith, teachers, and widening horizons",
    lessons: "expanding without promising what you cannot hold",
    gifts: "wisdom-seeking, generosity, and hopeful vision",
    caution: "over-optimism can skip the humble steps that make growth real",
  },
  Venus: {
    title: "The Venusian Chapter",
    colour: "beauty, affection, art, comfort, and shared pleasure",
    lessons: "loving without losing your centre",
    gifts: "charm, creativity, partnership sweetness, and aesthetic sense",
    caution: "comfort-seeking can delay necessary honesty",
  },
  Saturn: {
    title: "The Saturnian Chapter",
    colour: "time, duty, craft, endurance, and earned respect",
    lessons: "befriending patience and building what lasts",
    gifts: "discipline, realism, and mastery through repetition",
    caution: "heaviness is not failure — but isolation can deepen the weight",
  },
  Rahu: {
    title: "The Rahu Chapter",
    colour: "hunger, novelty, ambition, and unfamiliar doors",
    lessons: "wanting wisely in a world of endless appetite",
    gifts: "breakthroughs, foreign flavours, and unconventional success",
    caution: "obsession can outrun integrity — check the cost of the climb",
  },
  Ketu: {
    title: "The Ketu Chapter",
    colour: "release, insight, solitude, and the quiet behind desire",
    lessons: "letting go of costumes that no longer fit",
    gifts: "spiritual clarity, technical depth, and freedom from clutter",
    caution: "detachment can become distance — stay kind while you simplify",
  },
};

function motif(lord: string) {
  return (
    LORD_MOTIF[lord] || {
      title: `The ${lord} Chapter`,
      colour: "change and reflection",
      lessons: "noticing what this season asks of you",
      gifts: "fresh perspective",
      caution: "stay grounded in daily care",
    }
  );
}

function houseStory(house: number): string {
  const map: Record<number, string> = {
    1: "selfhood, vitality, and first impressions",
    2: "voice, values, family resources, and what you call enough",
    3: "courage, siblings, short journeys, and daily skill",
    4: "home, mothering themes, roots, and inner peace",
    5: "creativity, romance spark, children motifs, and joyful risk",
    6: "service, health-of-habits, rivals, and steady improvement",
    7: "partnership, contracts, and the mirror of the other",
    8: "shared depths, transformation, and hidden strength",
    9: "belief, mentors, long journeys, and meaning",
    10: "vocation, reputation, and the work the world sees",
    11: "friends, networks, gains, and future-facing hopes",
    12: "rest, release, solitude, and the unseen sanctuary",
  };
  return map[house] || "life themes";
}

function periodBlurb(p: DashaPeriod, tense: "past" | "present" | "future") {
  const m = motif(p.lord);
  const when =
    tense === "past"
      ? `From ${p.start} to ${p.end}, ${m.title} shaped the weather of your years`
      : tense === "present"
        ? `Right now (${p.start} to ${p.end}), you are walking ${m.title}`
        : `Looking ahead (${p.start} to ${p.end}), ${m.title} begins to colour the horizon`;
  return (
    `${when}. Its symbolic colour is ${m.colour}. ` +
    `The gift of this lord is ${m.gifts}. The lesson is ${m.lessons}. ` +
    `A gentle caution: ${m.caution}.`
  );
}

function antardashaStory(chart: VedicChart): string {
  const current = chart.dasha.current;
  if (!current || !chart.dasha.antardashas.length) {
    return "Antardasha detail will refine as your Mahadasha timeline continues.";
  }
  const now = new Date().toISOString().slice(0, 10);
  const active =
    chart.dasha.antardashas.find((a) => a.start <= now && now <= a.end) ||
    chart.dasha.antardashas[0];
  const upcoming = chart.dasha.antardashas.filter((a) => a.start > active.start).slice(0, 2);
  const m = motif(active.lord);
  let text =
    `Inside the larger ${current.lord} Mahadasha, the Antardasha of ${active.lord} ` +
    `(${active.start} to ${active.end}) is the subplot you are living day to day — ${m.colour}. `;
  if (upcoming.length) {
    text +=
      `Soon the story may shift toward ${upcoming
        .map((u) => `${u.lord} (${u.start})`)
        .join(" and ")}. Think of these as scene changes, not fate locks.`;
  }
  return text;
}

/**
 * Long-form life story: prologue, past, present, future, epilogue.
 * Built from real Lagna/Moon/Sun + Vimshottari dasha timeline.
 */
export function buildLifeStory(chart: VedicChart, templateKey = "life-story"): Array<{ title: string; body: string }> {
  const name = chart.birth.name || "You";
  const now = new Date().toISOString().slice(0, 10);
  const mahas = chart.dasha.mahadashas;
  const past = mahas.filter((p) => p.end < now);
  const present = mahas.find((p) => p.start <= now && now <= p.end) || chart.dasha.current;
  const future = mahas.filter((p) => p.start > now).slice(0, 2);

  const moonHouseTheme = houseStory(chart.moon.house);
  const sunHouseTheme = houseStory(chart.sun.house);
  const lagnaLord = chart.planets.find((p) => p.name === chart.lagna.signLord);

  const prologue = {
    title: "Prologue — The character you brought into the world",
    body:
      `This is the opening page of ${name}'s chart story — not a rigid script, but a symbolic memoir written in planets and time.\n\n` +
      `You rise with ${chart.lagna.sign} Lagna (${chart.lagna.formatted}), a first impression coloured by ${chart.lagna.signLord}. ` +
      (lagnaLord
        ? `Your Lagna lord ${lagnaLord.name} sits in house ${lagnaLord.house} (${lagnaLord.formatted}, ${lagnaLord.nakshatra}), ` +
          `suggesting that your life force often expresses through ${houseStory(lagnaLord.house)}.`
        : `Your rising lord shapes how you meet thresholds.`) +
      `\n\n` +
      `The Moon — the mind's narrator — rests in ${chart.moon.sign} at ${chart.moon.formatted}, ` +
      `nakshatra ${chart.moon.nakshatra} pada ${chart.moon.pada} (lord ${chart.moon.nakshatraLord}), house ${chart.moon.house}. ` +
      `Emotionally, the story often returns to ${moonHouseTheme}. ` +
      `The Sun — the purposeful self — shines from ${chart.sun.sign} in house ${chart.sun.house}, touching ${sunHouseTheme}.\n\n` +
      `Read what follows as chapters of weather: past seasons you have already walked, the climate of the present, ` +
      `and the horizon that Vimshottari dasha symbolism sketches ahead. Keep your free will. Keep your kindness. ` +
      `This narrative is for reflection and entertainment, framed by template focus: ${templateKey.replace(/-/g, " ")}.`,
  };

  const pastBody =
    past.length === 0
      ? `Your recorded Mahadasha list begins near the present — early-life chapters may sit inside the opening balance of your first dasha. ` +
        `What feels "past" to you personally still matters more than any table: childhood rooms, first responsibilities, first loves of craft.`
      : past
          .slice(-3)
          .map((p, i) => {
            const label = i === past.slice(-3).length - 1 ? "Most recently" : "Earlier";
            return `${label}, ${periodBlurb(p, "past")}`;
          })
          .join("\n\n") +
        `\n\nLooking back with chart language: these lords did not "cause" every event. ` +
        `They offer a poetic lens for the skills you forged, the people who shaped you, and the patterns you outgrew. ` +
        `Ask yourself: which of those seasons still lives in your habits — and which are you ready to thank and release?`;

  const pastChapter = {
    title: "The path behind you — Past chapters",
    body:
      `Every life arrives with chapters already inked before we learn to read them.\n\n` +
      pastBody +
      `\n\n` +
      `Your Moon nakshatra ${chart.moon.nakshatra} is the birth-star refrain that threads those years together — ` +
      `a recurring melody of ${motif(chart.moon.nakshatraLord).colour}. When you remember the past, notice where that melody helped you survive, and where a new song is due.`,
  };

  const presentMotif = present ? motif(present.lord) : motif("Moon");
  const presentChapter = {
    title: "The chapter you are living — Present story",
    body:
      (present
        ? `${periodBlurb(present, "present")}\n\n`
        : `Your present Mahadasha is unfolding around themes of ${presentMotif.colour}.\n\n`) +
      `${antardashaStory(chart)}\n\n` +
      `In the language of houses, your Moon's attention on ${moonHouseTheme} means the present often feels personal there first — ` +
      `before it shows up as outer success or delay. Sun in house ${chart.sun.house} keeps tapping ${sunHouseTheme} as a compass for dignity.\n\n` +
      `Dosha weather (informational only): Manglik ${chart.dosha.manglik.present ? "flag noted from Lagna checklist" : "not indicated from Lagna checklist"}; ` +
      `Kaal Sarp pattern ${chart.dosha.kaalSarp.present ? "discussed in classical pattern checks" : "not indicated"}; ` +
      `Sade Sati ${chart.dosha.sadeSati.active ? `in ${chart.dosha.sadeSati.phase} phase symbolism` : "not active by the common Moon-sign definition"}. ` +
      `Treat flags as conversation starters, never as a life sentence.\n\n` +
      `Present-tense practice: each morning, name one duty (Saturn), one kindness (Venus/Moon), and one brave step (Mars/Sun). ` +
      `That simple ritual keeps the story human while the dasha climate shifts.`,
  };

  const futureBody =
    future.length === 0
      ? `Beyond the listed Mahadasha window, life continues — charts do not exhaust a person. ` +
        `Keep planting skills that will still matter when the next lord arrives.`
      : future
          .map((p, i) => {
            const header = i === 0 ? "Next on the horizon" : "Further ahead";
            return `${header}: ${periodBlurb(p, "future")}`;
          })
          .join("\n\n") +
        `\n\n` +
        `Future chapters in Jyotish are invitations to prepare, not appointments with doom or destiny. ` +
        `If a coming lord emphasises work, start strengthening craft now. If it emphasises bonds, practice honest speech now. ` +
        `You do not wait for a dasha to become the person you respect — you rehearse that person in ordinary Tuesdays.`;

  const futureChapter = {
    title: "The road ahead — Future horizons",
    body:
      `The sky keeps turning, and so does your timeline.\n\n` +
      futureBody +
      `\n\n` +
      `A hopeful frame: your Lagna in ${chart.lagna.sign} means you meet the future as someone who ${
        chart.lagna.sign === "Aries" || chart.lagna.sign === "Leo" || chart.lagna.sign === "Sagittarius"
          ? "initiates and inspires"
          : chart.lagna.sign === "Taurus" || chart.lagna.sign === "Virgo" || chart.lagna.sign === "Capricorn"
            ? "builds and steadies"
            : chart.lagna.sign === "Gemini" || chart.lagna.sign === "Libra" || chart.lagna.sign === "Aquarius"
              ? "connects and invents"
              : "feels deeply and protects what matters"
      }. Carry that strength forward.`,
  };

  const epilogue = {
    title: "Epilogue — How to live the story well",
    body:
      `${name}, a chart can describe climate; only you choose the voyage.\n\n` +
      `Return to three anchors whenever the tale feels too loud:\n` +
      `1) Body — sleep, food, movement (the 1st and 6th house basics).\n` +
      `2) Bond — one honest conversation a week (the 7th and Moon).\n` +
      `3) Meaning — one page of learning or prayer (the 9th and Jupiter).\n\n` +
      `Past chapters made you capable. The present chapter is asking for presence. Future horizons reward preparation. ` +
      `May this storytelling report be a lantern, not a cage — calculated with ${chart.engine.ayanamsa} and whole-sign houses, ` +
      `written for reflection and entertainment, never as medical, legal, financial, or relationship certainty.`,
  };

  return [prologue, pastChapter, presentChapter, futureChapter, epilogue];
}

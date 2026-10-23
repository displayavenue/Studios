import { img } from "../images";

/** Instagram Reel package: “Send > Like” — sourced from Oct 2026 trending Reel patterns */
export const sendableTrendReel = {
  slug: "sendable-content-trend",
  title: "The new Instagram rule: Send > Like",
  trendName: "Sendable Content",
  durationSec: 28,
  aspectRatio: "9:16" as const,
  account: "@displayavenuestudios",
  musicNote: "Use a calm cinematic beat or trending spoken-word audio under 90 BPM",
  sourcesNote:
    "Built from Oct 2026 Reel patterns: DM shares over likes, context-first storytelling, and send-trigger hooks.",

  /** On-screen beats timed for a ~28s Reel */
  beats: [
    {
      id: "hook",
      startSec: 0,
      endSec: 3,
      onScreen: "Stop chasing likes.",
      voiceover: "Stop chasing likes.",
      visual: "Tight phone-screen mock with a like counter freezing, then glitching.",
      image: img.socialReels,
      tip: "Text must land in frame 1 — most viewers start muted.",
    },
    {
      id: "twist",
      startSec: 3,
      endSec: 7,
      onScreen: "Instagram now ranks what people SEND.",
      voiceover:
        "In 2026, Instagram ranks what people send in DMs higher than likes for reach.",
      visual: "Cut to DM share sheet / “Send to” UI overlay on cinematic BTS footage.",
      image: img.editing,
      tip: "Name the trend early so the Reel feels like insider intel, not a lecture.",
    },
    {
      id: "why",
      startSec: 7,
      endSec: 12,
      onScreen: "A DM is a real endorsement.",
      voiceover:
        "A like is cheap. A DM means someone thought of a specific person — and that is the signal Meta is rewarding.",
      visual: "Split: heart icon vs paper-plane icon, paper-plane grows.",
      image: img.cameraGear,
      tip: "Keep one idea per beat. No stats dump on screen.",
    },
    {
      id: "pattern",
      startSec: 12,
      endSec: 18,
      onScreen: "Trend: context first. Product second.",
      voiceover:
        "Trending Reels open with a real situation — then reveal the product, process, or payoff. Hard sells die in the first second.",
      visual:
        "Quick montage: wedding prep tension → cinematic reveal; product flat lay → lifestyle reel.",
      image: img.indianWeddingFilm,
      tip: "Borrowed from Oct 2026 breakout formats: problem → stakes → reveal.",
    },
    {
      id: "formats",
      startSec: 18,
      endSec: 24,
      onScreen: "3 sendable formats for brands",
      voiceover:
        "One — before and after that makes someone text their photographer. Two — process POV that feels shareable. Three — a soft send prompt: show this to whoever runs your Instagram.",
      visual:
        "Three numbered cards flash: 01 Before/After · 02 Process POV · 03 Soft send CTA.",
      image: img.brandFilm,
      tip: "Numbered lists travel well as DMs — easy for the receiver to skim.",
    },
    {
      id: "cta",
      startSec: 24,
      endSec: 28,
      onScreen: "We film for shares, not vanity metrics.",
      voiceover:
        "DisplayAvenue Studios — we design Reels brands and couples actually send. Book your content day.",
      visual: "Brand end card with logo treatment + WhatsApp / Book Now.",
      image: img.mumbaiSkyline,
      tip: "End on brand name at hero size — not buried in a caption.",
    },
  ],

  caption: `The new Instagram rule brands are missing:

Likes don’t grow you anymore.
DM shares do.

In 2026, the Reels that travel are the ones someone sends to a specific person —
their photographer, their marketing lead, their wedding planner.

What’s winning right now:
→ Context first, product second
→ Before/after that creates a “send this” reflex
→ Process POV people want a friend to feel
→ Soft prompts (“show this to whoever runs your IG”) — not “tag a friend” bait

At DisplayAvenue Studios we don’t chase vanity metrics.
We film for shares, saves, and bookings.

Send this to whoever handles your brand Instagram.
Or book a content day → link in bio / WhatsApp.

#DisplayAvenueStudios #InstagramReels #SocialMediaTrends #ReelStrategy #ContentMarketingIndia #MumbaiCreatives #BrandFilms #WeddingReels #ShortFormVideo #SendNotLike`,

  hashtags: [
    "#DisplayAvenueStudios",
    "#InstagramReels",
    "#SocialMediaTrends",
    "#ReelStrategy",
    "#ContentMarketingIndia",
    "#MumbaiCreatives",
    "#BrandFilms",
    "#WeddingReels",
    "#ShortFormVideo",
    "#SendNotLike",
  ],

  shotList: [
    "Phone + laptop BTS of social dashboard (hook)",
    "Cinematic vertical BTS of a brand or wedding shoot",
    "Before/after still pair (flat vs graded)",
    "Hands editing on timeline / colour grade POV",
    "End card: DisplayAvenue Studios wordmark on Mumbai dusk plate",
  ],

  postingTips: [
    "Post as a Reel (not a feed video) with cover frame = beat 1 text.",
    "Keep under 30s for this educational format; longer tutorials can follow as a series.",
    "Pin a comment: “Want the 3 sendable formats for your niche? Reply SEND.”",
    "Avoid hard engagement bait (“tag 3 friends”) — Meta suppresses it.",
    "First comment CTA: WhatsApp +91 7400303493 for content-day bookings.",
  ],
};

export type ReelBeat = (typeof sendableTrendReel.beats)[number];

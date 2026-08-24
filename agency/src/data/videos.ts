export type VideoCaption = {
  t: number;
  text: string;
};

export type VideoReel = {
  slug: string;
  type: "hook" | "tip" | "proof" | string;
  category: string;
  title: string;
  lines: string[];
  captions: VideoCaption[];
  script: string;
  durationSec: number;
  cta: string;
  ctaHref: string;
  speakerImage?: string;
  speakerName?: string;
  publishedAt: string;
  trending?: boolean;
  source?: string;
  format?: string;
};

export type VideosCms = {
  title: string;
  lead: string;
  autoPublish: boolean;
  reelsPerDay: number;
  speakerName: string;
  speakerImage: string;
  speakerImageAlt?: string;
  updatedAt?: string;
  lastAutopilotDate?: string;
  reels: VideoReel[];
};

export const fallbackVideos: VideosCms = {
  title: "DisplayAvenue Videos",
  lead: "Daily talking-head reels for Indian business owners — upload your portrait so every reel looks like you speaking.",
  autoPublish: true,
  reelsPerDay: 3,
  speakerName: "DisplayAvenue",
  speakerImage: "",
  speakerImageAlt: "DisplayAvenue speaker",
  reels: [],
};

export function sortVideoReels(reels: VideoReel[]): VideoReel[] {
  const order: Record<string, number> = { hook: 0, tip: 1, proof: 2 };
  return [...reels].sort((a, b) => {
    if (a.publishedAt !== b.publishedAt) {
      return a.publishedAt < b.publishedAt ? 1 : -1;
    }
    return (order[a.type] ?? 9) - (order[b.type] ?? 9);
  });
}

export function typeLabel(type: string): string {
  if (type === "hook") return "Hook";
  if (type === "tip") return "Tip";
  if (type === "proof") return "Proof";
  return type;
}

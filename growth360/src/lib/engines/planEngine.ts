import { prisma } from "../db";
import type { AssessmentProfile } from "./scoreEngine";

export type Plan90Day = {
  phase1: { title: string; days: string; tasks: string[] };
  phase2: { title: string; days: string; tasks: string[] };
  phase3: { title: string; days: string; tasks: string[] };
};

export async function build90DayPlan(
  profile: AssessmentProfile,
  channels: string[],
): Promise<Plan90Day> {
  const template = await prisma.planTemplate.findFirst({
    where: { isActive: true, key: "default" },
  });

  const channelTasks = channels.map((c) => `Implement and measure ${label(c)}`);

  const phase1Tasks = asStringArray(template?.phase1Tasks) || [
    "Audit current website, tracking, and enquiry flow",
    "Finalize ICP and offer messaging",
    "Launch conversion-focused landing page",
    ...channelTasks.slice(0, 2),
  ];

  const phase2Tasks = asStringArray(template?.phase2Tasks) || [
    "Scale best-performing paid channels",
    "Activate CRM follow-up sequences",
    "Publish SEO foundation pages for core services",
    ...channelTasks.slice(2, 4),
  ];

  const phase3Tasks = asStringArray(template?.phase3Tasks) || [
    "Optimize CPL and conversion rate against ROI targets",
    "Expand winning creatives and keywords",
    "Run outbound / cold-call cadence for qualified accounts",
    "Review 90-day results and plan next quarter",
  ];

  // AI and templates must not invent services outside recommended channels
  const allowed = new Set(channels.map(label));
  const filterTasks = (tasks: string[]) =>
    tasks.filter((t) => {
      const mentionsChannel = ["Google Ads", "Meta Ads", "SEO", "Landing Page", "CRM", "Cold Calling"].some(
        (name) => t.includes(name),
      );
      if (!mentionsChannel) return true;
      return [...allowed].some((a) => t.includes(a));
    });

  return {
    phase1: {
      title: "Foundation",
      days: "Days 1–30",
      tasks: filterTasks(phase1Tasks).slice(0, 6),
    },
    phase2: {
      title: "Acceleration",
      days: "Days 31–60",
      tasks: filterTasks(phase2Tasks).slice(0, 6),
    },
    phase3: {
      title: "Optimization",
      days: "Days 61–90",
      tasks: filterTasks(phase3Tasks).slice(0, 6),
    },
  };
}

function asStringArray(value: unknown): string[] | null {
  if (Array.isArray(value) && value.every((v) => typeof v === "string")) return value;
  return null;
}

function label(slug: string) {
  const map: Record<string, string> = {
    "google-ads": "Google Ads",
    "meta-ads": "Meta Ads",
    seo: "SEO",
    "landing-page": "Landing Page",
    crm: "CRM",
    "cold-calling": "Cold Calling",
  };
  return map[slug] || slug;
}

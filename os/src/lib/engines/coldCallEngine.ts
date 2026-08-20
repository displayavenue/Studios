import type { AssessmentProfile } from "./scoreEngine";
import type { MatchedCompetitor } from "./competitorEngine";

export type ColdCallScript = {
  opening: string;
  discoveryQuestions: string[];
  qualificationQuestions: string[];
  objectionHandling: { objection: string; response: string }[];
  meetingBooking: string;
};

export function buildColdCallFallback(
  profile: AssessmentProfile,
  competitors: MatchedCompetitor[],
): ColdCallScript {
  const company = profile.company || "your company";
  const industry = profile.industry || "your industry";
  const product = profile.product || "your offer";
  const dm = "decision maker";
  const competitorHint = competitors[0]?.name
    ? `We've been reviewing how businesses like ${competitors[0].name} show up digitally in ${profile.location || "your market"}.`
    : `We've been reviewing how businesses in ${industry} show up digitally in ${profile.location || "your market"}.`;

  return {
    opening: `Hi, this is from DisplayAvenue. Am I speaking with the ${dm} at ${company}? ${competitorHint} I put together a short Growth360 snapshot for ${company} around ${product} — do you have 30 seconds?`,
    discoveryQuestions: [
      `How are you currently generating enquiries for ${product}?`,
      "Which channel brings the most qualified conversations today?",
      "If you could improve one growth metric in the next 90 days, what would it be?",
    ],
    qualificationQuestions: [
      "Who else is involved in marketing or sales decisions?",
      "Is there an active budget set aside for growth this quarter?",
      "Would a 30-minute strategy review this week be useful?",
    ],
    objectionHandling: [
      {
        objection: "Just email me",
        response:
          "Happy to. I'll send a one-page summary — and keep a short slot open so we can walk through the competitive gaps quickly.",
      },
      {
        objection: "We're already doing marketing",
        response:
          "Perfect — this is usually most useful for teams who are active. The snapshot compares your position with peers and highlights where spend can work harder.",
      },
      {
        objection: "Too busy",
        response:
          "Understood. The call is 30 minutes and focused on your numbers — if it's not useful, you can end it early.",
      },
    ],
    meetingBooking:
      "I can hold a 30-minute Growth Strategy Call this week. Would Tuesday or Thursday afternoon work better?",
  };
}

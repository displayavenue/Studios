import { QueuePageShell, queueMetadata } from "@/components/queue-page";

export const metadata = queueMetadata("Review moderation");

export default function ReviewModerationQueuePage() {
  return <QueuePageShell queueId="review-moderation" title="Review moderation queue" />;
}

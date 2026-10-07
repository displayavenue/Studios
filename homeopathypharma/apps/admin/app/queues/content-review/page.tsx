import { QueuePageShell, queueMetadata } from "@/components/queue-page";

export const metadata = queueMetadata("Content medical review");

export default function ContentReviewQueuePage() {
  return <QueuePageShell queueId="content-review" title="Content medical review queue" />;
}

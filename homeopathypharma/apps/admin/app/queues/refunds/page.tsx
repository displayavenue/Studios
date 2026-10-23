import { QueuePageShell, queueMetadata } from "@/components/queue-page";

export const metadata = queueMetadata("Refunds");

export default function RefundsQueuePage() {
  return <QueuePageShell queueId="refunds" title="Refunds queue" />;
}

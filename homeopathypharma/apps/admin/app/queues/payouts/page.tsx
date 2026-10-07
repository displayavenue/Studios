import { QueuePageShell, queueMetadata } from "@/components/queue-page";

export const metadata = queueMetadata("Payouts");

export default function PayoutsQueuePage() {
  return <QueuePageShell queueId="payouts" title="Payouts queue" />;
}

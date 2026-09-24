import { QueuePageShell, queueMetadata } from "@/components/queue-page";

export const metadata = queueMetadata("Product publish");

export default function ProductPublishQueuePage() {
  return <QueuePageShell queueId="product-publish" title="Product publish queue" />;
}

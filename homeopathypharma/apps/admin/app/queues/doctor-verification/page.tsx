import { QueuePageShell, queueMetadata } from "@/components/queue-page";

export const metadata = queueMetadata("Doctor verification");

export default function DoctorVerificationQueuePage() {
  return <QueuePageShell queueId="doctor-verification" title="Doctor verification queue" />;
}

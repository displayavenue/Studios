/**
 * Idempotency helper stub.
 * Production: store jobId + payload hash in Redis with TTL before processing.
 */
const processedKeys = new Set<string>();

export async function ensureIdempotent(
  key: string,
  handler: () => Promise<void>,
): Promise<{ skipped: boolean }> {
  if (processedKeys.has(key)) {
    return { skipped: true };
  }
  await handler();
  processedKeys.add(key);
  return { skipped: false };
}

export function buildIdempotencyKey(
  queue: string,
  jobName: string,
  jobId: string,
): string {
  return `${queue}:${jobName}:${jobId}`;
}

import Redis from 'ioredis';

export const QUEUE_NAMES = {
  PAYMENTS: 'payments',
  ORDERS: 'orders',
  INVENTORY: 'inventory',
  SHIPMENTS: 'shipments',
  CONSULTATIONS: 'consultations',
  NOTIFICATIONS: 'notifications',
  SEARCH_INDEX: 'search-index',
  SITEMAPS: 'sitemaps',
  FEEDS: 'feeds',
  AUDITS: 'audits',
  REFERRALS: 'referrals',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export function createRedisConnection(): Redis {
  const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
  return new Redis(url, { maxRetriesPerRequest: null });
}

export const defaultJobOptions = {
  attempts: 3,
  backoff: { type: 'exponential' as const, delay: 1000 },
  removeOnComplete: 100,
  removeOnFail: false,
};

/**
 * Dead-letter: failed jobs after max attempts remain in the failed set.
 * Configure a separate DLQ consumer or BullMQ flow for manual replay.
 */
export const deadLetterNote =
  'Jobs exceeding retry limit are retained in failed state for DLQ inspection/replay.';

import { Job, Worker } from 'bullmq';
import {
  createRedisConnection,
  deadLetterNote,
  QUEUE_NAMES,
} from '../queues/config.js';
import {
  buildIdempotencyKey,
  ensureIdempotent,
} from './idempotency.js';

export interface ProcessorResult {
  status: 'processed' | 'skipped';
  message: string;
}

async function stubProcess(
  job: Job,
  domain: string,
): Promise<ProcessorResult> {
  const idempotencyKey = buildIdempotencyKey(
    job.queueName,
    job.name,
    String(job.id),
  );

  const result = await ensureIdempotent(idempotencyKey, async () => {
    // TODO: implement ${domain} job handler
    console.log(
      JSON.stringify({
        level: 'info',
        service: '@homeopathypharma/worker',
        queue: job.queueName,
        job: job.name,
        jobId: job.id,
        domain,
        note: deadLetterNote,
        message: 'Stub processor — no-op',
      }),
    );
  });

  return {
    status: result.skipped ? 'skipped' : 'processed',
    message: `${domain} job ${result.skipped ? 'already processed (idempotent skip)' : 'stub processed'}`,
  };
}

export function createPaymentsWorker(): Worker {
  return new Worker(
    QUEUE_NAMES.PAYMENTS,
    async (job) => stubProcess(job, 'payments'),
    { connection: createRedisConnection(), concurrency: 5 },
  );
}

export function createOrdersWorker(): Worker {
  return new Worker(
    QUEUE_NAMES.ORDERS,
    async (job) => stubProcess(job, 'orders'),
    { connection: createRedisConnection(), concurrency: 5 },
  );
}

export function createInventoryWorker(): Worker {
  return new Worker(
    QUEUE_NAMES.INVENTORY,
    async (job) => stubProcess(job, 'inventory'),
    { connection: createRedisConnection(), concurrency: 3 },
  );
}

export function createShipmentsWorker(): Worker {
  return new Worker(
    QUEUE_NAMES.SHIPMENTS,
    async (job) => stubProcess(job, 'shipments'),
    { connection: createRedisConnection(), concurrency: 3 },
  );
}

export function createConsultationsWorker(): Worker {
  return new Worker(
    QUEUE_NAMES.CONSULTATIONS,
    async (job) => stubProcess(job, 'consultations'),
    { connection: createRedisConnection(), concurrency: 3 },
  );
}

export function createNotificationsWorker(): Worker {
  return new Worker(
    QUEUE_NAMES.NOTIFICATIONS,
    async (job) => stubProcess(job, 'notifications'),
    { connection: createRedisConnection(), concurrency: 10 },
  );
}

export function createSearchIndexWorker(): Worker {
  return new Worker(
    QUEUE_NAMES.SEARCH_INDEX,
    async (job) => stubProcess(job, 'search-index'),
    { connection: createRedisConnection(), concurrency: 2 },
  );
}

export function createSitemapsWorker(): Worker {
  return new Worker(
    QUEUE_NAMES.SITEMAPS,
    async (job) => stubProcess(job, 'sitemaps'),
    { connection: createRedisConnection(), concurrency: 1 },
  );
}

export function createFeedsWorker(): Worker {
  return new Worker(
    QUEUE_NAMES.FEEDS,
    async (job) => stubProcess(job, 'feeds'),
    { connection: createRedisConnection(), concurrency: 2 },
  );
}

export function createAuditsWorker(): Worker {
  return new Worker(
    QUEUE_NAMES.AUDITS,
    async (job) => stubProcess(job, 'audits'),
    { connection: createRedisConnection(), concurrency: 2 },
  );
}

export function createReferralsWorker(): Worker {
  return new Worker(
    QUEUE_NAMES.REFERRALS,
    async (job) => stubProcess(job, 'referrals'),
    { connection: createRedisConnection(), concurrency: 3 },
  );
}

export function createAllWorkers(): Worker[] {
  return [
    createPaymentsWorker(),
    createOrdersWorker(),
    createInventoryWorker(),
    createShipmentsWorker(),
    createConsultationsWorker(),
    createNotificationsWorker(),
    createSearchIndexWorker(),
    createSitemapsWorker(),
    createFeedsWorker(),
    createAuditsWorker(),
    createReferralsWorker(),
  ];
}

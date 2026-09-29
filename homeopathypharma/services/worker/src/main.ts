import { createAllWorkers } from './processors/index.js';
import { deadLetterNote, QUEUE_NAMES } from './queues/config.js';

const workers = createAllWorkers();

for (const worker of workers) {
  worker.on('completed', (job) => {
    console.log(
      JSON.stringify({
        level: 'info',
        service: '@homeopathypharma/worker',
        event: 'completed',
        queue: job.queueName,
        jobId: job.id,
      }),
    );
  });

  worker.on('failed', (job, error) => {
    console.error(
      JSON.stringify({
        level: 'error',
        service: '@homeopathypharma/worker',
        event: 'failed',
        queue: job?.queueName,
        jobId: job?.id,
        attemptsMade: job?.attemptsMade,
        error: error.message,
        deadLetter: deadLetterNote,
      }),
    );
  });
}

console.log(
  JSON.stringify({
    level: 'info',
    service: '@homeopathypharma/worker',
    message: 'Worker process started',
    queues: Object.values(QUEUE_NAMES),
  }),
);

async function shutdown(signal: string): Promise<void> {
  console.log(
    JSON.stringify({
      level: 'info',
      service: '@homeopathypharma/worker',
      message: `Shutting down (${signal})`,
    }),
  );
  await Promise.all(workers.map((w) => w.close()));
  process.exit(0);
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

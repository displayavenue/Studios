import { Queue } from 'bullmq';
import {
  createRedisConnection,
  defaultJobOptions,
  QUEUE_NAMES,
} from './config.js';

const connection = createRedisConnection();

export const paymentsQueue = new Queue(QUEUE_NAMES.PAYMENTS, {
  connection,
  defaultJobOptions,
});

export const ordersQueue = new Queue(QUEUE_NAMES.ORDERS, {
  connection,
  defaultJobOptions,
});

export const inventoryQueue = new Queue(QUEUE_NAMES.INVENTORY, {
  connection,
  defaultJobOptions,
});

export const shipmentsQueue = new Queue(QUEUE_NAMES.SHIPMENTS, {
  connection,
  defaultJobOptions,
});

export const consultationsQueue = new Queue(QUEUE_NAMES.CONSULTATIONS, {
  connection,
  defaultJobOptions,
});

export const notificationsQueue = new Queue(QUEUE_NAMES.NOTIFICATIONS, {
  connection,
  defaultJobOptions,
});

export const searchIndexQueue = new Queue(QUEUE_NAMES.SEARCH_INDEX, {
  connection,
  defaultJobOptions,
});

export const sitemapsQueue = new Queue(QUEUE_NAMES.SITEMAPS, {
  connection,
  defaultJobOptions,
});

export const feedsQueue = new Queue(QUEUE_NAMES.FEEDS, {
  connection,
  defaultJobOptions,
});

export const auditsQueue = new Queue(QUEUE_NAMES.AUDITS, {
  connection,
  defaultJobOptions,
});

export const referralsQueue = new Queue(QUEUE_NAMES.REFERRALS, {
  connection,
  defaultJobOptions,
});

export const allQueues = [
  paymentsQueue,
  ordersQueue,
  inventoryQueue,
  shipmentsQueue,
  consultationsQueue,
  notificationsQueue,
  searchIndexQueue,
  sitemapsQueue,
  feedsQueue,
  auditsQueue,
  referralsQueue,
];

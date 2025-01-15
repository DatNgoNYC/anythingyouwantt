import { Queue, Worker, type ConnectionOptions } from 'bullmq';
import { Database } from '../database/database.js';

const connection: ConnectionOptions = {
  url: process.env.REDIS_URL,
};

/**
 * Push a "send-email" job to the ORDER_EMAIL_QUEUE.
 *
 * Mail-Service will dequeue this job, send the email,
 * and then push a job to ORDER_DELIVERED_QUEUE when done.
 */
async function queueOrderToDeliverJob(orderId: string, title: string, userEmail: string) {
  const orderToDeliverQueue = new Queue('ORDER_TO_DELIVER_QUEUE', { connection });

  try {
    await orderToDeliverQueue.add('sendEmail', { orderId, title, userEmail }, { delay: 10000 });
    console.log(
      `[RedisService] Queued send-email job: { orderId: ${orderId}, title: ${title}, userEmail: ${userEmail} }`
    );
  } catch (err) {
    console.error('[RedisService] Failed to queue send-email job:', err);
    throw err;
  }
}

/**
 * Continuously listen for jobs in the ORDER_DELIVERED_QUEUE.
 * Once a job is processed, update the database.
 */
export function listenOrderDeliveredQueue() {
  const worker = new Worker(
    'ORDER_DELIVERED_QUEUE',
    async (job) => {
      console.log('[RedisService] Received delivered job:', job.data);
      const { orderId, deliveredAt } = job.data as { orderId: string; deliveredAt: string };
      if (!orderId || !deliveredAt) {
        throw new Error('[RedisService] Invalid job data');
      }

      // Update database
      await Database.OrderModel.updateDeliveryStatus(orderId, deliveredAt);
      console.log(`[RedisService] Order ${orderId} updated with deliveredAt=${deliveredAt}.`);
    },
    { connection }
  );

  worker.on('ready', () => {
    console.log('[RedisService] Listening for jobs in ORDER_DELIVERED_QUEUE');
  });
}

// Export the Redis service
export const RedisService = {
  queueOrderToDeliverJob,
  listenOrderDeliveredQueue,
};

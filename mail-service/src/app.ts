import { Queue, Worker } from 'bullmq';
import { sendEmail } from './email-service.js';

const connection = {
  url: process.env.REDIS_URL,
};
// Start Mail Service
export function startMailService() {
  const orderDeliveredQueue = new Queue('ORDER_DELIVERED_QUEUE', { connection });

  // Worker to process jobs from the ORDER_TO_DELIVER_QUEUE
  new Worker(
    'ORDER_TO_DELIVER_QUEUE',
    async (job) => {
      const { orderId, title, userEmail } = job.data as { orderId: string; title: string; userEmail: string };
      console.log(`[mail-service] Processing job: Sending email to ${userEmail} for order ${orderId}...`);

      try {
        await sendEmail(orderId, userEmail, title);
        console.log(`[mail-service] Successfully sent email to ${userEmail} for order ${orderId}...`);

        // After email is sent, push to ORDER_DELIVERED_QUEUE for rest-api to consume
        await orderDeliveredQueue.add('orderDelivered', {
          orderId,
          deliveredAt: new Date().toISOString(),
        });
        console.log(`[mail-service] Queued job to ORDER_DELIVERED_QUEUE for order ${orderId}.`);
      } catch (error) {
        console.error(`[mail-service] Failed to send email for order ${orderId}:`, error);
        throw error; // Ensure the job is retried if it fails
      }
    },
    { connection }
  );

    console.log('[mail-service] Mail service started. Listening for jobs from ORDER_TO_DELIVER_QUEUE...');
}

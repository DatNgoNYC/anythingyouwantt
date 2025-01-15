import app from './app.js';
import { Database } from './database/database.js';
import db from './database/utils/connect.js';
import { RedisService } from './services/redis-service.js';

const PORT = process.env.PORT ?? '3000';

try {
  console.log('[rest-api] Initializing rest-api server...');

  await Database.initializeDatabase();
  console.log('[rest-api] Successfully connected with Postgres...');

  RedisService.listenOrderDeliveredQueue();

  app.listen(PORT, () => {
    console.log(`[rest-api] Successfully launched on port ${PORT}.`);
  });
} catch (error) {
  console.error('[rest-api] STARTUP FAILURE: \n', error);
  console.error('\nexiting...');
  process.exit(1);
}

/**
 * Handle graceful shutdown on SIGINT or SIGTERM.
 * For Docker: `docker stop` or `docker-compose down` typically sends SIGTERM.
 * For Ctrl+C locally: SIGINT is sent.
 */
const gracefulShutdown = async (signal: string) => {
  console.log(`[rest-api] Received ${signal}. Closing safely...`);

  try {
    // If you have any DB connections to close:
    await db.$pool.end();
    // await Database.close();

    // If your RedisService has a disconnect method:
    // await RedisService.disconnect();

    console.log('\nCleanup complete. Exiting now.');
    process.exit(0);
  } catch (err) {
    console.error('\nError during shutdown:', err);
    process.exit(1);
  }
};

// Listen for SIGINT (Ctrl+C in terminal)
process.on('SIGINT', () => {
  void gracefulShutdown('SIGINT');
});

// Listen for SIGTERM (sent by Docker and other process managers)
process.on('SIGTERM', () => {
  void gracefulShutdown('SIGTERM');
});

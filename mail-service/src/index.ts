import { startMailService } from './app.js';

console.log('\n[mail-service] Initializing mail-service...');
startMailService();

/**
 * Handle graceful shutdown on SIGINT or SIGTERM.
 * For Docker: `docker stop` or `docker-compose down` typically sends SIGTERM.
 * For Ctrl+C locally: SIGINT is sent.
 */
const gracefulShutdown = () => {
  console.log(`[mail-service] Received shutdown signal. Closing safely...`);

  try {
    console.log('\nCleanup complete. Exiting now.');
    process.exit(0);
  } catch (err) {
    console.error('\nError during shutdown:', err);
    process.exit(1);
  }
};

// Listen for SIGINT (Ctrl+C in terminal)
process.on('SIGINT', () => {
  void gracefulShutdown();
});

// Listen for SIGTERM (sent by Docker and other process managers)
process.on('SIGTERM', () => {
  void gracefulShutdown();
});

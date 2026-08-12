import { Worker } from 'bullmq';
import { redisConfig } from '../config/redis.js';
import { IMAGE_QUEUE_NAME } from '../queues/image.queue.js';
import processingService from '../services/processing.service.js';
import imageService from '../services/image.service.js';
import logger from '../utils/logger.js';

logger.info('Initializing BullMQ Image Processing Worker...');

export const imageWorker = new Worker(
  IMAGE_QUEUE_NAME,
  async (job) => {
    logger.info(`Worker picked up job #${job.id}`, { processingId: job.data.processingId });
    return processingService.executeJob(job.data);
  },
  {
    connection: redisConfig,
    concurrency: 5, // Concurrent jobs per worker instance
  }
);

// Worker Event Listeners
imageWorker.on('completed', (job, returnvalue) => {
  logger.info(`Job #${job.id} completed successfully`, {
    processingId: job.data.processingId,
    recommendation: returnvalue?.overallAssessment?.recommendation,
  });
});

imageWorker.on('failed', async (job, err) => {
  logger.error(`Job #${job?.id} failed`, {
    processingId: job?.data?.processingId,
    error: err.message,
    attemptsMade: job?.attemptsMade,
  });

  if (job?.data?.processingId) {
    try {
      await imageService.incrementRetryCount(job.data.processingId);
    } catch (e) {
      logger.error('Failed to increment retry count:', { error: e.message });
    }
  }
});

imageWorker.on('error', (err) => {
  logger.error('BullMQ Worker Connection Error:', { error: err.message });
});

// Graceful Shutdown
const handleShutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down worker gracefully...`);
  await imageWorker.close();
  process.exit(0);
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

import { Queue } from 'bullmq';
import { redisConfig } from '../config/redis.js';
import logger from '../utils/logger.js';

export const IMAGE_QUEUE_NAME = 'image-processing';

// BullMQ Queue instance
export const imageQueue = new Queue(IMAGE_QUEUE_NAME, {
  connection: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: {
      age: 86400, // Keep completed jobs for 24 hours
      count: 1000,
    },
    removeOnFail: {
      age: 604800, // Keep failed jobs for 7 days
      count: 5000,
    },
  },
});

/**
 * Enqueue image for background processing
 */
export async function enqueueImageProcessing(processingId, fileMetadata) {
  try {
    const job = await imageQueue.add(
      'process-image-job',
      {
        processingId,
        filePath: fileMetadata.filePath,
        mimeType: fileMetadata.mimeType,
        originalName: fileMetadata.originalName,
        size: fileMetadata.size,
      },
      {
        jobId: processingId, // Deduplicate by processingId
      }
    );

    logger.info('Enqueued image processing job in BullMQ', {
      processingId,
      jobId: job.id,
    });

    return job;
  } catch (error) {
    logger.error('Failed to enqueue BullMQ job:', {
      processingId,
      error: error.message,
    });
    throw error;
  }
}

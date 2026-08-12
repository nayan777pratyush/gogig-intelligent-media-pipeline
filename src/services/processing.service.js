import imageService from './image.service.js';
import { processImageAnalysis } from './analysis.service.js';
import prisma from '../config/database.js';
import logger from '../utils/logger.js';

export class ProcessingService {
  /**
   * Execute image processing pipeline for a queued job
   */
  async executeJob(jobData) {
    const { processingId } = jobData;
    logger.info('Starting background worker processing', { processingId });

    const imageRecord = await imageService.getImageById(processingId);
    if (!imageRecord) {
      const errMsg = `Image record not found in database for ID: ${processingId}`;
      logger.error(errMsg);
      throw new Error(errMsg);
    }

    try {
      // 1. Update status to 'processing'
      await imageService.markProcessingStarted(processingId);

      // 2. Perform comprehensive image analysis
      const unifiedResult = await processImageAnalysis(imageRecord, prisma);

      // 3. Update status to 'completed' and store analysis result
      await imageService.markProcessingCompleted(processingId, unifiedResult);

      logger.info('Worker completed image processing successfully', { processingId });
      return unifiedResult;
    } catch (error) {
      logger.error('Worker failed during image processing execution', {
        processingId,
        error: error.message,
        stack: error.stack,
      });

      // Update DB record to status 'failed'
      const failureCategory = error.name || 'PROCESSING_ERROR';
      await imageService.markProcessingFailed(processingId, error.message, failureCategory);

      throw error;
    }
  }
}

export default new ProcessingService();

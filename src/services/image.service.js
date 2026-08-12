import prisma from '../config/database.js';
import logger from '../utils/logger.js';

export class ImageService {
  /**
   * Create a new Image DB record with initial state 'pending'
   */
  async createImageRecord(data) {
    try {
      const record = await prisma.image.create({
        data: {
          id: data.id,
          originalName: data.originalName,
          filePath: data.filePath,
          mimeType: data.mimeType,
          size: data.size,
          status: 'pending',
        },
      });
      logger.info('Created image record in database', { id: record.id });
      return record;
    } catch (error) {
      logger.error('Failed to create image record:', { error: error.message });
      throw error;
    }
  }

  /**
   * Get image record by ID
   */
  async getImageById(id) {
    return prisma.image.findUnique({
      where: { id },
    });
  }

  /**
   * Mark processing started
   */
  async markProcessingStarted(id) {
    return prisma.image.update({
      where: { id },
      data: {
        status: 'processing',
        processingStartedAt: new Date(),
      },
    });
  }

  /**
   * Mark processing completed with unified results
   */
  async markProcessingCompleted(id, result) {
    return prisma.image.update({
      where: { id },
      data: {
        status: 'completed',
        processingCompletedAt: new Date(),
        hash: result.image?.hashes?.sha256 || null,
        perceptualHash: result.image?.hashes?.perceptualHash || null,
        width: result.image?.dimensions?.width || null,
        height: result.image?.dimensions?.height || null,
        result: result,
        failureReason: null,
        failureCategory: null,
      },
    });
  }

  /**
   * Mark processing failed with reason and category
   */
  async markProcessingFailed(id, failureReason, failureCategory = 'UNHANDLED_EXCEPTION') {
    return prisma.image.update({
      where: { id },
      data: {
        status: 'failed',
        failureReason,
        failureCategory,
        processingCompletedAt: new Date(),
      },
    });
  }

  /**
   * Increment retry count
   */
  async incrementRetryCount(id) {
    return prisma.image.update({
      where: { id },
      data: {
        retryCount: { increment: 1 },
      },
    });
  }
}

export default new ImageService();

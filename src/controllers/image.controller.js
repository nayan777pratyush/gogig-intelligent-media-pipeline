import { v4 as uuidv4 } from 'uuid';
import storageService from '../services/storage.service.js';
import imageService from '../services/image.service.js';
import { enqueueImageProcessing } from '../queues/image.queue.js';
import logger from '../utils/logger.js';

export class ImageController {
  /**
   * POST /api/v1/images
   * Upload image endpoint - returns HTTP 202 Accepted immediately
   */
  async uploadImage(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FILE',
            message: 'No image file uploaded in field "image"',
          },
        });
      }

      const processingId = uuidv4();
      const { originalname, buffer, mimetype } = req.file;

      // 1. Save uploaded file to disk
      const savedFile = await storageService.saveFile(buffer, originalname, mimetype);

      // 2. Save DB record with status 'pending'
      const imageRecord = await imageService.createImageRecord({
        id: processingId,
        originalName: originalname,
        filePath: savedFile.filePath,
        mimeType: mimetype,
        size: savedFile.size,
      });

      // 3. Enqueue background processing job in BullMQ
      await enqueueImageProcessing(processingId, {
        filePath: savedFile.filePath,
        mimeType: mimetype,
        originalName: originalname,
        size: savedFile.size,
      });

      logger.info('Accepted image upload and enqueued job', { processingId });

      return res.status(202).json({
        success: true,
        data: {
          processingId,
          status: 'pending',
          originalName: originalname,
          size: savedFile.size,
          statusUrl: `/api/v1/images/${processingId}/status`,
          resultUrl: `/api/v1/images/${processingId}/result`,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/images/:id/status
   * Fetch image processing status
   */
  async getStatus(req, res, next) {
    try {
      const { id } = req.params;
      const record = await imageService.getImageById(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `No processing record found for ID: ${id}`,
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          processingId: record.id,
          status: record.status,
          retryCount: record.retryCount,
          createdAt: record.createdAt,
          processingStartedAt: record.processingStartedAt,
          processingCompletedAt: record.processingCompletedAt,
          failureReason: record.failureReason,
          failureCategory: record.failureCategory,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/images/:id/result
   * Fetch image analysis output
   */
  async getResult(req, res, next) {
    try {
      const { id } = req.params;
      const record = await imageService.getImageById(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `No processing record found for ID: ${id}`,
          },
        });
      }

      if (record.status === 'pending' || record.status === 'processing') {
        return res.status(202).json({
          success: true,
          data: {
            processingId: record.id,
            status: record.status,
            message: 'Image processing is still in progress. Check back shortly.',
            statusUrl: `/api/v1/images/${record.id}/status`,
          },
        });
      }

      if (record.status === 'failed') {
        return res.status(200).json({
          success: false,
          data: {
            processingId: record.id,
            status: 'failed',
            failureReason: record.failureReason,
            failureCategory: record.failureCategory,
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: record.result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/images/:id/failure
   * Fetch explicit failure details
   */
  async getFailure(req, res, next) {
    try {
      const { id } = req.params;
      const record = await imageService.getImageById(id);

      if (!record) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `No processing record found for ID: ${id}`,
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          processingId: record.id,
          status: record.status,
          failed: record.status === 'failed',
          failureReason: record.failureReason || null,
          failureCategory: record.failureCategory || null,
          retryCount: record.retryCount,
          processingCompletedAt: record.processingCompletedAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ImageController();

import { Router } from 'express';
import imageController from '../controllers/image.controller.js';
import { uploadMiddleware } from '../middleware/upload.middleware.js';

const router = Router();

// Upload image for async processing
router.post('/images', uploadMiddleware.single('image'), (req, res, next) =>
  imageController.uploadImage(req, res, next)
);

// Get processing status
router.get('/images/:id/status', (req, res, next) =>
  imageController.getStatus(req, res, next)
);

// Get analysis result
router.get('/images/:id/result', (req, res, next) =>
  imageController.getResult(req, res, next)
);

// Get failure reason
router.get('/images/:id/failure', (req, res, next) =>
  imageController.getFailure(req, res, next)
);

export default router;

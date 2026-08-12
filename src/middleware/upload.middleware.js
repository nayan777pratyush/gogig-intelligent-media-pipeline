import multer from 'multer';
import { config } from '../config/env.js';

// Memory storage for buffer validation before disk persistence
const storage = multer.memoryStorage();

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg']);

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error(`Invalid file format: ${file.mimetype}. Allowed formats: JPEG, PNG, WebP.`);
    error.statusCode = 400;
    error.code = 'INVALID_FILE_TYPE';
    cb(error, false);
  }
};

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSizeMb * 1024 * 1024, // e.g. 10MB
  },
});

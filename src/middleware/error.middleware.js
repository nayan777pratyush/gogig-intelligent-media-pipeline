import logger from '../utils/logger.js';
import { config } from '../config/env.js';

export function errorHandlerMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`[API Error] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`, {
    requestId: req.id,
    code: err.code,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });

  const response = {
    success: false,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      message: message,
    },
  };

  if (config.nodeEnv === 'development' && err.stack) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

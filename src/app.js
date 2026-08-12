import express from 'express';
import cors from 'cors';
import { requestIdMiddleware } from './middleware/requestId.middleware.js';
import { errorHandlerMiddleware } from './middleware/error.middleware.js';
import imageRoutes from './routes/image.routes.js';
import healthRoutes from './routes/health.routes.js';
import logger from './utils/logger.js';

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestIdMiddleware);

// HTTP Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`, {
      requestId: req.id,
    });
  });
  next();
});

// API Routes
app.use('/', healthRoutes);
app.use('/api/v1', imageRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.originalUrl}`,
    },
  });
});

// Error Handler Middleware
app.use(errorHandlerMiddleware);

export default app;

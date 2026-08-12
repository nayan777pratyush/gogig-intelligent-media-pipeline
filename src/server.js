import app from './app.js';
import { config } from './config/env.js';
import logger from './utils/logger.js';
import prisma from './config/database.js';

const server = app.listen(config.port, () => {
  logger.info(`Server running in ${config.nodeEnv} mode on http://localhost:${config.port}`);
  logger.info(`Health check available at http://localhost:${config.port}/health`);
});

const handleGracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Starting HTTP server graceful shutdown...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Database connection closed.');
    process.exit(0);
  });
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', { error: err.message, stack: err.stack });
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', { reason: reason });
});

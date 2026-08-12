import { Router } from 'express';
import prisma from '../config/database.js';
import { createRedisClient } from '../config/redis.js';

const router = Router();

// Helper to wrap promise with a fast timeout
const withTimeout = (promise, ms = 1000) => {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Connection timed out')), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timeoutId));
};

router.get('/health', async (req, res) => {
  const health = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    services: {
      database: 'UNKNOWN',
      redis: 'UNKNOWN',
    },
  };

  let isHealthy = true;

  // Check Database with 1s timeout
  try {
    await withTimeout(prisma.$queryRaw`SELECT 1`, 1000);
    health.services.database = 'UP';
  } catch (dbErr) {
    health.services.database = 'DOWN';
    health.databaseError = dbErr.message;
    isHealthy = false;
  }

  // Check Redis with 1s timeout
  try {
    const redis = createRedisClient();
    const pingRes = await withTimeout(redis.ping(), 1000);
    redis.disconnect();
    if (pingRes === 'PONG') {
      health.services.redis = 'UP';
    } else {
      health.services.redis = 'DEGRADED';
    }
  } catch (redisErr) {
    health.services.redis = 'DOWN';
    health.redisError = redisErr.message;
    isHealthy = false;
  }

  health.status = isHealthy ? 'UP' : 'DOWN';
  const statusCode = isHealthy ? 200 : 503;

  return res.status(statusCode).json(health);
});

export default router;

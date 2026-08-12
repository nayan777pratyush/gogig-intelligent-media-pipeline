import { Redis } from 'ioredis';
import { config } from './env.js';
import logger from '../utils/logger.js';

export const redisConfig = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  maxRetriesPerRequest: null,
};

export const createRedisClient = () => {
  const client = new Redis(redisConfig);

  client.on('connect', () => {
    logger.info('Connected to Redis server');
  });

  client.on('error', (err) => {
    logger.error('Redis Client Error:', { error: err.message });
  });

  return client;
};

import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

let prisma;

if (!global.__prisma) {
  global.__prisma = new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'stdout', level: 'error' },
      { emit: 'stdout', level: 'info' },
      { emit: 'stdout', level: 'warn' },
    ],
  });
}

prisma = global.__prisma;

export default prisma;

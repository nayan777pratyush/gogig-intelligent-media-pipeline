import winston from 'winston';
import { config } from '../config/env.js';

const logger = winston.createLogger({
  level: config.nodeEnv === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'media-processing-pipeline' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, service, processingId, jobId, ...meta }) => {
          let logStr = `[${timestamp}] ${level}: ${message}`;
          if (processingId) logStr += ` [processingId: ${processingId}]`;
          if (jobId) logStr += ` [jobId: ${jobId}]`;
          if (Object.keys(meta).length > 0) logStr += ` ${JSON.stringify(meta)}`;
          return logStr;
        })
      )
    })
  ]
});

export default logger;

import { jest } from '@jest/globals';
import path from 'path';

// Mock DB and BullMQ queue before importing app
jest.unstable_mockModule('../../src/services/image.service.js', () => {
  const records = new Map();
  return {
    default: {
      createImageRecord: jest.fn(async (data) => {
        const record = { ...data, status: 'pending', createdAt: new Date() };
        records.set(data.id, record);
        return record;
      }),
      getImageById: jest.fn(async (id) => records.get(id) || null),
      markProcessingStarted: jest.fn(async (id) => {
        const rec = records.get(id);
        if (rec) rec.status = 'processing';
        return rec;
      }),
      markProcessingCompleted: jest.fn(async (id, result) => {
        const rec = records.get(id);
        if (rec) {
          rec.status = 'completed';
          rec.result = result;
        }
        return rec;
      }),
      markProcessingFailed: jest.fn(async (id, reason, cat) => {
        const rec = records.get(id);
        if (rec) {
          rec.status = 'failed';
          rec.failureReason = reason;
          rec.failureCategory = cat;
        }
        return rec;
      }),
    },
  };
});

jest.unstable_mockModule('../../src/queues/image.queue.js', () => ({
  enqueueImageProcessing: jest.fn(async (processingId) => ({
    id: processingId,
  })),
  imageQueue: {
    add: jest.fn(),
  },
}));

// Dynamic import of app after mocks
const { default: app } = await import('../../src/app.js');
const { default: request } = await import('supertest');

describe('REST API Endpoints Integration Tests', () => {
  let createdProcessingId;

  describe('POST /api/v1/images (Upload)', () => {
    it('should accept valid image upload and return 202 Accepted', async () => {
      const sampleFile = path.resolve(process.cwd(), 'sample-images/sample_1.png');
      const response = await request(app)
        .post('/api/v1/images')
        .attach('image', sampleFile);

      expect(response.status).toBe(202);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('processingId');
      expect(response.body.data.status).toBe('pending');

      createdProcessingId = response.body.data.processingId;
    });

    it('should reject upload without file', async () => {
      const response = await request(app).post('/api/v1/images');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('MISSING_FILE');
    });
  });

  describe('GET /api/v1/images/:id/status', () => {
    it('should return processing status for existing ID', async () => {
      const response = await request(app).get(`/api/v1/images/${createdProcessingId}/status`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.processingId).toBe(createdProcessingId);
      expect(response.body.data.status).toBe('pending');
    });

    it('should return 404 for unknown processingId', async () => {
      const response = await request(app).get('/api/v1/images/unknown-id-123/status');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /health', () => {
    it('should respond to health check endpoint', async () => {
      const response = await request(app).get('/health');
      expect([200, 503]).toContain(response.status);
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('services');
    });
  });
});

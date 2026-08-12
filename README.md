# Intelligent Media Processing Pipeline (Node.js / Express / Prisma / BullMQ / Redis)

> Production-quality, asynchronous media processing pipeline built for auto-rickshaw and vehicle verification in JavaScript (Node.js + Express).

---

## 📌 Executive Overview

The **Intelligent Media Processing Pipeline** processes incoming vehicle and auto-rickshaw images captured from the field. Field uploads often suffer from low lighting, motion blur, duplicate submissions, screen captures, or digital tampering.

This system provides a non-blocking API that accepts uploads, generates unique processing IDs, delegates image verification to a queue-backed background worker network, runs **8 multi-layer deterministic analyzers**, integrates optional **Google Gemini Vision AI**, and persists complete structured audit trails in PostgreSQL.

---

## 🏗️ Architecture & Service Flow

```
[ Client / App ]
      │
      │ 1. POST /api/v1/images (multipart/form-data)
      ▼
[ Express API ] ──────────────► 2. Save file to disk (uploads/)
      │                         3. Insert DB record (status: "pending")
      │ 4. Enqueue BullMQ job
      ▼
[ Redis Queue ] (image-processing)
      │
      │ 5. Worker consumes job (status: "processing")
      ▼
[ Background Worker Network ]
      ├─► Blur Analyzer (Sharp Laplacian Variance)
      ├─► Brightness Analyzer (Grayscale Luminance)
      ├─► Duplicate Analyzer (SHA-256 Hash & pHash Similarity)
      ├─► EXIF Metadata Analyzer (exif-reader Device/GPS/Software)
      ├─► OCR Engine (Tesseract.js Text Extraction)
      ├─► Indian License Plate Analyzer (Regex: [A-Z]{2}[0-9]{2}[A-Z]{1,3}[0-9]{4})
      ├─► Screenshot Analyzer (Aspect Ratios & Filename Heuristics)
      ├─► Tamper Analyzer (Editing Software Signatures)
      └─► AI Vision Service (Google Gemini Vision API with Fallback)
      │
      │ 6. Aggregate unified JSON & update DB record (status: "completed")
      ▼
[ PostgreSQL Database ]
      ▲
      │ 7. GET /api/v1/images/:id/result
[ Client / App ]
```

---

## 🚀 Key Features & Capabilities

- **100% Pure JavaScript (ES Modules)**: No TypeScript, clean modern ES syntax.
- **Non-Blocking Ingestion**: Returns **HTTP 202 Accepted** immediately with `processingId` and status URLs.
- **Asynchronous Queue Architecture**: Powered by BullMQ & Redis with concurrency control, automatic exponential backoff retries, and failure tracking.
- **8 Comprehensive Deterministic Analyzers**:
  1. **Blur Detection**: Sharp Laplacian variance on normalized pixel buffer.
  2. **Brightness Analysis**: Mean luminance & underexposed/overexposed ratio calculation.
  3. **Duplicate & Similarity Detection**: Exact SHA-256 hashing + Perceptual hashing (`image-hash`) with Hamming distance comparison.
  4. **EXIF Metadata**: Extracts camera make, model, original timestamp, GPS coordinates, and software tags.
  5. **OCR Extraction**: Optical Character Recognition using `Tesseract.js`.
  6. **Indian License Plate Validation**: RegEx pattern matching for standard registration numbers (`KA01AB1234`, `MH12DE1415`, `BH` series) and state code verification.
  7. **Screenshot Detection**: Detects common mobile/desktop aspect ratios (19.5:9, 20:9, 16:9), PNG format without EXIF, and screenshot filenames.
  8. **Tamper & Editing Heuristics**: Identifies software signatures from Photoshop, Canva, GIMP, Lightroom, Snapseed, or missing camera headers.
- **Optional Gemini Vision AI**: Uses `gemini-1.5-flash` for high-level vehicle categorization and condition assessment with graceful fallback when key is missing or API fails.
- **Full REST API & Health Monitoring**: Dedicated status, result, failure reason, and health check endpoints.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Framework** | Node.js (v20+), Express.js | Core Web API |
| **Database & ORM** | PostgreSQL, Prisma ORM | Metadata & Results Persistence |
| **Queue & Cache** | Redis, BullMQ | Asynchronous Background Processing |
| **Image Processing** | Sharp, Tesseract.js, `image-hash`, `exif-reader` | Computer Vision & Heuristic Analysis |
| **AI Integration** | `@google/generative-ai` (Gemini 1.5 Flash) | Visual Categorization & Verification |
| **Testing** | Jest, Supertest | Unit & Integration Testing |
| **Containerization** | Docker, Docker Compose | Multi-container Orchestration |

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
- Node.js >= 20
- PostgreSQL database
- Redis server
- Docker & Docker Compose (optional for containerized run)

### 1. Local Environment Setup

```bash
# Clone the repository
git clone https://github.com/your-repo/gogig-intelligent-media-pipeline.git
cd gogig-intelligent-media-pipeline

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/gogig_media?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
GEMINI_API_KEY=your_optional_gemini_api_key
```

### 2. Database Migration

```bash
# Generate Prisma Client & Push Schema to Postgres
npm run prisma:generate
npm run prisma:push
```

### 3. Running API & Worker

**Option A: Run API and Worker in separate terminals**
```bash
# Terminal 1: Run Express API Server
npm run dev

# Terminal 2: Run BullMQ Background Worker
npm run worker
```

**Option B: Run Containerized Stack via Docker Compose**
```bash
docker-compose up --build
```

---

## 📡 API Reference & Sample Requests

### 1. Upload Image (Async Ingestion)
`POST /api/v1/images`

**Request:**
```bash
curl -X POST http://localhost:3000/api/v1/images \
  -F "image=@sample-images/sample_1.png"
```

**Response (HTTP 202 Accepted):**
```json
{
  "success": true,
  "data": {
    "processingId": "8f3b2a1c-9d4e-4f7a-b2c1-3d4e5f6a7b8c",
    "status": "pending",
    "originalName": "sample_1.png",
    "size": 1604658,
    "statusUrl": "/api/v1/images/8f3b2a1c-9d4e-4f7a-b2c1-3d4e5f6a7b8c/status",
    "resultUrl": "/api/v1/images/8f3b2a1c-9d4e-4f7a-b2c1-3d4e5f6a7b8c/result"
  }
}
```

---

### 2. Check Processing Status
`GET /api/v1/images/:id/status`

**Response:**
```json
{
  "success": true,
  "data": {
    "processingId": "8f3b2a1c-9d4e-4f7a-b2c1-3d4e5f6a7b8c",
    "status": "completed",
    "retryCount": 0,
    "createdAt": "2026-08-12T17:15:00.000Z",
    "processingStartedAt": "2026-08-12T17:15:00.120Z",
    "processingCompletedAt": "2026-08-12T17:15:02.450Z",
    "failureReason": null
  }
}
```

---

### 3. Fetch Unified Analysis Result
`GET /api/v1/images/:id/result`

**Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "processingId": "8f3b2a1c-9d4e-4f7a-b2c1-3d4e5f6a7b8c",
    "status": "completed",
    "processedAt": "2026-08-12T17:15:02.450Z",
    "durationMs": 2330,
    "image": {
      "originalName": "sample_1.png",
      "mimeType": "image/png",
      "size": 1604658,
      "dimensions": { "width": 1280, "height": 960 },
      "hashes": {
        "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        "perceptualHash": "a1b2c3d4e5f67890"
      }
    },
    "vehicle": {
      "licensePlate": "KA01AB1234",
      "licensePlateValid": true,
      "vehicleType": "Auto-Rickshaw",
      "makeModelCandidate": "Bajaj RE Compact"
    },
    "checks": {
      "blur": { "isBlurry": false, "laplacianVariance": 185.4, "qualityRating": "sharp" },
      "brightness": { "isLowLight": false, "isOverexposed": false, "meanLuminance": 128.5 },
      "duplicate": { "isDuplicate": false, "matchingImageId": null },
      "ocr": { "rawText": "KA01AB1234", "confidence": 92.4 },
      "licensePlate": { "hasValidPlate": true, "primaryPlate": "KA01AB1234" },
      "screenshot": { "isScreenshot": false, "confidenceScore": 0 },
      "tampering": { "isTampered": false, "tamperScore": 0 }
    },
    "aiAnalysis": { "enabled": true, "aiProcessed": true, "modelUsed": "gemini-1.5-flash" },
    "overallAssessment": {
      "passedVerification": true,
      "qualityScore": 100,
      "recommendation": "ACCEPT",
      "flags": []
    }
  }
}
```

---

### 4. Fetch Failure Reason
`GET /api/v1/images/:id/failure`

**Response:**
```json
{
  "success": true,
  "data": {
    "processingId": "8f3b2a1c-9d4e-4f7a-b2c1-3d4e5f6a7b8c",
    "status": "failed",
    "failed": true,
    "failureReason": "Corrupt image buffer header",
    "failureCategory": "CORRUPT_FILE",
    "retryCount": 3
  }
}
```

---

### 5. Health Check
`GET /health`

**Response (HTTP 200 OK):**
```json
{
  "status": "UP",
  "timestamp": "2026-08-12T17:15:10.000Z",
  "uptimeSeconds": 342,
  "services": {
    "database": "UP",
    "redis": "UP"
  }
}
```

---

## 🧪 Testing & Sample Image Processing

### Automated Tests
Run Jest unit and integration test suite:
```bash
npm test
```

### Process 3 Supplied Sample Images
Process all 3 sample vehicle images locally and update `docs/sample-results.md`:
```bash
npm run process-samples
```

See [docs/sample-results.md](file:///d:/Users/nayan/Gogig%20Assignment/docs/sample-results.md) for full raw execution results on all 3 sample images.

---

## 🤖 Mandatory AI Usage Disclosure

As part of the assignment requirements, here is an explicit disclosure of AI usage during this project:

- **AI Tools Used**: Google Gemini 1.5 Flash (for vision analysis API) and Antigravity AI pair programmer for system design and code implementation.
- **What AI Helped With**:
  - Structuring clean Express middleware, BullMQ queue events, and error boundary isolation.
  - Designing multi-layer heuristic algorithms for sharpness variance, perceptual hashing, and Indian license plate regex.
  - Formulating structured JSON prompt engineering for Gemini Vision API.
- **Where AI Output Was Wrong / Adjusted**:
  - Initial proposal used `@google/genai` npm package version that did not exist on public npm. Corrected to official `@google/generative-ai` package.
  - Initial blur heuristic used simple gradient magnitude which produced false positives on high-contrast auto-rickshaw stripes; upgraded to 3x3 Laplacian kernel convolution variance.
- **Validation**: Every AI-assisted module was validated through unit tests (`npm test`) and verified against actual sample vehicle images.

---

## ⚖️ Trade-offs & Engineering Decisions

1. **Laplacian Variance vs Heavy ML Model for Blur**:
   - *Trade-off*: Used Sharp-based 3x3 Laplacian variance calculation rather than loading PyTorch/TensorFlow models.
   - *Reasoning*: Extremely fast execution (<20ms per image), zero GPU overhead, perfect for high-throughput microservices.
2. **Regex + Tesseract.js vs Custom License Plate Model**:
   - *Trade-off*: OCR text regex parsing instead of custom YOLO license plate detector.
   - *Reasoning*: Keeps installation footprint lightweight while providing reliable verification for standard Indian vehicle numbers (`KA01...`, `MH12...`).
3. **Local Disk Storage vs S3 Cloud Storage**:
   - *Trade-off*: Default implementation saves files locally in `uploads/`.
   - *Reasoning*: Simplifies single-command local testing (`docker-compose up`). Abstracted behind `StorageService` for zero-code-change migration to AWS S3 / Cloudflare R2 in production.

---

## 📈 Scalability & Production Readiness

1. **Horizontal Worker Auto-scaling**: Because background workers poll BullMQ over Redis independently of the API HTTP servers, worker containers can auto-scale based on Redis queue depth (`image-processing` length).
2. **Database Indexing**: The `Image` table includes composite indexes on `[status]`, `[hash]`, and `[createdAt]` for instant duplicate lookups and fast status polling.
3. **Graceful Shutdown**: All server and worker instances register `SIGINT` and `SIGTERM` handlers to cleanly disconnect Prisma database pools and close active Redis connections without dropping jobs in flight.

# Intelligent Media Processing Pipeline (Node.js / Express / Prisma / BullMQ / Redis)

> Production-quality, asynchronous media processing pipeline built for auto-rickshaw and vehicle verification in JavaScript (Node.js + Express).

---

## Live Deployment

| Component | URL |
|---|---|
| **Frontend** | https://gogig-frontend.onrender.com |
| **Backend API** | https://gogig-api.onrender.com |
| **Health Check** | https://gogig-api.onrender.com/health |

### 🚀 Live Demo

**Frontend:**  
https://gogig-frontend.onrender.com

**Backend API:**  
The API is deployed on Render:

**Base URL:** https://gogig-api.onrender.com

### Health Check

GET:

https://gogig-api.onrender.com/health

```json
{
  "status": "UP",
  "services": {
    "database": "UP",
    "redis": "UP"
  }
}
```

---

### Example deployed upload

POST https://gogig-api.onrender.com/api/v1/images

The API immediately returns HTTP 202 with a processing ID. The client can then poll the status endpoint and retrieve the final analysis result.

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
      └─► AI Vision Service (Google Gemini 2.5 Flash, optional with graceful failure handling)
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
- **Optional Gemini Vision AI**: Uses `gemini-2.5-flash` for high-level vehicle categorization and condition assessment with graceful fallback when key is missing or API fails.
- **Full REST API & Health Monitoring**: Dedicated status, result, failure reason, and health check endpoints.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime & Framework** | Node.js (v20+), Express.js | Core Web API |
| **Database & ORM** | PostgreSQL, Prisma ORM | Metadata & Results Persistence |
| **Queue & Cache** | Redis, BullMQ | Asynchronous Background Processing |
| **Image Processing** | Sharp, Tesseract.js, `image-hash`, `exif-reader` | Computer Vision & Heuristic Analysis |
| **AI Integration** | `@google/generative-ai` (Gemini 2.5 Flash) | Visual Categorization & Verification |
| **Testing** | Jest, Supertest | Unit & Integration Testing |
| **Containerization** | Docker, Docker Compose | Multi-container Orchestration |

---

## Assumptions

- Uploaded files are vehicle/auto-rickshaw images in JPEG, PNG, or WebP format.
- Image verification is heuristic-based and is not intended to provide legal or regulatory vehicle verification.
- OCR and AI results are probabilistic and may be incorrect for low-quality, oblique, or poorly illuminated images.
- Indian license plate validation is based on recognized registration-format patterns and does not verify registration against a government database.
- Duplicate detection primarily relies on exact SHA-256 matching, with perceptual hashing used for similarity analysis.
- Local filesystem storage is used for the assignment deployment; object storage such as S3/R2 would be preferred for a multi-instance production deployment.
- Gemini AI is optional. If the API key is unavailable or the external AI service fails, deterministic analysis continues and the result records the AI failure.

---

## Production Test Evidence

Complete production API test results using all three provided sample images are available in:

- [Production Test Results](./docs/production-test-results.md)
- [Sample API Results](./docs/sample-results.md)

The production test evidence includes:
- Health check
- All 3 sample image uploads
- Asynchronous processing and status polling
- Final result retrieval
- OCR
- Blur detection
- Metadata analysis
- Duplicate detection
- Tampering detection
- Brightness analysis
- Screenshot detection
- License plate analysis
- Gemini AI vehicle analysis
- Missing-file validation
- Invalid-file-type validation
- Invalid processing-ID validation

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
git clone https://github.com/nayan777pratyush/gogig-intelligent-media-pipeline.git
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
    "aiAnalysis": { "enabled": true, "aiProcessed": true, "modelUsed": "gemini-2.5-flash" },
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

See [docs/sample-results.md](docs/sample-results.md) for full sample processing results.

---

## 🤖 Mandatory AI Usage Disclosure

AI tools were used during the development of this project for both implementation
assistance and application-level image analysis. All AI-assisted output was
reviewed, integrated, tested, and validated by the developer.

### AI Tools Used

- **Antigravity AI** — Used as a development/pair-programming assistant during
  implementation, debugging, documentation, and architectural discussions.
- **Google Gemini 2.5 Flash** — Integrated into the application as an optional
  Vision AI service for vehicle categorization, license-plate interpretation,
  make/model estimation, and overall vehicle-condition assessment.

### How AI Assisted During Development

Antigravity AI was used primarily as a coding and engineering assistant for:

- Discussing the overall asynchronous processing architecture using Express,
  PostgreSQL, Redis, BullMQ, and background workers.
- Assisting with implementation patterns for Express controllers, middleware,
  queue processing, error handling, and service separation.
- Reviewing and improving image-analysis logic, including blur detection,
  brightness analysis, duplicate detection, OCR processing, screenshot
  heuristics, tamper detection, and Indian license-plate validation.
- Assisting with API response structures, error handling, retry behaviour, and
  project documentation.
- Helping identify implementation issues during development and suggesting
  alternative approaches that were then tested against the actual application.

AI-generated suggestions were not treated as authoritative. Code and design
decisions were reviewed and modified where necessary based on the actual
requirements, runtime behaviour, test results, and production API responses.

### Application-Level Gemini Vision AI

Google Gemini 2.5 Flash is an optional component of the deployed processing
pipeline. It is invoked after the deterministic image checks and provides
higher-level visual interpretation such as:

- Vehicle type classification
- Make/model candidate identification
- License-plate text and legibility assessment
- Vehicle condition assessment
- Additional visual observations

The deterministic analyzers remain independent of the AI service. If the Gemini
API is unavailable, fails, or the API key is not configured, the pipeline
continues processing and returns the deterministic analysis instead of failing
the entire image-processing job.

### AI Output Review and Corrections

AI-generated suggestions were reviewed against the actual project requirements
and runtime behaviour. During development, approaches suggested by AI were
changed when they did not match the project's dependencies, image-processing
behaviour, or required output.

Examples include:

- Dependency/API usage was checked against the packages actually installed in
  the project rather than accepting generated import or package suggestions
  blindly.
- Image-analysis heuristics were evaluated against the supplied vehicle images
  and adjusted when the observed behaviour did not provide sufficiently useful
  results.
- API contracts, queue behaviour, error responses, and database interactions
  were verified through actual execution rather than relying only on
  AI-generated code.

### Validation

AI-assisted implementation was validated through:

- Automated Jest/Supertest tests
- Local API and worker execution
- PostgreSQL and Redis integration
- Processing of all three supplied sample images
- Production deployment on Render
- Production API health checks
- Production upload, asynchronous status polling, and result retrieval
- Edge-case testing for missing files, invalid file types, and unknown
  processing IDs

The production test evidence is documented in
[`docs/production-test-results.md`](./docs/production-test-results.md).

AI was therefore used as a development and analysis aid, but the final
implementation, integration decisions, testing, and verification were performed
against the actual running system.

---

## ⚖️ Trade-offs & Engineering Decisions

### 1. Laplacian Variance vs. Heavy ML Model for Blur Detection

- **Trade-off:** Used Sharp-based Laplacian variance to estimate image
  sharpness instead of introducing a dedicated PyTorch/TensorFlow blur
  classification model.
- **Reasoning:** Laplacian variance is lightweight, deterministic, CPU-based,
  and easy to deploy in a Node.js service. It avoids GPU requirements,
  additional model files, and ML inference overhead while providing a useful
  sharpness signal for the verification pipeline.
- **Limitation:** It is a heuristic rather than a semantic understanding of
  image quality, so the threshold may need calibration for different image
  types and use cases.

### 2. Tesseract.js + Indian Plate Regex vs. Custom License-Plate Detection Model

- **Trade-off:** Used Tesseract.js OCR followed by Indian license-plate format
  validation instead of introducing a dedicated YOLO/custom license-plate
  detection model.
- **Reasoning:** This keeps the implementation and deployment footprint
  relatively lightweight while still providing a deterministic validation
  layer for common Indian registration-number formats.
- **Limitation:** OCR quality depends heavily on image quality, plate
  orientation, lighting, and text visibility. Therefore, the regex-based
  validation is treated as one signal rather than a definitive plate detector.
  Gemini Vision can provide an additional interpretation when enabled.

### 3. Local Disk Storage vs. Object Storage

- **Trade-off:** The default implementation stores uploaded files on local
  disk under `uploads/` rather than immediately introducing AWS S3, Cloudflare
  R2, or another object-storage service.
- **Reasoning:** Local storage keeps the project simple to run locally and with
  Docker Compose, while the storage logic is isolated behind `StorageService`.
  This makes it possible to replace the persistence implementation with an
  object-storage provider without changing the controller or processing
  pipeline.
- **Limitation:** Local disk storage is not suitable for horizontally scaled
  production instances because files are tied to a particular instance.
  Object storage would be the preferred approach for a multi-instance
  production deployment.

### 4. Deterministic Analyzers vs. AI-Only Verification

- **Trade-off:** Kept deterministic image analyzers as the primary verification
  layer and used Gemini Vision as an additional high-level analysis layer
  rather than making the entire pipeline dependent on an AI model.
- **Reasoning:** Deterministic checks such as hashing, brightness, metadata,
  blur, OCR, and duplicate detection are predictable, testable, and continue
  working even when the AI service is unavailable.
- **Limitation:** Heuristic analyzers cannot provide the same semantic
  understanding as a vision model. Conversely, AI output can be probabilistic
  and dependent on external API availability. Keeping both layers allows the
  system to degrade gracefully when Gemini is unavailable.

### 5. Redis + BullMQ vs. Synchronous Processing

- **Trade-off:** Image analysis is performed asynchronously using Redis and
  BullMQ rather than processing the complete image synchronously inside the
  upload request.
- **Reasoning:** OCR, image analysis, and Gemini inference can take
  significantly longer than a normal HTTP request. Returning `202 Accepted`
  with a processing ID allows the API to remain responsive while workers
  process jobs independently. BullMQ also provides retry and backoff
  capabilities.
- **Limitation:** Clients must perform status polling or use another
  notification mechanism instead of receiving the final result in the initial
  request.

### 6. PostgreSQL vs. a NoSQL Database

- **Trade-off:** Used PostgreSQL for processing records and structured
  analysis results instead of introducing a document-oriented database.
- **Reasoning:** The system has well-defined entities and relationships around
  uploaded images, processing states, retries, timestamps, and analysis
  results. PostgreSQL provides strong consistency and straightforward
  querying for these records while Prisma provides a typed data-access layer.
- **Limitation:** Highly flexible or extremely large unstructured analysis
  payloads may eventually benefit from a different persistence strategy, but
  PostgreSQL is sufficient for the current scope.

---

## 📈 Scalability & Production Readiness

1. **Horizontal Worker Auto-scaling**: Because background workers poll BullMQ over Redis independently of the API HTTP servers, worker containers can auto-scale based on Redis queue depth (`image-processing` length).
2. **Database Indexing**: The `Image` table includes composite indexes on `[status]`, `[hash]`, and `[createdAt]` for instant duplicate lookups and fast status polling.
3. **Graceful Shutdown**: All server and worker instances register `SIGINT` and `SIGTERM` handlers to cleanly disconnect Prisma database pools and close active Redis connections without dropping jobs in flight.

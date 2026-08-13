# GoGig Intelligent Media Pipeline — Frontend

A React + Vite frontend for the GoGig Intelligent Media Pipeline.

The application provides a simple interface for uploading vehicle images and viewing the verification results returned by the production backend.

## Features

- Drag-and-drop vehicle image upload
- JPEG, PNG and WebP support
- 10 MB upload limit
- Image preview before analysis
- Upload progress and processing state
- Polling of asynchronous processing status
- Vehicle identification results
- License plate detection and validation
- OCR information
- Blur and image-quality checks
- Duplicate detection
- Tampering detection
- Screenshot detection
- Brightness analysis
- AI vehicle analysis
- Verification recommendation
- Technical image metadata
- Responsive dark UI

## Tech Stack

- React
- Vite
- JavaScript
- Lucide React
- CSS
- Fetch API

## Backend

The frontend communicates with the production API:

```text
https://gogig-api.onrender.com
```

The main API flow is:

```text
Frontend
   |
   | POST /api/v1/images
   v
Production API
   |
   | processingId
   v
Frontend polls
   |
   | GET /api/v1/images/:processingId/status
   v
Processing completed
   |
   | GET /api/v1/images/:processingId/result
   v
Verification Results
```

## Environment Variable

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=https://gogig-api.onrender.com
```

> Do not commit secrets or private API keys to the repository.

## Installation

From the `frontend` directory:

```bash
npm install
```

## Run Locally

```bash
npm run dev
```

The Vite development server will normally be available at:

```text
http://localhost:5173
```

## Production Build

Create a production build with:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Deployment

The frontend can be deployed as a Render Static Site.

Recommended Render configuration:

```text
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

Environment variable:

```text
VITE_API_BASE_URL=https://gogig-api.onrender.com
```

## API Error Handling

The frontend handles:

- Upload failures
- Invalid image files
- Processing failures
- API errors
- Missing analysis results
- Unavailable AI analysis

If the AI service is temporarily unavailable or its quota has been exhausted, the frontend can still display the non-AI verification information returned by the backend.

## Project Structure

```text
frontend/
├── public/
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Backend Repository

The frontend is designed to work with the GoGig Intelligent Media Pipeline backend.

Production API:

```text
https://gogig-api.onrender.com
```

## Notes

The frontend does not perform image analysis itself. It delegates processing to the backend pipeline and displays the returned verification results.

AI analysis depends on the configured AI provider and its availability/quota.
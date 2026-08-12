import { analyzeBlur } from '../analyzers/blur.analyzer.js';
import { analyzeBrightness } from '../analyzers/brightness.analyzer.js';
import { analyzeDuplicate } from '../analyzers/duplicate.analyzer.js';
import { analyzeMetadata } from '../analyzers/metadata.analyzer.js';
import { analyzeOCR } from '../analyzers/ocr.analyzer.js';
import { analyzeLicensePlate } from '../analyzers/plate.analyzer.js';
import { analyzeScreenshot } from '../analyzers/screenshot.analyzer.js';
import { analyzeTampering } from '../analyzers/tamper.analyzer.js';
import { analyzeImageWithAI } from './ai.service.js';
import logger from '../utils/logger.js';

/**
 * Unified Analysis Aggregator Service
 * Orchestrates multi-layer image analysis pipeline and generates comprehensive verification report.
 */
export async function processImageAnalysis(imageRecord, prisma) {
  const { id: processingId, filePath, mimeType, originalName } = imageRecord;
  const startTime = Date.now();

  logger.info('Starting image analysis pipeline', { processingId, originalName });

  // 1. Run deterministic structural & metadata analyzers
  const metadataRes = await analyzeMetadata(filePath);
  const blurRes = await analyzeBlur(filePath);
  const brightnessRes = await analyzeBrightness(filePath);
  const duplicateRes = await analyzeDuplicate(filePath, processingId, prisma);
  const ocrRes = await analyzeOCR(filePath);

  // 2. Run dependent domain heuristics
  const plateRes = await analyzeLicensePlate(ocrRes.rawText);
  const screenshotRes = await analyzeScreenshot(metadataRes, originalName);
  const tamperRes = await analyzeTampering(metadataRes);

  // 3. Run AI Vision Analysis (optional / enhanced)
  const aiRes = await analyzeImageWithAI(filePath, mimeType);

  // 4. Calculate Overall Assessment & Quality Score
  const flags = [];
  let score = 100;

  if (blurRes.isBlurry) {
    flags.push('BLURRY_IMAGE');
    score -= 25;
  }
  if (brightnessRes.isLowLight) {
    flags.push('LOW_LIGHT_CONDITION');
    score -= 15;
  }
  if (brightnessRes.isOverexposed) {
    flags.push('OVEREXPOSED_IMAGE');
    score -= 15;
  }
  if (duplicateRes.isDuplicate) {
    flags.push('DUPLICATE_IMAGE');
    score -= 30;
  }
  if (screenshotRes.isScreenshot) {
    flags.push('SCREENSHOT_DETECTED');
    score -= 20;
  }
  if (tamperRes.isTampered) {
    flags.push('SUSPICIOUS_EDITING');
    score -= 25;
  }
  if (!plateRes.hasValidPlate && !aiRes.analysis?.licensePlateText) {
    flags.push('LICENSE_PLATE_NOT_FOUND');
    score -= 15;
  }

  score = Math.max(0, score);

  let recommendation = 'ACCEPT';
  if (score < 50 || flags.includes('DUPLICATE_IMAGE') || flags.includes('SUSPICIOUS_EDITING')) {
    recommendation = 'REJECT';
  } else if (score < 80 || flags.includes('BLURRY_IMAGE') || flags.includes('LICENSE_PLATE_NOT_FOUND')) {
    recommendation = 'REVIEW_REQUIRED';
  }

  const durationMs = Date.now() - startTime;

  const unifiedResult = {
    processingId,
    status: 'completed',
    processedAt: new Date().toISOString(),
    durationMs,
    image: {
      originalName,
      mimeType,
      size: imageRecord.size,
      dimensions: metadataRes.dimensions,
      hashes: {
        sha256: duplicateRes.sha256,
        perceptualHash: duplicateRes.perceptualHash,
      },
    },
    vehicle: {
      licensePlate: plateRes.primaryPlate || aiRes.analysis?.licensePlateText || null,
      licensePlateValid: plateRes.hasValidPlate,
      plateDetails: plateRes.detectedPlates?.[0] || null,
      vehicleType: aiRes.analysis?.vehicleType || 'Unknown',
      makeModelCandidate: aiRes.analysis?.makeModelCandidate || null,
    },
    checks: {
      blur: blurRes,
      brightness: brightnessRes,
      duplicate: duplicateRes,
      metadata: metadataRes,
      ocr: ocrRes,
      licensePlate: plateRes,
      screenshot: screenshotRes,
      tampering: tamperRes,
    },
    aiAnalysis: aiRes,
    overallAssessment: {
      passedVerification: recommendation === 'ACCEPT',
      qualityScore: score,
      recommendation,
      flags,
    },
  };

  logger.info('Completed image analysis pipeline', {
    processingId,
    recommendation,
    score,
    durationMs,
  });

  return unifiedResult;
}

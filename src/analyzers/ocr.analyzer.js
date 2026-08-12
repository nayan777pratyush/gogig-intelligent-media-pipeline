import { createWorker } from 'tesseract.js';

/**
 * OCR Analyzer
 * Performs Optical Character Recognition using Tesseract.js
 */
export async function analyzeOCR(filePath) {
  let worker = null;
  try {
    worker = await createWorker('eng');
    const { data } = await worker.recognize(filePath);
    await worker.terminate();

    const rawText = data.text ? data.text.trim() : '';
    const confidence = data.confidence || 0;
    const words = data.words ? data.words.map((w) => ({ text: w.text, confidence: w.confidence })) : [];

    return {
      analyzer: 'ocr',
      rawText,
      confidence,
      wordCount: words.length,
      sampleWords: words.slice(0, 10),
      message: rawText.length > 0
        ? `Extracted ${words.length} words via OCR (Confidence: ${confidence.toFixed(1)}%)`
        : `No text detected via OCR`,
    };
  } catch (error) {
    if (worker) {
      try { await worker.terminate(); } catch (e) {}
    }
    return {
      analyzer: 'ocr',
      rawText: '',
      confidence: 0,
      error: error.message,
    };
  }
}

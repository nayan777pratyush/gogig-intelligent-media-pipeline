import { extractIndianLicensePlates } from '../utils/plate.utils.js';

/**
 * Indian Vehicle License Plate Analyzer
 * Validates text against standard Indian registration number patterns (e.g. KA01AB1234, MH12DE1415, BH series).
 */
export async function analyzeLicensePlate(ocrText) {
  try {
    const matches = extractIndianLicensePlates(ocrText);
    const hasValidPlate = matches.length > 0;

    return {
      analyzer: 'plate',
      hasValidPlate,
      detectedPlates: matches,
      primaryPlate: hasValidPlate ? matches[0].formattedPlate : null,
      confidence: hasValidPlate ? matches[0].confidence : 0,
      message: hasValidPlate
        ? `Valid Indian license plate detected: ${matches[0].formattedPlate}`
        : `No valid Indian license plate format identified in OCR text`,
    };
  } catch (error) {
    return {
      analyzer: 'plate',
      hasValidPlate: false,
      error: error.message,
    };
  }
}

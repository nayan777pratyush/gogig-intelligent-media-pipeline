import { calculateLaplacianVariance } from '../utils/image.utils.js';

/**
 * Blur Analyzer
 * Evaluates image sharpness using Laplacian variance on normalized grayscale raw pixel data.
 */
export async function analyzeBlur(filePath) {
  try {
    const variance = await calculateLaplacianVariance(filePath);

    let isBlurry = false;
    let qualityRating = 'sharp';

    if (variance < 40) {
      isBlurry = true;
      qualityRating = 'blurry';
    } else if (variance < 100) {
      isBlurry = false;
      qualityRating = 'moderate_sharpness';
    } else {
      isBlurry = false;
      qualityRating = 'sharp';
    }

    return {
      analyzer: 'blur',
      isBlurry,
      laplacianVariance: variance,
      threshold: 40,
      qualityRating,
      confidence: 0.90,
      message: isBlurry
        ? `Image is blurry (Laplacian variance: ${variance} < threshold: 40)`
        : `Image sharpness is acceptable (Laplacian variance: ${variance})`,
    };
  } catch (error) {
    return {
      analyzer: 'blur',
      isBlurry: false,
      laplacianVariance: 0,
      error: error.message,
    };
  }
}

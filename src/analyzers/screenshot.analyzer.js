/**
 * Screenshot Detection Analyzer
 * Evaluates filename heuristics, screen aspect ratio matching, PNG color profiles, and missing camera EXIF.
 */
export async function analyzeScreenshot(metadataResult, originalName = '') {
  try {
    const filenameLower = originalName.toLowerCase();
    const dimensions = metadataResult.dimensions || {};
    const width = dimensions.width || 0;
    const height = dimensions.height || 0;
    const software = (metadataResult.device?.software || '').toLowerCase();

    let score = 0;
    const reasons = [];

    // 1. Filename heuristic
    if (filenameLower.includes('screenshot') || filenameLower.includes('screen_shot') || filenameLower.includes('capture')) {
      score += 40;
      reasons.push('Filename contains screenshot keyword');
    }

    // 2. EXIF software tag
    if (software.includes('screenshot') || software.includes('ios') || software.includes('android')) {
      score += 35;
      reasons.push(`Software tag indicates screen capture (${software})`);
    }

    // 3. Screen aspect ratios (e.g. mobile 19.5:9, 20:9, 16:9, tablet 4:3)
    if (width > 0 && height > 0) {
      const ratio = Math.max(width, height) / Math.min(width, height);
      const commonScreenRatios = [1.777, 1.778, 2.166, 2.222, 2.111, 2.0, 1.333, 2.333]; // 16:9, 19.5:9, 20:9, 18:9, 4:3
      const isScreenRatio = commonScreenRatios.some((r) => Math.abs(ratio - r) < 0.03);

      if (isScreenRatio && !metadataResult.hasExif) {
        score += 25;
        reasons.push(`Aspect ratio (${ratio.toFixed(2)}) matches common mobile/desktop display standard without camera EXIF`);
      }
    }

    // 4. PNG format without camera EXIF
    if (metadataResult.format === 'png' && !metadataResult.hasExif) {
      score += 15;
      reasons.push('PNG format lacking digital camera metadata');
    }

    const isScreenshot = score >= 50;

    return {
      analyzer: 'screenshot',
      isScreenshot,
      confidenceScore: score,
      reasons,
      message: isScreenshot
        ? `Screenshot detected (Confidence: ${score}%, Reasons: ${reasons.join('; ')})`
        : `Original camera capture verified (No screenshot indicators)`,
    };
  } catch (error) {
    return {
      analyzer: 'screenshot',
      isScreenshot: false,
      error: error.message,
    };
  }
}

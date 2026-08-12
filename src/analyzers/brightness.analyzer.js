import sharp from 'sharp';

/**
 * Brightness / Exposure Analyzer
 * Calculates mean luminance and brightness distribution across pixel buffer.
 */
export async function analyzeBrightness(filePath) {
  try {
    const { data, info } = await sharp(filePath)
      .resize({ width: 400, withoutEnlargement: true })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    let totalLuminance = 0;
    let darkPixelCount = 0;
    let brightPixelCount = 0;
    const totalPixels = info.width * info.height;

    for (let i = 0; i < totalPixels; i++) {
      const val = data[i];
      totalLuminance += val;
      if (val < 35) darkPixelCount++;
      if (val > 225) brightPixelCount++;
    }

    const meanLuminance = Math.round((totalLuminance / totalPixels) * 100) / 100;
    const darkRatio = Math.round((darkPixelCount / totalPixels) * 100) / 100;
    const brightRatio = Math.round((brightPixelCount / totalPixels) * 100) / 100;

    let brightnessState = 'normal';
    let isLowLight = false;
    let isOverexposed = false;

    if (meanLuminance < 45 || darkRatio > 0.65) {
      brightnessState = 'low_light';
      isLowLight = true;
    } else if (meanLuminance > 215 || brightRatio > 0.60) {
      brightnessState = 'overexposed';
      isOverexposed = true;
    }

    return {
      analyzer: 'brightness',
      meanLuminance,
      darkRatio,
      brightRatio,
      brightnessState,
      isLowLight,
      isOverexposed,
      confidence: 0.92,
      message: isLowLight
        ? `Low light condition detected (Mean luminance: ${meanLuminance}/255)`
        : isOverexposed
        ? `Overexposed condition detected (Mean luminance: ${meanLuminance}/255)`
        : `Lighting is optimal (Mean luminance: ${meanLuminance}/255)`,
    };
  } catch (error) {
    return {
      analyzer: 'brightness',
      meanLuminance: 0,
      brightnessState: 'unknown',
      error: error.message,
    };
  }
}

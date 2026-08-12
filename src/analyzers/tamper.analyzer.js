/**
 * Image Tampering & Editing Heuristic Analyzer
 * Detects evidence of post-processing, digital modification, or photo editing software signatures.
 */
export async function analyzeTampering(metadataResult) {
  try {
    const software = (metadataResult.device?.software || '').toLowerCase();
    const hasExif = metadataResult.hasExif;

    let isTampered = false;
    let score = 0;
    const indicators = [];

    const editorKeywords = [
      'photoshop', 'gimp', 'canva', 'lightroom', 'snapseed',
      'picsart', 'pixlr', 'adobe', 'vsco', 'paint.net', 'editor'
    ];

    const detectedEditor = editorKeywords.find((kw) => software.includes(kw));
    if (detectedEditor) {
      isTampered = true;
      score += 70;
      indicators.push(`EXIF Software tag specifies photo editing software (${software})`);
    }

    if (!hasExif && metadataResult.format === 'jpeg') {
      score += 20;
      indicators.push('JPEG image lacks camera EXIF header (possible resave or web export)');
    }

    return {
      analyzer: 'tamper',
      isTampered: score >= 50,
      tamperScore: score,
      indicators,
      detectedEditor: detectedEditor || null,
      message: isTampered
        ? `Potential tampering/editing detected (${indicators.join('; ')})`
        : `No explicit tampering signatures identified`,
    };
  } catch (error) {
    return {
      analyzer: 'tamper',
      isTampered: false,
      error: error.message,
    };
  }
}

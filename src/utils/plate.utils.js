// Indian State & Union Territory Codes
export const INDIAN_STATE_CODES = new Set([
  'AN', 'AP', 'AR', 'AS', 'BR', 'CG', 'CH', 'DD', 'DN', 'DL',
  'GA', 'GJ', 'HR', 'HP', 'JK', 'JH', 'KA', 'KL', 'LA', 'LD',
  'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'OR', 'PB', 'PY',
  'RJ', 'SK', 'TN', 'TS', 'TR', 'UK', 'UA', 'UP', 'WB', 'BH'
]);

/**
 * Extract Indian registration numbers from raw OCR text
 */
export function extractIndianLicensePlates(text) {
  if (!text || typeof text !== 'string') return [];

  // Normalize text: remove unnecessary noise, replace common OCR misreadings
  const cleanedText = text
    .toUpperCase()
    .replace(/[O]/g, (match, offset, str) => {
      // If surrounded by digits, 'O' is likely '0'
      const prevChar = str[offset - 1];
      const nextChar = str[offset + 1];
      if ((prevChar && /\d/.test(prevChar)) || (nextChar && /\d/.test(nextChar))) {
        return '0';
      }
      return 'O';
    })
    .replace(/[I|l]/g, '1');

  // Regex patterns:
  // Standard format: KA01AB1234 or KA-01-AB-1234 or KA 01 AB 1234
  const standardPattern = /\b([A-Z]{2})[\s\-]?([0-9]{1,2})[\s\-]?([A-Z]{1,3})[\s\-]?([0-9]{4})\b/g;

  // BH Series format: 22BH1234AA
  const bhPattern = /\b([0-9]{2})[\s\-]?BH[\s\-]?([0-9]{4})[\s\-]?([A-Z]{1,2})\b/g;

  const matches = [];

  // Check standard pattern matches
  let match;
  while ((match = standardPattern.exec(cleanedText)) !== null) {
    const stateCode = match[1];
    if (INDIAN_STATE_CODES.has(stateCode)) {
      const fullPlate = `${match[1]}${match[2].padStart(2, '0')}${match[3]}${match[4]}`;
      matches.push({
        rawMatch: match[0],
        formattedPlate: fullPlate,
        stateCode: match[1],
        districtCode: match[2],
        series: match[3],
        number: match[4],
        type: 'STANDARD',
        confidence: 0.95,
      });
    }
  }

  // Check BH series matches
  while ((match = bhPattern.exec(cleanedText)) !== null) {
    const fullPlate = `${match[1]}BH${match[2]}${match[3]}`;
    matches.push({
      rawMatch: match[0],
      formattedPlate: fullPlate,
      year: match[1],
      number: match[2],
      series: match[3],
      type: 'BH_SERIES',
      confidence: 0.9,
    });
  }

  return matches;
}

/**
 * Validate a specific plate string
 */
export function validateIndianLicensePlate(plateString) {
  if (!plateString) return { isValid: false, reason: 'Empty input' };
  const extracted = extractIndianLicensePlates(plateString);
  if (extracted.length > 0) {
    return {
      isValid: true,
      plateDetails: extracted[0],
    };
  }
  return {
    isValid: false,
    reason: 'Does not match standard Indian registration format (e.g. KA01AB1234)',
  };
}

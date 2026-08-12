import { analyzeBlur } from '../../src/analyzers/blur.analyzer.js';
import { analyzeBrightness } from '../../src/analyzers/brightness.analyzer.js';
import { analyzeScreenshot } from '../../src/analyzers/screenshot.analyzer.js';
import { analyzeLicensePlate } from '../../src/analyzers/plate.analyzer.js';
import { extractIndianLicensePlates, validateIndianLicensePlate } from '../../src/utils/plate.utils.js';
import path from 'path';

describe('Image Analyzers & Utilities Unit Tests', () => {
  const sampleImagePath = path.resolve(process.cwd(), 'sample-images/sample_1.png');

  describe('Indian License Plate Parser', () => {
    it('should parse standard Indian registration numbers', () => {
      const text = 'Vehicle registration number is KA01AB1234 parked near garage';
      const plates = extractIndianLicensePlates(text);
      expect(plates.length).toBe(1);
      expect(plates[0].formattedPlate).toBe('KA01AB1234');
      expect(plates[0].stateCode).toBe('KA');
    });

    it('should parse formatted plates with spaces or hyphens', () => {
      const text = 'MH-12-DE-1415';
      const result = validateIndianLicensePlate(text);
      expect(result.isValid).toBe(true);
      expect(result.plateDetails.formattedPlate).toBe('MH12DE1415');
    });

    it('should reject invalid registration formats', () => {
      const result = validateIndianLicensePlate('INVALID123');
      expect(result.isValid).toBe(false);
    });
  });

  describe('Blur Analyzer', () => {
    it('should calculate Laplacian variance for sample image', async () => {
      const res = await analyzeBlur(sampleImagePath);
      expect(res.analyzer).toBe('blur');
      expect(typeof res.laplacianVariance).toBe('number');
      expect(typeof res.isBlurry).toBe('boolean');
    });
  });

  describe('Brightness Analyzer', () => {
    it('should calculate mean luminance for sample image', async () => {
      const res = await analyzeBrightness(sampleImagePath);
      expect(res.analyzer).toBe('brightness');
      expect(typeof res.meanLuminance).toBe('number');
      expect(res.meanLuminance).toBeGreaterThan(0);
    });
  });

  describe('Screenshot Analyzer', () => {
    it('should flag screenshot keyword in filename', async () => {
      const metadataMock = { dimensions: { width: 1080, height: 2400 }, hasExif: false };
      const res = await analyzeScreenshot(metadataMock, 'Screenshot_2026-08-12.png');
      expect(res.isScreenshot).toBe(true);
      expect(res.confidenceScore).toBeGreaterThanOrEqual(50);
    });
  });
});

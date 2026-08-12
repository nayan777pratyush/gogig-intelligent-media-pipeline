import sharp from 'sharp';
import fs from 'fs';
import crypto from 'crypto';
import { imageHash } from 'image-hash';

/**
 * Get basic metadata & dimensions of an image
 */
export async function getImageMetadata(filePath) {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      space: metadata.space,
      channels: metadata.channels,
      depth: metadata.depth,
      density: metadata.density,
      isProgressive: metadata.isProgressive,
      hasAlpha: metadata.hasProfile || metadata.hasAlpha,
      exif: metadata.exif,
    };
  } catch (error) {
    throw new Error(`Failed to read image metadata: ${error.message}`);
  }
}

/**
 * Calculate exact SHA-256 hash of a file
 */
export async function calculateFileHash(filePath) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => hash.update(data));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', (err) => reject(err));
  });
}

/**
 * Compute perceptual hash (pHash) using image-hash
 */
export async function calculatePerceptualHash(filePath) {
  return new Promise((resolve) => {
    // 16 bits, hex format
    imageHash(filePath, 16, true, (error, data) => {
      if (error) {
        // Fallback: return null if perceptual hashing fails
        resolve(null);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * Calculate Hamming distance between two hex hashes of equal length
 */
export function calculateHammingDistance(hash1, hash2) {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) return 999;
  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    const val = parseInt(hash1[i], 16) ^ parseInt(hash2[i], 16);
    let n = val;
    while (n > 0) {
      distance += n & 1;
      n >>= 1;
    }
  }
  return distance;
}

/**
 * Laplacian variance calculation using Sharp to estimate image blur / sharpness
 */
export async function calculateLaplacianVariance(filePath) {
  try {
    // Convert to grayscale raw pixel buffer
    const { data, info } = await sharp(filePath)
      .resize({ width: 500, withoutEnlargement: true }) // Normalize size for consistent variance scale
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const width = info.width;
    const height = info.height;

    // Apply 3x3 Laplacian convolution kernel:
    //  0  1  0
    //  1 -4  1
    //  0  1  0
    let sum = 0;
    let sumSq = 0;
    let count = 0;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        const center = data[idx];
        const top = data[(y - 1) * width + x];
        const bottom = data[(y + 1) * width + x];
        const left = data[y * width + (x - 1)];
        const right = data[y * width + (x + 1)];

        const laplacian = top + bottom + left + right - 4 * center;

        sum += laplacian;
        sumSq += laplacian * laplacian;
        count++;
      }
    }

    if (count === 0) return 0;
    const mean = sum / count;
    const variance = sumSq / count - mean * mean;

    return Math.round(variance * 100) / 100;
  } catch (error) {
    return 0;
  }
}

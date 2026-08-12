import { calculateFileHash, calculatePerceptualHash, calculateHammingDistance } from '../utils/image.utils.js';

/**
 * Duplicate Analyzer
 * Checks for exact SHA-256 duplicate matches or visual similarity via perceptual hashing (pHash).
 */
export async function analyzeDuplicate(filePath, currentImageId, prisma) {
  try {
    const sha256 = await calculateFileHash(filePath);
    const pHash = await calculatePerceptualHash(filePath);

    let isDuplicate = false;
    let duplicateType = null;
    let matchingImageId = null;
    let minHammingDistance = 999;

    if (prisma) {
      // 1. Check for exact SHA-256 hash match
      const exactMatch = await prisma.image.findFirst({
        where: {
          hash: sha256,
          id: currentImageId ? { not: currentImageId } : undefined,
        },
      });

      if (exactMatch) {
        isDuplicate = true;
        duplicateType = 'EXACT_HASH_MATCH';
        matchingImageId = exactMatch.id;
      } else if (pHash) {
        // 2. Check for perceptual hash similarity among recent images
        const recentImages = await prisma.image.findMany({
          where: {
            perceptualHash: { not: null },
            id: currentImageId ? { not: currentImageId } : undefined,
          },
          take: 100,
          select: { id: true, perceptualHash: true },
        });

        for (const img of recentImages) {
          if (img.perceptualHash) {
            const dist = calculateHammingDistance(pHash, img.perceptualHash);
            if (dist < minHammingDistance) {
              minHammingDistance = dist;
            }
            if (dist <= 8) { // Threshold for visual similarity
              isDuplicate = true;
              duplicateType = 'PERCEPTUAL_SIMILARITY';
              matchingImageId = img.id;
              break;
            }
          }
        }
      }
    }

    return {
      analyzer: 'duplicate',
      sha256,
      perceptualHash: pHash,
      isDuplicate,
      duplicateType,
      matchingImageId,
      minHammingDistance: minHammingDistance === 999 ? null : minHammingDistance,
      message: isDuplicate
        ? `Duplicate image detected (${duplicateType}, matching ID: ${matchingImageId})`
        : `Unique image (SHA-256: ${sha256.substring(0, 12)}...)`,
    };
  } catch (error) {
    return {
      analyzer: 'duplicate',
      sha256: null,
      perceptualHash: null,
      isDuplicate: false,
      error: error.message,
    };
  }
}

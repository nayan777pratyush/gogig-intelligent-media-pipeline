import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env.js';

/**
 * Storage Service for file persistence
 */
export class StorageService {
  constructor() {
    this.uploadDir = path.resolve(process.cwd(), config.uploadDir);
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Save uploaded buffer to disk with unique file name
   */
  async saveFile(fileBuffer, originalName, mimeType) {
    const ext = path.extname(originalName) || this.getExtensionFromMime(mimeType);
    const storedName = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadDir, storedName);

    await fs.promises.writeFile(filePath, fileBuffer);

    return {
      storedName,
      filePath,
      size: fileBuffer.length,
    };
  }

  /**
   * Get file extension from MIME type
   */
  getExtensionFromMime(mimeType) {
    switch (mimeType) {
      case 'image/jpeg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'image/webp':
        return '.webp';
      default:
        return '.img';
    }
  }

  /**
   * Remove file from disk
   */
  async deleteFile(filePath) {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }
  }
}

export default new StorageService();

import sharp from 'sharp';
import exifReader from 'exif-reader';

/**
 * EXIF Metadata Analyzer
 * Extracts EXIF camera information, device model, timestamp, GPS, and software tags.
 */
export async function analyzeMetadata(filePath) {
  try {
    const meta = await sharp(filePath).metadata();

    let exifData = null;
    let cameraMake = null;
    let cameraModel = null;
    let software = null;
    let createDate = null;
    let gps = null;

    if (meta.exif) {
      try {
        exifData = exifReader(meta.exif);
        if (exifData.image) {
          cameraMake = exifData.image.Make || null;
          cameraModel = exifData.image.Model || null;
          software = exifData.image.Software || null;
        }
        if (exifData.exif) {
          createDate = exifData.exif.DateTimeOriginal || exifData.exif.CreateDate || null;
        }
        if (exifData.gps) {
          gps = {
            latitude: exifData.gps.GPSLatitude || null,
            longitude: exifData.gps.GPSLongitude || null,
          };
        }
      } catch (exifErr) {
        // Safe fallback if EXIF buffer parsing encounters non-standard tags
      }
    }

    const hasExif = !!(exifData && (cameraMake || cameraModel || createDate));

    return {
      analyzer: 'metadata',
      hasExif,
      format: meta.format,
      dimensions: {
        width: meta.width,
        height: meta.height,
        space: meta.space,
        channels: meta.channels,
        density: meta.density,
      },
      device: {
        make: cameraMake,
        model: cameraModel,
        software: software,
      },
      createDate: createDate ? createDate.toISOString() : null,
      gps: gps,
      message: hasExif
        ? `EXIF data present (Camera: ${cameraMake || 'Unknown'} ${cameraModel || 'Unknown'})`
        : `No camera EXIF metadata present`,
    };
  } catch (error) {
    return {
      analyzer: 'metadata',
      hasExif: false,
      error: error.message,
    };
  }
}

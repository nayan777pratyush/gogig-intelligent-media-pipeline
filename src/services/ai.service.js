import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * AI Vision Analysis Service using Google Gemini API
 */
export async function analyzeImageWithAI(filePath, mimeType) {
  if (!config.geminiApiKey) {
    logger.info('Gemini API key not configured. Skipping AI Vision step.');
    return {
      enabled: false,
      aiProcessed: false,
      reason: 'GEMINI_API_KEY environment variable not set',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const imageBuffer = fs.readFileSync(filePath);
    const base64Data = imageBuffer.toString('base64');

    const prompt = `Analyze this vehicle image in detail for an automated vehicle registration & verification pipeline. 
Return ONLY a valid, strict JSON object (no markdown, no backticks, no markdown code blocks) with the following structure:
{
  "vehicleType": "Auto-Rickshaw | Car | Two-Wheeler | Truck | Commercial Vehicle | Non-Vehicle | Unknown",
  "makeModelCandidate": "e.g. Bajaj RE 4S, Piaggio Ape, Maruti Suzuki Swift, etc.",
  "licensePlateText": "Extracted plate text if visible, or null",
  "plateLegibility": "Clear | Partially Obscured | Unreadable | Not Visible",
  "overallCondition": "Good | Minor Damage | Major Damage | Dirty | Unclear",
  "isPhotoOfPhoto": false,
  "confidenceScore": 0.95,
  "keyObservations": ["Observation 1", "Observation 2"]
}`;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType || 'image/png',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const textOutput = response.text() || '';

    // Clean JSON string
    const cleanJsonText = textOutput.replace(/```json/gi, '').replace(/```/g, '').trim();

    let structuredOutput = null;
    try {
      structuredOutput = JSON.parse(cleanJsonText);
    } catch (parseError) {
      logger.warn('Failed to parse Gemini JSON output, saving raw text:', { rawText: textOutput });
      structuredOutput = { rawText: textOutput };
    }

    return {
      enabled: true,
      aiProcessed: true,
      modelUsed: 'gemini-2.5-flash',
      analysis: structuredOutput,
    };
  } catch (error) {
    logger.error('Gemini Vision AI Analysis Error:', { error: error.message });
    return {
      enabled: true,
      aiProcessed: false,
      error: error.message,
      reason: 'AI service request failed',
    };
  }
}

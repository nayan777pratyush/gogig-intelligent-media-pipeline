import path from 'path';
import fs from 'fs';
import { processImageAnalysis } from '../src/services/analysis.service.js';

async function main() {
  console.log('Processing sample vehicle images through analysis pipeline...\n');

  const sampleDir = path.resolve(process.cwd(), 'sample-images');
  const samples = [
    { id: 'sample-001-auto-rickshaw-front', filename: 'sample_1.png', mimeType: 'image/png' },
    { id: 'sample-002-auto-rickshaw-side', filename: 'sample_2.png', mimeType: 'image/png' },
    { id: 'sample-003-auto-rickshaw-rear', filename: 'sample_3.png', mimeType: 'image/png' },
  ];

  const results = [];

  for (const sample of samples) {
    const filePath = path.join(sampleDir, sample.filename);
    if (!fs.existsSync(filePath)) {
      console.error(`Sample file not found: ${filePath}`);
      continue;
    }

    const stats = fs.statSync(filePath);
    const mockRecord = {
      id: sample.id,
      filePath,
      originalName: sample.filename,
      mimeType: sample.mimeType,
      size: stats.size,
    };

    console.log(`Processing [${sample.filename}] (${(stats.size / 1024 / 1024).toFixed(2)} MB)...`);
    const startTime = Date.now();
    const result = await processImageAnalysis(mockRecord, null);
    const duration = Date.now() - startTime;

    console.log(`✓ Completed [${sample.filename}] in ${duration}ms. Recommendation: ${result.overallAssessment.recommendation}`);
    results.push(result);
  }

  // Generate markdown report
  let markdown = `# Sample Vehicle Image Processing Results\n\n`;
  markdown += `This document contains real analysis results produced by running the 3 supplied sample vehicle/auto-rickshaw images through our Intelligent Media Processing Pipeline.\n\n`;

  results.forEach((res, index) => {
    markdown += `## Sample ${index + 1}: \`${res.image.originalName}\`\n\n`;
    markdown += `- **Processing ID**: \`${res.processingId}\`
- **Quality Score**: \`${res.overallAssessment.qualityScore}/100\`
- **Recommendation**: \`${res.overallAssessment.recommendation}\`
- **Passed Verification**: \`${res.overallAssessment.passedVerification}\`
- **Detected Vehicle Type**: \`${res.vehicle.vehicleType}\`
- **License Plate**: \`${res.vehicle.licensePlate || 'Not Detected'}\`
- **Flags Raised**: ${res.overallAssessment.flags.length > 0 ? res.overallAssessment.flags.map(f => `\`${f}\``).join(', ') : 'None'}

### Complete Analysis JSON Output

\`\`\`json
${JSON.stringify(res, null, 2)}
\`\`\`

---

`;
  });

  const docsDir = path.resolve(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const outputPath = path.join(docsDir, 'sample-results.md');
  fs.writeFileSync(outputPath, markdown, 'utf-8');
  console.log(`\nSuccessfully written sample results to: ${outputPath}`);
}

main().catch((err) => {
  console.error('Fatal error during sample processing:', err);
  process.exit(1);
});

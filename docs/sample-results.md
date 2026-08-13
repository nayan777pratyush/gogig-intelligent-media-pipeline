# Sample API Results

The authoritative sample-processing evidence is maintained in:

[Production Test Results](./production-test-results.md)

The production evidence contains complete API requests and responses for all
three supplied sample images, including:

- upload response
- processing ID
- asynchronous status polling
- final analysis result
- OCR
- blur detection
- brightness analysis
- duplicate detection
- metadata analysis
- screenshot detection
- tampering detection
- Indian license plate analysis
- Gemini Vision analysis
- overall verification assessment

It also includes production edge-case tests for:

- missing image
- invalid file type
- non-existent processing ID for status
- non-existent processing ID for result

The older local deterministic analyzer outputs are not treated as the
authoritative production results.
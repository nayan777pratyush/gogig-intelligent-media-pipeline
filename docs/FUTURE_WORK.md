GoGig Intelligent Media Pipeline --- Future Work

Overview

The next stage of GoGig is to improve the accuracy, reliability, and
explainability of vehicle verification, especially license-plate
recognition, tampering detection, image-quality analysis, and the final
verification decision.

The current system already combines deterministic analyzers with
optional Gemini Vision AI. Future work should strengthen the
ML/computer-vision layer while keeping deterministic checks as
supporting evidence.

1. Advanced License Plate Detection & Recognition

The current pipeline uses OCR and Indian license-plate format
validation. Future versions can introduce a dedicated license-plate
detection and recognition pipeline.

Planned improvements:

Train or integrate a dedicated license-plate detection model.

Detect the exact plate bounding box before OCR.

Crop and preprocess the plate before recognition.

Apply perspective correction for angled plates.

Improve recognition under low lighting, blur, glare, occlusion, and
distant views.

Use specialized license-plate OCR rather than relying only on
general OCR.

Use multiple OCR passes and confidence-based voting.

Handle common OCR character confusions such as 0/O, 1/I, 5/S,
and 8/B.

Expand Indian registration-format and state-code validation.

Produce plate confidence and preserve the evidence behind the
result.

Vehicle Image
     |
     v
Plate Detector
     |
     v
Plate Crop + Perspective Correction
     |
     v
Image Enhancement
     |
     v
Specialized OCR
     |
     v
Indian Format / State Validation
     |
     v
Confidence + Evidence Fusion

2. Better OCR Accuracy

Future OCR improvements:

Upscaling before OCR.

Adaptive thresholding.

Contrast enhancement.

Noise removal and sharpening.

Perspective correction.

Multiple preprocessing configurations.

Ensemble/voting between OCR results.

Character-level confidence scoring.

Plate-region OCR instead of full-image OCR.

A single OCR result should not automatically be treated as ground truth.

3. ML-Based Vehicle Detection & Classification

Future versions can introduce dedicated computer-vision models to:

Detect whether a vehicle is present.

Detect the vehicle bounding box.

Classify vehicle type such as auto-rickshaw, car, truck, bus, or
motorcycle.

Detect multiple vehicles.

Estimate make/model where sufficient visual evidence exists.

Return calibrated confidence scores.

Reject irrelevant images before expensive downstream analysis.

A YOLO-family object-detection model can be evaluated for this stage.

4. Improved Tampering Detection

The current pipeline uses metadata and editing-software heuristics.
Future work should combine these with image-forensics and ML.

Metadata signals

Continue checking EXIF information, camera make/model, timestamps, GPS,
software tags, and missing/inconsistent camera metadata.

Image-forensics signals

Investigate:

Error Level Analysis (ELA).

JPEG quantization inconsistencies.

Compression artifacts.

Noise-pattern inconsistencies.

Edge inconsistencies.

Copy-move detection.

Image splicing detection.

Resampling/interpolation artifacts.

Inconsistent lighting and shadows.

ML-based tampering detection

A future model can classify:

Original
Potentially Edited
Strong Tampering Evidence

Where possible, the model should provide both confidence and suspicious
regions/features.

5. Improved Image Quality Detection

Extend blur and brightness checks with ML-assisted quality assessment:

Motion-blur detection.

Defocus-blur detection.

Low-light detection.

Overexposure detection.

Glare/reflection detection.

Compression-quality estimation.

Resolution adequacy.

Vehicle-region visibility.

License-plate-region sharpness.

Occlusion detection.

The vehicle and plate regions should be evaluated separately instead of
relying only on one global quality score.

6. Better Duplicate and Near-Duplicate Detection

The current exact-hash and perceptual-hash approach can be extended
with:

Stronger image embeddings.

Crop-aware similarity.

Detection of resized/recompressed copies.

Detection of screenshots of previous submissions.

Vehicle/plate-region similarity.

Stored similarity scores for auditability.

7. Screenshot and Re-Photographed Image Detection

Future detection can include:

UI/display artifact detection.

Moiré patterns.

Screen-refresh artifacts.

Pixel-pattern analysis.

Unusual compression patterns.

Border/UI detection.

Screen-capture metadata.

ML-based screenshot classification.

The system should distinguish original camera captures, screenshots, and
re-photographed screens.

8. Multi-Signal Verification / Evidence Fusion

The final decision should not depend on one analyzer.

Image Quality
OCR
License Plate Model
Duplicate Detection
Tamper Detection
Screenshot Detection
Vehicle Detection
Vision AI
        |
        v
Evidence Fusion
        |
        v
Confidence / Risk Score
        |
   +----+----+
   |    |    |
ACCEPT REVIEW REJECT

A future scoring model can learn how much each signal should contribute
instead of relying only on manually selected weights.

9. Confidence Calibration

Future work should include:

Confidence calibration.

Threshold tuning using validation data.

Precision/recall analysis.

False-positive analysis.

False-negative analysis.

Separate thresholds for ACCEPT, REVIEW_REQUIRED, and REJECT.

Human-review threshold optimization.

The objective is reliable verification, not simply maximizing
acceptance.

10. Dataset Creation & Model Evaluation

A strong ML layer requires representative labeled data.

Vehicle labels

Vehicle type.

Make/model where applicable.

Vehicle bounding box.

License-plate labels

Plate bounding box.

Plate text.

Visibility.

Orientation.

Confidence.

Image-quality labels

Sharp.

Blurry.

Low-light.

Overexposed.

Occluded.

Integrity labels

Original.

Edited.

Screenshot.

Re-photographed.

Recompressed.

Tampered.

The dataset should contain difficult real-world examples, not only clean
images.

11. Evaluation Metrics

License plate detection

Precision.

Recall.

mAP / IoU.

OCR

Character accuracy.

Exact plate-match accuracy.

Character Error Rate.

Plate Error Rate.

Vehicle classification

Accuracy.

Precision.

Recall.

F1-score.

Confusion matrix.

Tampering detection

Precision.

Recall.

F1-score.

ROC-AUC.

False-positive rate.

False-negative rate.

Overall verification

Acceptance accuracy.

False acceptance rate.

False rejection rate.

Review rate.

End-to-end verification accuracy.

12. Human Review Feedback Loop

REVIEW_REQUIRED cases can become valuable training data:

Automated Verification
        |
        v
REVIEW_REQUIRED
        |
        v
Human Review
        |
        v
Correct Decision
        |
        v
Labeled Feedback
        |
        v
Dataset Improvement
        |
        v
Model Retraining

This creates a path for continuous improvement using real failure cases.

13. Explainable Final Decision Engine

A future result should expose not only the decision but also why it was
reached.

Example:

{
  "recommendation": "REVIEW_REQUIRED",
  "confidence": 0.87,
  "reasons": [
    "License plate OCR confidence is low",
    "OCR and AI plate evidence disagree",
    "Possible editing artifacts detected"
  ],
  "evidence": {
    "licensePlate": {
      "text": "MH12DE1415",
      "confidence": 0.72
    },
    "tampering": {
      "score": 0.81
    }
  }
}

This makes the pipeline easier to audit and helps operators understand
ACCEPT, REVIEW_REQUIRED, and REJECT decisions.

14. Hybrid / Ensemble AI Architecture

Future versions can use specialized models for specialized tasks:

Vehicle Image
     |
     +--> Vehicle Detector --> Vehicle Class
     |
     +--> Plate Detector ----> Plate OCR
     |
     +--> Tamper Model ------> Tamper Score
     |
     +--> Quality Model -----> Quality Score
     |
     +--> Vision AI ---------> Semantic Analysis
                    |
                    v
             Evidence Fusion
                    |
                    v
              Decision Engine
                    |
             +------+------+ 
             |      |      |
          ACCEPT  REVIEW  REJECT

Gemini Vision can remain an additional semantic signal rather than
becoming the single source of truth.

15. Production Reliability Improvements

Future infrastructure work:

Replace local disk uploads with object storage such as S3/R2.

Worker auto-scaling based on Redis queue depth.

Stronger retry/dead-letter handling.

Rate limiting.

Authentication and authorization.

Better observability and metrics.

Structured audit logs.

Model/version tracking.

Dataset/model version tracking.

Monitoring AI latency and failures.

Monitoring verification accuracy over time.

16. Recommended Development Order

Phase 1 --- Improve deterministic accuracy

Improve OCR preprocessing.

Improve Indian license-plate validation.

Improve image-quality thresholds.

Improve tamper heuristics.

Improve near-duplicate detection.

Phase 2 --- Dedicated computer vision

License-plate detector.

Specialized plate OCR.

Vehicle detector/classifier.

Screenshot/re-photographed-image classifier.

Phase 3 --- ML tampering detection

Build a labeled tampering dataset.

Train and evaluate a tampering classifier.

Add region-level manipulation detection.

Combine forensic and ML evidence.

Phase 4 --- Evidence fusion

Combine deterministic and ML signals.

Calibrate confidence.

Tune ACCEPT / REVIEW_REQUIRED / REJECT thresholds.

Add explainable reasons.

Validate against a held-out real-world dataset.

Phase 5 --- Continuous improvement

Capture human-review outcomes.

Add difficult cases to the dataset.

Retrain models periodically.

Monitor production metrics.

Compare model versions using the same evaluation set.

Final Goal

The long-term goal is to evolve GoGig from a collection of
image-analysis checks into a robust, explainable, ML-assisted vehicle
verification platform.

The desired system should:

Accurately identify vehicles.

Reliably detect and read license plates.

Distinguish genuine images from screenshots and manipulated images.

Detect tampering with fewer false positives and false negatives.

Handle difficult lighting, blur, angle, and occlusion conditions.

Combine multiple independent evidence sources.

Provide calibrated confidence scores.

Explain why an image was accepted, rejected, or sent for review.

Continue improving from real-world reviewed cases.

The deterministic pipeline remains the foundation, while specialized ML
models are introduced where they provide measurable improvements in
accuracy and verification quality.
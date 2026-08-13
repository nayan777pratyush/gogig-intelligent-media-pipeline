import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  LoaderCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  ScanSearch,
  Car,
  FileText,
  Copy,
  Sun,
  Camera,
  Fingerprint,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import "./App.css";

const API_BASE = "https://gogig-api.onrender.com";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;

    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(selectedFile.type)) {
      setError("Please select a JPEG, PNG, or WebP image.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("Image must be smaller than 10 MB.");
      return;
    }

    setError("");
    setResult(null);
    setProcessingId(null);
    setStatus("ready");
    setFile(selectedFile);

    if (preview) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files?.[0]);
  };

  const reset = () => {
    if (preview) URL.revokeObjectURL(preview);

    setFile(null);
    setPreview("");
    setProcessingId(null);
    setStatus("idle");
    setResult(null);
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const uploadImage = async () => {
    if (!file) return;

    setError("");
    setResult(null);
    setStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_BASE}/api/v1/images`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data?.error?.message || "Image upload failed.");
      }

      setProcessingId(data.data.processingId);
      setStatus("processing");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!processingId || status !== "processing") return;

    let cancelled = false;

    const poll = async () => {
      try {
        const response = await fetch(
          `${API_BASE}/api/v1/images/${processingId}/status`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data?.error?.message || "Unable to check status.");
        }

        const currentStatus = data.data.status;

        if (cancelled) return;

        if (currentStatus === "completed") {
          const resultResponse = await fetch(
            `${API_BASE}/api/v1/images/${processingId}/result`
          );

          const resultData = await resultResponse.json();

          if (!resultResponse.ok || !resultData.success) {
            throw new Error(
              resultData?.error?.message || "Unable to retrieve result."
            );
          }

          setResult(resultData.data);
          setStatus("completed");
          return;
        }

        if (currentStatus === "failed") {
          setError(
            data.data.failureReason || "Image processing failed."
          );
          setStatus("error");
          return;
        }

        setTimeout(poll, 2000);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to process image.");
          setStatus("error");
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [processingId, status]);

  const assessment = result?.overallAssessment;
  const vehicle = result?.vehicle;
  const checks = result?.checks;
  const ai = result?.aiAnalysis;

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={21} />
          </div>

          <div>
            <h1>GoGig</h1>
            <span>Intelligent Media Pipeline</span>
          </div>
        </div>

        <div className="header-status">
          <span className="status-dot" />
          Production API
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">AI-POWERED IMAGE VERIFICATION</p>

            <h2>
              Analyze vehicle images
              <br />
              <span>with confidence.</span>
            </h2>

            <p className="hero-text">
              Upload an image and let the production pipeline perform OCR,
              quality checks, duplicate detection, tampering analysis,
              vehicle identification and AI-powered inspection.
            </p>
          </div>
        </section>

        <section className="upload-card">
          {!file ? (
            <div
              className={`drop-zone ${dragging ? "dragging" : ""}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <div className="upload-icon">
                <Upload size={30} />
              </div>

              <h3>Drop your vehicle image here</h3>

              <p>
                or <span>browse from your computer</span>
              </p>

              <small>JPEG, PNG or WebP · Maximum 10 MB</small>

              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={(event) =>
                  selectFile(event.target.files?.[0])
                }
              />
            </div>
          ) : (
            <div className="selected-file">
              <div className="preview-wrapper">
                <img src={preview} alt="Selected vehicle" />
              </div>

              <div className="file-info">
                <div className="file-heading">
                  <ImageIcon size={20} />
                  <div>
                    <h3>{file.name}</h3>
                    <p>{formatBytes(file.size)}</p>
                  </div>
                </div>

                {status === "ready" && (
                  <button className="primary-button" onClick={uploadImage}>
                    <ScanSearch size={18} />
                    Analyze Image
                  </button>
                )}

                {(status === "uploading" || status === "processing") && (
                  <div className="processing-box">
                    <LoaderCircle className="spin" size={20} />

                    <div>
                      <strong>
                        {status === "uploading"
                          ? "Uploading image..."
                          : "Processing image..."}
                      </strong>

                      <span>
                        {status === "processing"
                          ? "Running verification pipeline"
                          : "Sending image to production API"}
                      </span>
                    </div>
                  </div>
                )}

                {status === "completed" && (
                  <div className="success-box">
                    <CheckCircle2 size={20} />
                    Analysis completed successfully.
                  </div>
                )}

                <button className="secondary-button" onClick={reset}>
                  <RotateCcw size={16} />
                  Choose another image
                </button>
              </div>
            </div>
          )}
        </section>

        {error && (
          <div className="error-banner">
            <XCircle size={20} />
            <div>
              <strong>Processing error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {status === "processing" && (
          <section className="pipeline-card">
            <div className="pipeline-header">
              <div>
                <p className="eyebrow">LIVE PIPELINE</p>
                <h3>Analyzing your image</h3>
              </div>

              <LoaderCircle className="spin" size={24} />
            </div>

            <div className="pipeline-steps">
              <PipelineStep
                icon={<Upload size={18} />}
                label="Upload"
                active
              />

              <PipelineLine />

              <PipelineStep
                icon={<Fingerprint size={18} />}
                label="Validation"
                active
              />

              <PipelineLine />

              <PipelineStep
                icon={<ScanSearch size={18} />}
                label="Analysis"
                active
              />

              <PipelineLine />

              <PipelineStep
                icon={<Sparkles size={18} />}
                label="AI Vision"
                active
              />
            </div>

            <p className="processing-id">
              Processing ID: <code>{processingId}</code>
            </p>
          </section>
        )}

        {result && (
          <section className="results">
            <div className="results-heading">
              <div>
                <p className="eyebrow">ANALYSIS COMPLETE</p>
                <h2>Verification results</h2>
              </div>

              <div
                className={`recommendation ${
                  assessment?.recommendation?.toLowerCase() || ""
                }`}
              >
                {assessment?.recommendation === "ACCEPT" ? (
                  <CheckCircle2 size={18} />
                ) : assessment?.recommendation === "REJECT" ? (
                  <XCircle size={18} />
                ) : (
                  <AlertTriangle size={18} />
                )}

                {assessment?.recommendation || "REVIEW"}
              </div>
            </div>

            <div className="overview-grid">
              <ResultCard
                icon={<Car size={21} />}
                title="Vehicle"
                value={vehicle?.vehicleType || "Unknown"}
                subtitle={vehicle?.makeModelCandidate || "No make/model detected"}
              />

              <ResultCard
                icon={<FileText size={21} />}
                title="License Plate"
                value={vehicle?.licensePlate || "Not detected"}
                subtitle={
                  vehicle?.licensePlateValid
                    ? "Valid Indian format"
                    : "Not validated"
                }
              />

              <ResultCard
                icon={<ShieldCheck size={21} />}
                title="Quality Score"
                value={`${assessment?.qualityScore ?? 0}/100`}
                subtitle={
                  assessment?.passedVerification
                    ? "Verification passed"
                    : "Verification requires review"
                }
              />

              <ResultCard
                icon={<Sparkles size={21} />}
                title="AI Confidence"
                value={
                  ai?.analysis?.confidenceScore
                    ? `${Math.round(ai.analysis.confidenceScore * 100)}%`
                    : "N/A"
                }
                subtitle={ai?.modelUsed || "AI unavailable"}
              />
            </div>

            <div className="result-grid">
              <div className="result-panel">
                <PanelTitle
                  icon={<ScanSearch size={19} />}
                  title="Image Checks"
                />

                <CheckRow
                  icon={<FileText size={17} />}
                  title="OCR"
                  value={
                    checks?.ocr
                      ? `${checks.ocr.wordCount} words · ${checks.ocr.confidence}% confidence`
                      : "Unavailable"
                  }
                  state={checks?.ocr ? "normal" : "warning"}
                />

                <CheckRow
                  icon={<ScanSearch size={17} />}
                  title="Blur"
                  value={
                    checks?.blur
                      ? `${checks.blur.qualityRating} · variance ${checks.blur.laplacianVariance}`
                      : "Unavailable"
                  }
                  state={
                    checks?.blur?.isBlurry ? "danger" : "normal"
                  }
                />

                <CheckRow
                  icon={<Copy size={17} />}
                  title="Duplicate"
                  value={
                    checks?.duplicate?.isDuplicate
                      ? "Duplicate image detected"
                      : "Unique image"
                  }
                  state={
                    checks?.duplicate?.isDuplicate
                      ? "danger"
                      : "normal"
                  }
                />

                <CheckRow
                  icon={<ShieldCheck size={17} />}
                  title="Tampering"
                  value={
                    checks?.tampering?.isTampered
                      ? "Possible tampering detected"
                      : "No explicit signatures"
                  }
                  state={
                    checks?.tampering?.isTampered
                      ? "danger"
                      : "normal"
                  }
                />

                <CheckRow
                  icon={<Sun size={17} />}
                  title="Brightness"
                  value={
                    checks?.brightness?.brightnessState || "Unknown"
                  }
                  state={
                    checks?.brightness?.isLowLight ||
                    checks?.brightness?.isOverexposed
                      ? "warning"
                      : "normal"
                  }
                />

                <CheckRow
                  icon={<Camera size={17} />}
                  title="Screenshot"
                  value={
                    checks?.screenshot?.isScreenshot
                      ? "Screenshot detected"
                      : "Not detected"
                  }
                  state={
                    checks?.screenshot?.isScreenshot
                      ? "warning"
                      : "normal"
                  }
                />
              </div>

              <div className="result-panel">
                <PanelTitle
                  icon={<Sparkles size={19} />}
                  title="AI Vehicle Analysis"
                />

                {ai?.analysis ? (
                  <>
                    <div className="ai-stat">
                      <span>Vehicle type</span>
                      <strong>{ai.analysis.vehicleType || "Unknown"}</strong>
                    </div>

                    <div className="ai-stat">
                      <span>Make / model</span>
                      <strong>
                        {ai.analysis.makeModelCandidate || "Unknown"}
                      </strong>
                    </div>

                    <div className="ai-stat">
                      <span>Plate legibility</span>
                      <strong>
                        {ai.analysis.plateLegibility || "Unknown"}
                      </strong>
                    </div>

                    <div className="ai-stat">
                      <span>Overall condition</span>
                      <strong>
                        {ai.analysis.overallCondition || "Unknown"}
                      </strong>
                    </div>

                    <div className="observations">
                      <h4>Key observations</h4>

                      <ul>
                        {(ai.analysis.keyObservations || []).map(
                          (observation, index) => (
                            <li key={index}>{observation}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="empty-state">
                    <AlertTriangle size={20} />
                    AI analysis was unavailable for this image.
                  </div>
                )}
              </div>
            </div>

            <div className="result-panel full-panel">
              <PanelTitle
                icon={<Fingerprint size={19} />}
                title="Technical Image Details"
              />

              <div className="technical-grid">
                <TechnicalItem
                  label="Original filename"
                  value={result.image?.originalName}
                />

                <TechnicalItem
                  label="MIME type"
                  value={result.image?.mimeType}
                />

                <TechnicalItem
                  label="Dimensions"
                  value={
                    result.image?.dimensions
                      ? `${result.image.dimensions.width} × ${result.image.dimensions.height}`
                      : "Unknown"
                  }
                />

                <TechnicalItem
                  label="SHA-256"
                  value={result.image?.hashes?.sha256}
                  mono
                />

                <TechnicalItem
                  label="Perceptual hash"
                  value={result.image?.hashes?.perceptualHash}
                  mono
                />

                <TechnicalItem
                  label="EXIF metadata"
                  value={
                    checks?.metadata?.hasExif
                      ? "Present"
                      : "Not present"
                  }
                />
              </div>
            </div>

            {assessment?.flags?.length > 0 && (
              <div className="flags">
                <AlertTriangle size={19} />

                <div>
                  <strong>Verification flags</strong>

                  <div className="flag-list">
                    {assessment.flags.map((flag) => (
                      <span key={flag}>{flag}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer>
        <span>GoGig Intelligent Media Pipeline</span>
        <span>Production API · Render</span>
      </footer>
    </div>
  );
}

function PipelineStep({ icon, label, active }) {
  return (
    <div className={`pipeline-step ${active ? "active" : ""}`}>
      <div>{icon}</div>
      <span>{label}</span>
    </div>
  );
}

function PipelineLine() {
  return <div className="pipeline-line" />;
}

function ResultCard({ icon, title, value, subtitle }) {
  return (
    <div className="result-card">
      <div className="result-card-icon">{icon}</div>
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{subtitle}</small>
    </div>
  );
}

function PanelTitle({ icon, title }) {
  return (
    <div className="panel-title">
      <div>{icon}</div>
      <h3>{title}</h3>
    </div>
  );
}

function CheckRow({ icon, title, value, state }) {
  return (
    <div className="check-row">
      <div className="check-icon">{icon}</div>

      <div className="check-content">
        <strong>{title}</strong>
        <span>{value}</span>
      </div>

      <div className={`check-state ${state}`} />
    </div>
  );
}

function TechnicalItem({ label, value, mono = false }) {
  return (
    <div className="technical-item">
      <span>{label}</span>
      <strong className={mono ? "mono" : ""}>{value || "N/A"}</strong>
    </div>
  );
}

function formatBytes(bytes) {
  if (!bytes) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${units[index]}`;
}

export default App;
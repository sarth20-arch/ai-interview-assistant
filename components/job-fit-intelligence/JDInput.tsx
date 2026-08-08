"use client";

import { useState } from "react";
import JobFitDashboard from "./JobFitDashboard";

interface AnalysisResult {
  summary: string;
  overallMatch: number;
  atsScore: number;
  recruiterDecision: string;
}

export default function JDInput() {
  const [jdText, setJdText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJdChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJdText(e.target.value);
    if (error) setError("");
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setResumeFile(e.target.files?.[0] ?? null);
  };

  const handleAnalyze = async () => {
    if (!jdText.trim()) {
      setError("Please paste a Business Analyst Job Description.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const formData = new FormData();

      formData.append("jobDescription", jdText);

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const response = await fetch("/api/job-fit-intelligence", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("API request failed.");
      }

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Job Fit Intelligence</h1>
        <p className="page-subtitle">
          Paste a Business Analyst Job Description and optionally upload your
          resume to receive recruiter-level insights, ATS analysis and interview
          preparation recommendations.
        </p>
      </header>

      <div className="content">
        <div className="job-fit-card">
          <div className="job-fit-section-header">
            <span className="job-fit-pill job-fit-pill--outline">JD Input</span>
          </div>

          <label className="job-fit-section-label">Job Description</label>
          <textarea
            className="job-fit-textarea"
            placeholder="Paste the complete Job Description here..."
            value={jdText}
            onChange={handleJdChange}
          />

          {error && <p className="jdi-error">{error}</p>}

          <div className="jdi-field">
            <div>
              <p className="job-fit-section-label">Upload Resume (Optional)</p>
              <p className="job-fit-help">
                Upload a PDF resume to compare your experience against the Job Description.
              </p>
            </div>

            <label className="jdi-upload-box">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="jdi-upload-input"
              />
              <span className="jdi-upload-icon">📄</span>
              <div>
                <div className="jdi-upload-title">
                  {resumeFile ? resumeFile.name : "Upload your resume PDF"}
                </div>
                <div className="jdi-upload-subtitle">
                  PDF only, text extraction is verified server-side.
                </div>
              </div>
            </label>
          </div>

          <div className="jdi-actions">
            <button className="ask-btn" onClick={handleAnalyze} disabled={loading}>
              <span className="btn-dot" />
              {loading ? "Analyzing…" : "Analyze JD"}
            </button>
          </div>

          {loading && (
            <div className="loading-dots">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>

        {analysis && <JobFitDashboard analysis={analysis} />}
      </div>

      <style>{`
        .job-fit-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(148,163,184,0.16);
          border-radius: 24px;
          padding: 28px;
          box-shadow: 0 20px 45px rgba(0,0,0,0.18);
        }

        .job-fit-section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }

        .job-fit-pill--outline {
          padding: 9px 14px;
          border-radius: 999px;
          border: 1px solid rgba(56,189,248,0.22);
          background: rgba(56,189,248,0.08);
          color: #38bdf8;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .job-fit-section-label {
          font-size: 12px;
          font-weight: 700;
          color: #38bdf8;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 12px;
          display: block;
        }

        .job-fit-help {
          margin-top: 6px;
          color: rgba(226,232,240,0.7);
          font-size: 13px;
          line-height: 1.7;
          max-width: 640px;
        }

        .job-fit-textarea {
          width: 100%;
          min-height: 240px;
          border: 1px solid rgba(148,163,184,0.22);
          border-radius: 18px;
          padding: 22px;
          background: rgba(255,255,255,0.04);
          color: rgba(226,232,240,0.96);
          font-size: 15px;
          line-height: 1.8;
          resize: vertical;
          outline: none;
        }

        .job-fit-textarea::placeholder {
          color: rgba(226,232,240,0.4);
        }

        .jdi-field {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin: 32px 0 24px;
        }

        .jdi-upload-box {
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 18px 20px;
          border: 1px solid rgba(148,163,184,0.22);
          border-radius: 18px;
          background: rgba(255,255,255,0.04);
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }

        .jdi-upload-box:hover {
          border-color: rgba(56,189,248,0.35);
          background: rgba(56,189,248,0.08);
        }

        .jdi-upload-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
          pointer-events: none;
        }

        .jdi-upload-icon {
          font-size: 22px;
          flex-shrink: 0;
        }

        .jdi-upload-title {
          font-size: 14px;
          font-weight: 600;
          color: rgba(226,232,240,0.96);
        }

        .jdi-upload-subtitle {
          margin-top: 6px;
          font-size: 12px;
          color: rgba(226,232,240,0.6);
          line-height: 1.7;
        }

        .jdi-actions {
          display: flex;
          justify-content: flex-end;
        }

        .loading-dots { display: flex; gap: 8px; align-items: center; padding: 14px 0; }
        .loading-dots span {
          width: 8px; height: 8px;
          border-radius: 999px;
          background: #38bdf8;
          opacity: 0.38;
          animation: dotPulse 1.2s ease-in-out infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.15s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.3s; }

        @keyframes dotPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.16); }
        }

        .jdi-error {
          margin-top: 16px;
          color: #fca5a5;
          font-size: 13px;
          font-weight: 600;
        }

        @media (max-width: 900px) {
          .jdi-upload-box {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </>
  );
}
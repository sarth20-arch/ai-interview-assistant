"use client";

import { useState } from "react";
import JobFitDashboard from "./JobFitDashboard";

// ── Types ──────────────────────────────────────────────────────────────────

interface AnalysisResult {
  summary: string;
  overallMatch: number;
  atsScore: number;
  recruiterDecision: string;
}

// ── Component ──────────────────────────────────────────────────────────────

export default function JDInput() {
  const [jdText, setJdText]         = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysis, setAnalysis]     = useState<AnalysisResult | null>(null);
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);

  const handleJdChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJdText(e.target.value);
    if (error) setError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await fetch("/api/job-fit-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jdText,
          resumeFileName: resumeFile?.name ?? null,
        }),
      });

      if (!response.ok) throw new Error("API request failed.");

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch {
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

        {/* JD Textarea */}
        <div className="chat-box">
          <textarea
            placeholder="Paste the complete Job Description here..."
            value={jdText}
            onChange={handleJdChange}
            style={{ minHeight: "220px" }}
          />
          {error && <p className="jdi-error">{error}</p>}
        </div>

        {/* Resume Upload */}
        <div className="jdi-field">
          <label className="jdi-label">Upload Resume (Optional)</label>
          <label className="jdi-upload-box">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="jdi-upload-input"
            />
            <span className="jdi-upload-icon">📄</span>
            <span className="jdi-upload-text">
              {resumeFile ? resumeFile.name : "Click to upload your resume PDF"}
            </span>
          </label>
        </div>

        {/* Analyze Button */}
        <div className="jdi-actions">
          <button
            className="ask-btn"
            onClick={handleAnalyze}
            disabled={loading}
          >
            <span className="btn-dot" />
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        )}

        {/* Analysis Results */}
        <JobFitDashboard analysis={analysis} />

      </div>

      <style>{`
        .jdi-error {
          margin-top: 8px;
          color: #c0392b;
          font-size: 13px;
          font-weight: 500;
        }

        .jdi-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }
        .jdi-label {
          font-size: 11px;
          font-weight: 500;
          color: #7a7668;
          letter-spacing: 0.04em;
        }

        .jdi-upload-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border: 0.5px dashed rgba(0,0,0,0.15);
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .jdi-upload-box:hover {
          border-color: #b8975a;
          background: rgba(184,151,90,0.03);
        }
        .jdi-upload-input { display: none; }
        .jdi-upload-icon  { font-size: 18px; flex-shrink: 0; }
        .jdi-upload-text  { font-size: 13px; color: #7a7668; line-height: 1.4; }

        .jdi-actions {
          display: flex;
          justify-content: flex-end;
          padding-top: 4px;
          margin-bottom: 20px;
        }

        .jdi-results { margin-top: 28px; }
      `}</style>
    </>
  );
}
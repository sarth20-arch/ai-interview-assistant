interface MatchScoreProps {
  analysis: any;
}

export default function MatchScore({ analysis }: MatchScoreProps) {
  if (!analysis) return null;

  // If no resume was uploaded, show a locked state instead of fake scores.
  if (!analysis.resumeUploaded) {
    return (
      <div
        style={{
          marginTop: "32px",
          padding: "24px",
          border: "1px solid #e5e5e5",
          borderRadius: "16px",
          background: "#fff",
        }}
      >
        <h2>Resume Analysis</h2>

        <p style={{ marginTop: "12px" }}>
          ⚠ No resume uploaded.
        </p>

        <p style={{ marginTop: "8px", color: "#666" }}>
          Upload your resume to unlock personalized insights:
        </p>

        <ul style={{ marginTop: "16px", lineHeight: "2" }}>
          <li>✅ Overall Match Score</li>
          <li>✅ ATS Compatibility</li>
          <li>✅ Recruiter Evaluation</li>
          <li>✅ Hiring Manager Review</li>
          <li>✅ Resume Improvements</li>
          <li>✅ Interview Preparation Plan</li>
        </ul>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "32px",
        padding: "24px",
        border: "1px solid #e5e5e5",
        borderRadius: "16px",
        background: "#fff",
      }}
    >
      <h2>Job Fit Summary</h2>

      <p style={{ marginTop: "12px" }}>
        {analysis.summary}
      </p>

      <div
        style={{
          display: "flex",
          gap: "24px",
          marginTop: "20px",
        }}
      >
        <div>
          <strong>Overall Match</strong>
          <br />
          {analysis.overallMatch}%
        </div>

        <div>
          <strong>ATS Score</strong>
          <br />
          {analysis.atsScore}%
        </div>

        <div>
          <strong>Recruiter</strong>
          <br />
          {analysis.recruiterDecision}
        </div>
      </div>
    </div>
  );
}
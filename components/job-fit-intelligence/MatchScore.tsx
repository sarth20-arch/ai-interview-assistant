interface MatchScoreProps {
  analysis: any;
}

export default function MatchScore({ analysis }: MatchScoreProps) {
  if (!analysis) return null;

  // If no resume was uploaded, show a locked state instead of fake scores.
  if (!analysis.resumeUploaded) {
    return (
      <div className="job-fit-card" style={{ marginTop: "32px" }}>
        <h2 className="job-fit-heading">Resume Analysis</h2>

        <p className="job-fit-meta" style={{ marginTop: "12px" }}>
          ⚠ No resume uploaded.
        </p>

        <p className="job-fit-meta" style={{ marginTop: "8px" }}>
          Upload your resume to unlock personalized insights:
        </p>

        <ul className="job-fit-list" style={{ marginTop: "16px", lineHeight: "1.9" }}>
          <li>Overall Match Score</li>
          <li>ATS Compatibility</li>
          <li>Recruiter Evaluation</li>
          <li>Hiring Manager Review</li>
          <li>Resume Improvements</li>
          <li>Interview Preparation Plan</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="job-fit-card" style={{ marginTop: "32px" }}>
      <h2 className="job-fit-heading">Job Fit Summary</h2>

      <p className="job-fit-meta" style={{ marginTop: "12px" }}>
        {analysis.summary}
      </p>

      <div className="job-fit-stat-grid">
        <div className="job-fit-stat">
          <strong>Overall Match</strong>
          <span>{analysis.overallMatch}%</span>
        </div>
        <div className="job-fit-stat">
          <strong>ATS Score</strong>
          <span>{analysis.atsScore}%</span>
        </div>
        <div className="job-fit-stat">
          <strong>Recruiter Decision</strong>
          <span>{analysis.recruiterDecision}</span>
        </div>
      </div>
    </div>
  );
}
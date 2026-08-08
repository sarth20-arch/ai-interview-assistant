interface Props {
  analysis: any;
}

export default function RecruiterVerdict({ analysis }: Props) {
  if (!analysis) return null;

  // Why?
  // If there is no resume, we cannot evaluate the candidate.
  if (!analysis.resumeUploaded) return null;

  return (
    <div className="job-fit-card" style={{ marginTop: "24px" }}>
      <h2 className="job-fit-heading">Recruiter Evaluation</h2>

      <div className="job-fit-grid" style={{ marginTop: "20px" }}>
        <div className="job-fit-meta">
          <strong>Recruiter</strong>
          <p>{analysis.recruiterDecision}</p>
        </div>
        <div className="job-fit-meta">
          <strong>Hiring Manager</strong>
          <p>{analysis.hiringManagerDecision}</p>
        </div>
        <div className="job-fit-meta">
          <strong>Senior BA</strong>
          <p>{analysis.seniorBAVerdict}</p>
        </div>
      </div>
    </div>
  );
}
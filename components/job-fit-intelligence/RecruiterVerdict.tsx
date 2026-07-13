interface Props {
  analysis: any;
}

export default function RecruiterVerdict({ analysis }: Props) {
  if (!analysis) return null;

  // Why?
  // If there is no resume, we cannot evaluate the candidate.
  if (!analysis.resumeUploaded) return null;

  return (
    <div
      style={{
        marginTop: "24px",
        padding: "24px",
        border: "1px solid #e5e5e5",
        borderRadius: "16px",
        background: "#fff",
      }}
    >
      <h2>Recruiter Evaluation</h2>

      <div style={{ marginTop: "20px" }}>
        <strong>Recruiter</strong>
        <p>{analysis.recruiterDecision}</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <strong>Hiring Manager</strong>
        <p>{analysis.hiringManagerDecision}</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <strong>Senior BA</strong>
        <p>{analysis.seniorBAVerdict}</p>
      </div>
    </div>
  );
}
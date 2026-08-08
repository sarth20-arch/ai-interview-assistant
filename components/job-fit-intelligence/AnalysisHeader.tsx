interface Props {
  analysis: any;
}

export default function AnalysisHeader({ analysis }: Props) {
  if (!analysis) return null;

  return (
    <div className="job-fit-card">
      <div className={`job-fit-pill ${analysis.resumeUploaded ? "job-fit-pill--success" : "job-fit-pill--warning"}`}>
        {analysis.resumeUploaded ? "✅ Resume Uploaded" : "⚠ No Resume Uploaded"}
      </div>

      <h2 className="job-fit-heading">📊 Job Fit Intelligence</h2>

      <p className="job-fit-meta">
        <strong>{analysis.jdInsights.role}</strong>
        {analysis.jdInsights.domain ? ` • ${analysis.jdInsights.domain}` : ""}
        {analysis.jdInsights.experience ? ` • ${analysis.jdInsights.experience}` : ""}
      </p>
    </div>
  );
}
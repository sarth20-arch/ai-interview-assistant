interface KeywordAnalysisProps {
  analysis: any;
}

export default function KeywordAnalysis({
  analysis,
}: KeywordAnalysisProps) {
  if (!analysis) return null;

  return (
    <div className="job-fit-card">
      <h2 className="job-fit-heading">JD Intelligence</h2>

      <div className="job-fit-grid" style={{ marginTop: "24px" }}>
        <div className="job-fit-meta">
          <strong>Role</strong>
          <p>{analysis.jdInsights.role || "—"}</p>
        </div>
        <div className="job-fit-meta">
          <strong>Experience</strong>
          <p>{analysis.jdInsights.experience || "—"}</p>
        </div>
        <div className="job-fit-meta">
          <strong>Domain</strong>
          <p>{analysis.jdInsights.domain || "—"}</p>
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <strong>Top Skills</strong>

        <div className="job-fit-tags">
          {analysis.jdInsights.topSkills.map((skill: string) => (
            <span key={skill} className="job-fit-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <strong>Hidden Expectations</strong>

        <ul className="job-fit-list">
          {analysis.jdInsights.hiddenExpectations.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
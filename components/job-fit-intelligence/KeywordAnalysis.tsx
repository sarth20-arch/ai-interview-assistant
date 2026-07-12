interface KeywordAnalysisProps {
  analysis: any;
}

export default function KeywordAnalysis({
  analysis,
}: KeywordAnalysisProps) {
  if (!analysis) return null;

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
      <h2>JD Intelligence</h2>

      <div style={{ marginTop: "18px" }}>
        <strong>Role</strong>
        <p>{analysis.jdInsights.role}</p>
      </div>

      <div style={{ marginTop: "12px" }}>
        <strong>Experience</strong>
        <p>{analysis.jdInsights.experience}</p>
      </div>

      <div style={{ marginTop: "12px" }}>
        <strong>Domain</strong>
        <p>{analysis.jdInsights.domain}</p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <strong>Top Skills</strong>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          {analysis.jdInsights.topSkills.map((skill: string) => (
            <span
              key={skill}
              style={{
                padding: "8px 14px",
                borderRadius: "999px",
                border: "1px solid #ddd",
                fontSize: "13px",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "24px" }}>
        <strong>Hidden Expectations</strong>

        <ul style={{ marginTop: "10px" }}>
          {analysis.jdInsights.hiddenExpectations.map((item: string) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
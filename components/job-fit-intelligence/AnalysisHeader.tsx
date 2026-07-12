interface Props {
  analysis: any;
}

export default function AnalysisHeader({ analysis }: Props) {
  if (!analysis) return null;

  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px",
        background: "#fff",
      }}
    >
      <h2 style={{ marginBottom: "10px" }}>
        📊 Job Fit Intelligence
      </h2>

      <p>
        <strong>{analysis.jdInsights.role}</strong> •{" "}
        {analysis.jdInsights.domain} •{" "}
        {analysis.jdInsights.experience}
      </p>

      <div style={{ marginTop: "16px" }}>
        {analysis.resumeUploaded ? (
          <span>✅ Resume uploaded</span>
        ) : (
          <span>⚠ Resume not uploaded</span>
        )}
      </div>
    </div>
  );
}
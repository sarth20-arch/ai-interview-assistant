import KeywordAnalysis from "./KeywordAnalysis";
import MatchScore from "./MatchScore";
import AnalysisHeader from "./AnalysisHeader";
import RecruiterVerdict from "./RecruiterVerdict";

interface Props {
  analysis: any;
}

export default function JobFitDashboard({ analysis }: Props) {
  if (!analysis) return null;

  return (
    <>
  <AnalysisHeader analysis={analysis} />

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
      marginTop: "24px",
    }}
  >
    <RecruiterVerdict analysis={analysis} />
    <KeywordAnalysis analysis={analysis} />

    <MatchScore analysis={analysis} />
  </div>
</>
  );
}
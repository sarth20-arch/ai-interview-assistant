"use client";

type Question = {
  skillsTested?: string[];
  [key: string]: any;
};

type Props = {
  questions: Question[];
  difficulty: string;
  interviewMode: string;
  onRestart: () => void;
  onReturnHome: () => void;
};

const NEXT_INTERVIEW: Record<string, string> = {
  "Recruiter":                "Hiring Manager",
  "Hiring Manager":           "Senior Business Analyst",
  "Senior Business Analyst":  "Technical BA",
  "Technical BA":             "Product Manager",
  "Product Manager":          null!,
};

export default function CompletionScreen({
  questions,
  difficulty,
  interviewMode,
  onRestart,
  onReturnHome,
}: Props) {
  const duration = questions.length * 3;

  const competencies = Array.from(
    new Set(questions.flatMap((q) => q.skillsTested ?? []))
  );

  const nextInterview = NEXT_INTERVIEW[interviewMode];

  return (
    <div className="completion-wrap">

      {/* Hero */}
      <div className="completion-hero">
        <div className="completion-emoji">🎉</div>
        <h2 className="completion-title">Interview Complete</h2>
        <p className="completion-sub">
          Great work making it through the full session.
        </p>
      </div>

      {/* Summary card */}
      <div className="qa-card" style={{ cursor: "default" }}>
        <div className="qa-meta">Interview Summary</div>

        <div className="completion-stats">
          <div className="completion-stat">
            <span className="kpi-block-label">Questions Completed</span>
            <span className="completion-stat-val">{questions.length}</span>
          </div>

          <div className="completion-stat">
            <span className="kpi-block-label">Difficulty</span>
            <span className="completion-stat-val">{difficulty}</span>
          </div>

          <div className="completion-stat">
            <span className="kpi-block-label">Interviewer</span>
            <span className="completion-stat-val">{interviewMode}</span>
          </div>

          <div className="completion-stat">
            <span className="kpi-block-label">Est. Duration</span>
            <span className="completion-stat-val">{duration} min</span>
          </div>
        </div>
      </div>

      {/* Competencies */}
      {competencies.length > 0 && (
        <div className="qa-card" style={{ cursor: "default" }}>
          <div className="qa-meta">Competencies Practiced</div>
          <div className="tag-list" style={{ marginTop: "10px" }}>
            {competencies.map((skill) => (
              <span key={skill} className="completion-badge">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Next interview */}
      <div className="qa-card" style={{ cursor: "default" }}>
        <div className="qa-meta">Recommended Next Interview</div>
        {nextInterview ? (
          <p className="completion-next">
            Try the{" "}
            <strong>{nextInterview}</strong>{" "}
            interview to keep progressing.
          </p>
        ) : (
          <p className="completion-next">
            🏆 Congratulations, you've completed the interview journey.
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="completion-actions">
        <button className="ask-btn" onClick={onRestart}>
          <span className="btn-dot" />
          Start Another Interview
        </button>

        <button className="completion-secondary-btn" onClick={onReturnHome}>
          Return Home
        </button>
      </div>

      <style>{`
        .completion-wrap {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 640px;
        }

        .completion-hero {
          text-align: center;
          padding: 32px 20px 24px;
        }
        .completion-emoji {
          font-size: 40px;
          margin-bottom: 12px;
          line-height: 1;
        }
        .completion-title {
          font-family: 'DM Serif Display', serif;
          font-size: 30px;
          color: #0e0d0b;
          margin: 0 0 8px;
          letter-spacing: -0.02em;
        }
        .completion-sub {
          font-size: 14px;
          color: #7a7668;
          margin: 0;
          line-height: 1.6;
        }

        .completion-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-top: 12px;
        }
        .completion-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .completion-stat-val {
          font-size: 15px;
          font-weight: 500;
          color: #0e0d0b;
        }

        .completion-badge {
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 20px;
          border: 0.5px solid rgba(184,151,90,0.35);
          color: #3a3830;
          background: rgba(184,151,90,0.07);
        }

        .completion-next {
          font-size: 13px;
          color: #3a3830;
          line-height: 1.65;
          margin: 10px 0 0;
        }

        .completion-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          padding-top: 4px;
        }
        .completion-secondary-btn {
          font-size: 13px;
          font-weight: 500;
          padding: 9px 20px;
          border: 0.5px solid rgba(0,0,0,0.15);
          border-radius: 9px;
          background: #fff;
          color: #3a3830;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.15s, color 0.15s;
        }
        .completion-secondary-btn:hover {
          border-color: #b8975a;
          color: #0e0d0b;
        }
      `}</style>
    </div>
  );
}
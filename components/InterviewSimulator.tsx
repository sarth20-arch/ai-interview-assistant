"use client";

import { useMemo, useState } from "react";
import interviewQuestions from "../data/interview_questions.json";

export default function InterviewSimulator() {
  const [role, setRole] = useState("Business Analyst");
  const [difficulty, setDifficulty] = useState("Easy");
  const [interviewMode, setInterviewMode] = useState("Recruiter");

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<any>(null);
  const [revealed, setRevealed] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [rating, setRating] = useState<string | null>(null);
  const [notesMap, setNotesMap] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  const questions = useMemo(() => {
    return interviewQuestions.filter(
      (q: any) =>
        q.role === role &&
        q.difficulty === difficulty
    );
  }, [role, difficulty]);

  const shuffleQuestions = (items: any[]) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const startInterview = () => {
    const shuffled = shuffleQuestions(questions);
    setSessionQuestions(shuffled);
    setCurrentIndex(0);
    setAnswer("");
    setRevealed(false);
    setAnswered(false);
    setNotesMap({});
    setCompleted(false);
    setStarted(true);
  };

  const markAnswered = () => {
    setAnswered(true);
  };

  const activeQuestions = started ? sessionQuestions : questions;
  const currentQuestion = activeQuestions[currentIndex];
  const progress = activeQuestions.length
    ? Math.round(((currentIndex + 1) / activeQuestions.length) * 100)
    : 0;

  // Readiness calculations (used on completion)
  const totalAvailableQuestions = questions.length;
  const completedCount = activeQuestions.length;
  const coveredCategories = Array.from(new Set(activeQuestions.map((q: any) => q.category).filter(Boolean)));
  const totalCategoriesAvailable = Array.from(new Set(questions.map((q: any) => q.category).filter(Boolean)));
  const categoriesCoverageRatio = totalCategoriesAvailable.length
    ? coveredCategories.length / totalCategoriesAvailable.length
    : 1;
  const questionsRatio = totalAvailableQuestions
    ? Math.min(1, completedCount / totalAvailableQuestions)
    : 1;
  const difficultyFactorMap: Record<string, number> = {
    Easy: 0.95,
    Medium: 1.0,
    Hard: 1.08,
  };
  const difficultyFactor = difficultyFactorMap[difficulty] || 1;
  const rawScore = ((questionsRatio * 0.5) + (categoriesCoverageRatio * 0.5)) * 100 * difficultyFactor;
  const readinessScore = Math.min(100, Math.round(rawScore));
  const readinessLabel = readinessScore >= 85 ? "Excellent" : readinessScore >= 65 ? "Good" : "Needs Practice";

  const recommendedNext: { key: string; label: string; href: string }[] = [];
  const cats = coveredCategories.map((c) => c.toLowerCase());
  if (cats.includes("kpis")) recommendedNext.push({ key: 'kpi', label: 'KPI Library', href: '/kpi-library' });
  if (cats.includes("agile") || cats.includes("prioritization") || cats.includes("requirement gathering")) recommendedNext.push({ key: 'ba', label: 'BA Copilot', href: '/ba-copilot' });
  if (cats.includes("stakeholder management") || cats.includes("conflict resolution") || cats.includes("introduction")) recommendedNext.push({ key: 'sarthak', label: 'Ask Sarthak', href: '/ask-sarthak' });
  // Fallback: always show BA Copilot if nothing matched
  if (recommendedNext.length === 0) recommendedNext.push({ key: 'ba', label: 'BA Copilot', href: '/ba-copilot' });


  const revealAnswer = async () => {
    if (!currentQuestion) return;

    setLoading(true);

    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentQuestion.question,
        }),
      });

      const data = await response.json();

      setAnswer({
        suggestedAnswer: data.suggestedAnswer || "",
        whyItWorks: data.whyItWorks || [],
        keyPoints: data.keyPoints || [],
        interviewTip: data.interviewTip || "",
      });
      setRevealed(true);

    } catch (err) {
      console.error(err);
      setAnswer({
        suggestedAnswer: "Unable to generate answer.",
        whyItWorks: [],
        keyPoints: [],
        interviewTip: "",
      });
      setRevealed(true);
    }

    setLoading(false);
  };

  const nextQuestion = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswer(null);
      setRevealed(false);
      setAnswered(false);
      setRating(null);
      setLoading(false);
    } else {
      // reached the end -> show completion screen
      setCompleted(true);
    }
  };

  const restartInterview = () => {
    setStarted(false);
    setSessionQuestions([]);
    setCurrentIndex(0);
    setAnswered(false);
    setAnswer(null);
    setRevealed(false);
    setRating(null);
    setLoading(false);
    setNotesMap({});
    setCompleted(false);
  };

  return (
    <div>

      <div
        style={{
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: "16px",
          background: "#fff",
          padding: "18px 20px",
          marginBottom: "22px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        <div
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "#111",
            marginBottom: "10px",
          }}
        >
          Why use this simulator?
        </div>
        <ul
          style={{
            paddingLeft: "20px",
            margin: 0,
            marginBottom: "12px",
            color: "#444",
            fontSize: "14px",
            lineHeight: 1.7,
          }}
        >
          <li>No prompt engineering required</li>
          <li>BA-focused interview questions</li>
          <li>Structured interview flow</li>
          <li>Answer first, compare later</li>
        </ul>
        <div
          style={{
            fontSize: "12px",
            color: "#717171",
            lineHeight: 1.5,
          }}
        >
          Built so you can focus on interviewing, not prompting AI.
        </div>
      </div>

      <h2 className="story-title">
        Mock Interview
      </h2>

      <p className="story-sub">
        Practice realistic Business Analyst interview questions and compare your approach with a sample answer.
      </p>

      {!started && (

        <div className="chat-box">

          <label
  style={{
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#222",
    marginBottom: "8px",
  }}
>
  Interview Role
</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              marginBottom: "20px",
              borderRadius: "8px",
              color: "#111",
              background: "#fff",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          >
            <option>Business Analyst</option>
          </select>

          <label
  style={{
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#222",
    marginBottom: "8px",
  }}
>
  Difficulty
</label>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              borderRadius: "8px",
              color: "#111",
              background: "#fff",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>

          <label
  style={{
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#222",
    marginBottom: "8px",
    marginTop: "20px",
  }}
>
  Interview Mode
</label>

          <select
            value={interviewMode}
            onChange={(e) => setInterviewMode(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              borderRadius: "8px",
              color: "#111",
              background: "#fff",
              border: "1px solid #ddd",
              fontSize: "14px",
            }}
          >
            <option>Recruiter</option>
            <option>Hiring Manager</option>
            <option>Senior Business Analyst</option>
            <option>Product Manager</option>
            <option>Technical BA</option>
          </select>

          <button
            className="ask-btn"
            style={{ marginTop: "24px" }}
            onClick={startInterview}
          >
            Start Interview
          </button>

        </div>

      )}

      {completed && (
        <div className="response-card" style={{padding: '22px'}}>
          <div style={{fontSize: '20px', fontWeight: 700, marginBottom: '12px'}}>🎉 Mock Interview Complete</div>

          {/* Interview Readiness */}
          <div style={{marginTop: '6px', marginBottom: '14px', padding: '14px', borderRadius: '12px', background: '#fafaf7', border: '1px solid rgba(0,0,0,0.04)'}}>
            <div style={{fontSize: '13px', fontWeight: 700, marginBottom: '8px'}}>Interview Readiness</div>
            <div style={{height: '10px', background: '#ececec', borderRadius: '999px', overflow: 'hidden'}}>
              <div style={{width: `${readinessScore}%`, height: '100%', background: '#c9a15b', transition: 'width 0.4s'}} />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px'}}>
              <div style={{fontSize: '18px', fontWeight: 700}}>{readinessScore}%</div>
              <div style={{fontSize: '13px', color: '#717171', fontWeight: 700}}>{readinessLabel}</div>
            </div>
            <div style={{marginTop: '10px', fontSize: '12px', color: '#666'}}>Based on questions completed, difficulty, and topic coverage.</div>
          </div>

          <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px'}}>
            <div style={{flex: '1 1 180px', padding: '14px', borderRadius: '12px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)'}}>
              <div style={{fontSize: '12px', color: '#717171', marginBottom: '6px'}}>Questions Completed</div>
              <div style={{fontSize: '16px', fontWeight: 700, color: '#111'}}>{activeQuestions.length}</div>
            </div>

            <div style={{flex: '1 1 140px', padding: '14px', borderRadius: '12px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)'}}>
              <div style={{fontSize: '12px', color: '#717171', marginBottom: '6px'}}>Difficulty</div>
              <div style={{fontSize: '16px', fontWeight: 700, color: '#111'}}>{difficulty}</div>
            </div>

            <div style={{flex: '1 1 180px', padding: '14px', borderRadius: '12px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)'}}>
              <div style={{fontSize: '12px', color: '#717171', marginBottom: '6px'}}>Interview Mode</div>
              <div style={{fontSize: '16px', fontWeight: 700, color: '#111'}}>{interviewMode}</div>
            </div>

            <div style={{flex: '1 1 260px', padding: '14px', borderRadius: '12px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)'}}>
              <div style={{fontSize: '12px', color: '#717171', marginBottom: '6px'}}>Topics Covered</div>
              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                {coveredCategories.length ? coveredCategories.map((c) => (
                  <div key={c} style={{padding: '6px 10px', borderRadius: '999px', background: 'rgba(201,161,91,0.08)', border: '1px solid rgba(201,161,91,0.12)', fontSize: '13px', color: '#3a3830'}}>{c}</div>
                )) : <div style={{color: '#777'}}>—</div>}
              </div>
            </div>

            <div style={{flex: '1 1 220px', padding: '14px', borderRadius: '12px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)'}}>
              <div style={{fontSize: '12px', color: '#717171', marginBottom: '6px'}}>Frameworks Used</div>
              <div style={{fontSize: '14px', color: '#3a3830'}}>{Array.from(new Set(activeQuestions.map((q:any)=>q.framework))).join(', ') || '—'}</div>
            </div>
          </div>

          {/* Recommended Next + Buttons */}
          <div style={{marginTop: '18px'}}>
            <div style={{fontSize: '13px', fontWeight: 700, marginBottom: '8px'}}>Recommended Next</div>
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
              {/* derive recommendations */}
              {(() => {
                const recs = new Set<string>();
                const cats = coveredCategories.map((s) => s.toLowerCase());
                if (cats.some((c) => c.includes('kpi') || c.includes('kpis'))) recs.add('KPI Library');
                if (cats.some((c) => ['agile','prioritization','implementation','requirement gathering','kpIs'].map(x=>x.toLowerCase()).includes(c)) || cats.some((c)=>c.includes('priorit'))) recs.add('BA Copilot');
                if (cats.some((c) => c.includes('stakeholder') || c.includes('conflict') || c.includes('introd'))) recs.add('Ask Sarthak');
                if (recs.size === 0) { recs.add('BA Copilot'); }
                return Array.from(recs).map((r) => (
                  <button key={r} className={r === 'BA Copilot' ? 'ask-btn' : 'filter-btn'} onClick={() => console.log('Navigate to', r)}>{r}</button>
                ));
              })()}
            </div>
          </div>

          <div style={{display: 'flex', gap: '12px', marginTop: '20px'}}>
            <button className="ask-btn" onClick={restartInterview}>Restart Interview</button>
            <button className="filter-btn" onClick={() => {
              // return home: reset the session but keep selected filters
              setStarted(false);
              setSessionQuestions([]);
              setCurrentIndex(0);
              setCompleted(false);
            }}>Return Home</button>
          </div>
        </div>
      )}

      {started && currentQuestion && (

        <div className="response-card">

          <div className="response-label">
            Question {currentIndex + 1} / {activeQuestions.length}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
              margin: "18px 0 20px",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "12px",
                borderRadius: "999px",
                background: "#ececec",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#c9a15b",
                  borderRadius: "999px",
                  transition: "width 0.35s ease",
                }}
              />
            </div>
            <div
              style={{
                minWidth: "48px",
                textAlign: "right",
                fontSize: "13px",
                fontWeight: 600,
                color: "#3a3830",
              }}
            >
              {progress}%
            </div>
          </div>

          <div style={{display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap'}}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{fontSize: '11px', color: '#717171', marginBottom: '6px'}}>Category</div>
              <div style={{padding: '6px 10px', borderRadius: '999px', background: '#f6f6f6', border: '1px solid rgba(0,0,0,0.04)', fontSize: '12px', color: '#333'}}>{currentQuestion.category || '—'}</div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{fontSize: '11px', color: '#717171', marginBottom: '6px'}}>Framework</div>
              <div style={{padding: '6px 10px', borderRadius: '999px', background: '#f6f6f6', border: '1px solid rgba(0,0,0,0.04)', fontSize: '12px', color: '#333'}}>{currentQuestion.framework || '—'}</div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{fontSize: '11px', color: '#717171', marginBottom: '6px'}}>Expected Time</div>
              <div style={{padding: '6px 10px', borderRadius: '999px', background: '#f6f6f6', border: '1px solid rgba(0,0,0,0.04)', fontSize: '12px', color: '#333'}}>{currentQuestion.expectedDuration || currentQuestion.expectedTime || '—'}</div>
            </div>
          </div>

          <h3
            style={{
              marginTop: 0,
              color: "#111",
              lineHeight: 1.5,
            }}
          >
            {currentQuestion.question}
          </h3>

          <p
            style={{
              color: "#777",
              marginTop: "18px",
              marginBottom: "24px",
            }}
          >
            Think about your answer first, then compare it with mine.
          </p>

          <div style={{marginBottom: '18px'}}>
            <div style={{fontSize: '13px', fontWeight: 700, marginBottom: '8px'color: "#374151"}}>Quick Notes (Optional)</div>
            {!answered ? (
              <textarea
                placeholder={"Example:\n• Requirement Gathering\n• Stakeholder Alignment\n• User Stories\n• UAT\n\nThese are only for your own preparation."}
                value={notesMap[currentQuestion.id] || ""}
                onChange={(e) => setNotesMap((prev) => ({...prev, [currentQuestion.id]: e.target.value}))}
                style={{
  width: "100%",
  minHeight: "84px",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  resize: "vertical",
  backgroundColor: "#ffffff",
  color: "#111827",
  caretColor: "#111827",
}}
              />
            ) : (
              <div style={{display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
                <div style={{flex: 1, padding: '10px 12px', borderRadius: '8px', background: '#fff', border: '1px solid rgba(0,0,0,0.06)'}}>
                  <div style={{fontSize: '12px', color: '#717171', marginBottom: '6px'}}>Your Notes</div>
                  <div style={{whiteSpace: 'pre-wrap', color: '#333', fontSize: '14px'}}>{notesMap[currentQuestion.id] || '—'}</div>
                </div>
                <div style={{minWidth: '160px', fontSize: '12px', color: '#717171'}}>
                  These notes are for your preparation and won't be sent to the AI.
                </div>
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            {!answered && (
              <button
                className="ask-btn"
                onClick={markAnswered}
              >
                I&apos;ve Answered
              </button>
            )}

            {answered && !revealed && (
              <button
                className="ask-btn"
                onClick={revealAnswer}
                disabled={loading}
              >
                {loading
                  ? "Generating Suggested Answer..."
                  : "Reveal Suggested Answer"}
              </button>
            )}

            {revealed && (
              <button
                className="ask-btn"
                onClick={nextQuestion}
              >
                Next Question
              </button>
            )}

            <button
              className="filter-btn"
              onClick={restartInterview}
            >
              Restart Interview
            </button>
          </div>

          {revealed && (
            <div
              className="response-card"
              style={{
                marginTop: "24px",
              }}
            >
              <div className="response-label">
                💡 Suggested Answer
              </div>
              <p className="response-text">
                {answer?.suggestedAnswer}
              </p>

              {/* Key Points sourced from question metadata (not AI) */}
              {currentQuestion?.keyPoints && currentQuestion.keyPoints.length > 0 && (
                <div style={{marginTop: "16px", paddingTop: '6px'}}>
                  <div style={{fontSize: "13px", fontWeight: 600, color: "#3a3830", marginBottom: "10px"}}>📌 Key Points to Mention</div>
                  <div style={{display: "flex", flexWrap: "wrap", gap: "8px"}}>
                    {currentQuestion.keyPoints.map((point: string, idx: number) => (
                      <span key={idx} style={{padding: "6px 12px", borderRadius: "999px", background: "rgba(201, 161, 91, 0.08)", border: "0.5px solid rgba(201, 161, 91, 0.14)", fontSize: "13px", color: "#3a3830"}}>{point}</span>
                    ))}
                  </div>
                </div>
              )}

              {answer?.interviewTip && (
                <div style={{marginTop: "16px", padding: "14px", borderRadius: "12px", background: "#fffbf5", border: "1px solid rgba(201, 161, 91, 0.2)", borderLeft: "3px solid #c9a15b"}}>
                  <div style={{fontSize: "12px", fontWeight: 600, color: "#c9a15b", marginBottom: "6px"}}>💡 Interview Tip</div>
                  <p style={{margin: 0, fontSize: "13px", color: "#3a3830", lineHeight: 1.6}}>{answer.interviewTip}</p>
                </div>
              )}

              {answer?.whyItWorks && answer.whyItWorks.length > 0 && (
                <div style={{marginTop: "20px", padding: "16px", borderRadius: "12px", background: "#fafaf7", border: "1px solid rgba(0,0,0,0.06)"}}>
                  <div style={{fontSize: "13px", fontWeight: 600, color: "#3a3830", marginBottom: "10px"}}>✓ Why This Answer Works</div>
                  <ul style={{margin: 0, paddingLeft: "18px", color: "#3a3830", fontSize: "13px", lineHeight: 1.8}}>
                    {answer.whyItWorks.map((point: string, idx: number) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {revealed && (
            <div
              style={{
                marginTop: "22px",
                padding: "16px",
                borderRadius: "12px",
                background: "#fafaf7",
                border: "1px solid rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#3a3830",
                  marginBottom: "12px",
                }}
              >
                How similar was your answer?
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: rating ? "12px" : 0,
                }}
              >
                {[
                  { value: "very_similar", label: "✅ Very Similar" },
                  { value: "some_gaps", label: "🟡 Some Gaps" },
                  { value: "needs_improvement", label: "🔴 Needs Improvement" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setRating(option.value)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: "8px",
                      border:
                        rating === option.value
                          ? "2px solid #b8975a"
                          : "1px solid rgba(0,0,0,0.12)",
                      background:
                        rating === option.value
                          ? "rgba(184,151,90,0.08)"
                          : "#fff",
                      color: "#3a3830",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {rating && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "#717171",
                    lineHeight: 1.6,
                    fontStyle: "italic",
                  }}
                >
                  {rating === "very_similar" &&
                    "Great! Your answer aligns well. Keep this approach consistent."}
                  {rating === "some_gaps" &&
                    "Good foundation. Review the suggested answer for improvements."}
                  {rating === "needs_improvement" &&
                    "No worries—focus on the gaps and practice more."}
                </div>
              )}
            </div>
          )}

        </div>

      )}

    </div>
  );
}
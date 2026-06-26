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
            </div>
          )}

          {revealed && answer?.whyItWorks && answer.whyItWorks.length > 0 && (
            <div style={{marginTop: "20px", padding: "16px", borderRadius: "12px", background: "#fafaf7", border: "1px solid rgba(0,0,0,0.06)"}}>
              <div style={{fontSize: "13px", fontWeight: 600, color: "#3a3830", marginBottom: "10px"}}>✓ Why This Answer Works</div>
              <ul style={{margin: 0, paddingLeft: "18px", color: "#3a3830", fontSize: "13px", lineHeight: 1.8}}>
                {answer.whyItWorks.map((point: string, idx: number) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {revealed && answer?.keyPoints && answer.keyPoints.length > 0 && (
            <div style={{marginTop: "16px", padding: "16px", borderRadius: "12px", background: "#fff", border: "1px solid rgba(0,0,0,0.08)"}}>
              <div style={{fontSize: "13px", fontWeight: 600, color: "#3a3830", marginBottom: "10px"}}>📌 Key Points to Mention</div>
              <div style={{display: "flex", flexWrap: "wrap", gap: "8px"}}>
                {answer.keyPoints.map((point: string, idx: number) => (
                  <span key={idx} style={{padding: "6px 12px", borderRadius: "6px", background: "rgba(201, 161, 91, 0.1)", border: "0.5px solid rgba(201, 161, 91, 0.3)", fontSize: "12px", color: "#3a3830"}}>{point}</span>
                ))}
              </div>
            </div>
          )}

          {revealed && answer?.interviewTip && (
            <div style={{marginTop: "16px", padding: "14px", borderRadius: "12px", background: "#fffbf5", border: "1px solid rgba(201, 161, 91, 0.2)", borderLeft: "3px solid #c9a15b"}}>
              <div style={{fontSize: "12px", fontWeight: 600, color: "#c9a15b", marginBottom: "6px"}}>💡 Interview Tip</div>
              <p style={{margin: 0, fontSize: "13px", color: "#3a3830", lineHeight: 1.6}}>{answer.interviewTip}</p>
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
"use client";

import { useState } from "react";
import recruiterQA from "../data/recruiter_qa.json";
import kpis from "../data/kpis.json";
import { candidateProfile } from "../data/profile";
import InterviewSimulator from "../components/InterviewSimulator";
import HomeDashboard from "../components/HomeDashboard";
import JDInput from "@/components/job-fit-intelligence/JDInput";
import type { Section } from "../types/navigation";
// ── Types ──────────────────────────────────────────────────────────────────



// ── KPI Library ────────────────────────────────────────────────────────────

interface KPIItem {
  id: number;
  category: string;
  framework: string;
  summary: string;
  formula: string;
  how_ba_uses_it: string;
  interview_tip: string;
  when_to_use: string;
  example: string;
}

function KPILibrary() {
  const data = kpis as KPIItem[];
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">KPI Library</h1>
        <p className="page-subtitle">
          Explore commonly used Business and Product KPIs used during interviews.
        </p>
      </header>

      <div className="content">
        <div className="qa-list">
          {data.map((k) => (
            <div
              key={k.id}
              className={`qa-card ${openId === k.id ? "open" : ""}`}
              onClick={() => setOpenId(openId === k.id ? null : k.id)}
            >
              <div className="qa-meta">{k.category}</div>

              <div className="qa-question">
                <span>{k.framework}</span>
                <span className="qa-chevron">&#8964;</span>
              </div>

              {openId === k.id && (
                <div className="qa-answer">
                  <div className="kpi-block">
                    <span className="kpi-block-label">Summary</span>
                    <p>{k.summary}</p>
                  </div>
                  <div className="kpi-block">
                    <span className="kpi-block-label">Formula</span>
                    <p className="kpi-formula">{k.formula}</p>
                  </div>
                  <div className="kpi-block">
                    <span className="kpi-block-label">How a BA Uses It</span>
                    <p>{k.how_ba_uses_it}</p>
                  </div>
                  <div className="kpi-block">
                    <span className="kpi-block-label">Interview Tip</span>
                    <p>{k.interview_tip}</p>
                  </div>
                  <div className="kpi-block">
                    <span className="kpi-block-label">When To Use It</span>
                    <p>{k.when_to_use}</p>
                  </div>
                  <div className="kpi-block">
                    <span className="kpi-block-label">Example</span>
                    <p>{k.example}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Home ───────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("Home");

  // Ask Sarthak state
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedMode, setSelectedMode] = useState("All");
  const [userQuestion, setUserQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // BA Copilot state
  const [featureIdea, setFeatureIdea] = useState("");
  const [storyOutput, setStoryOutput] = useState("");
  const [storyLoading, setStoryLoading] = useState(false);

  const recruiterModes = [
    "All",
    "Behavioral",
    "Product Thinking",
    "Agile",
    "Implementation",
    "Stakeholder Management",
  ];

  const filteredQuestions = (recruiterQA as { id: number; category: string; question: string; answer: string }[]).filter(
    (item) => selectedMode === "All" || item.category === selectedMode
  );

  const generateAnswer = async () => {
    if (!userQuestion.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userQuestion }),
      });
      const data = await response.json();
      setAiResponse(data.reply);
    } catch (error) {
      console.error(error);
      setAiResponse("Something went wrong.");
    }
    setLoading(false);
  };

  const generateUserStory = async () => {
    if (!featureIdea.trim()) return;
    setStoryLoading(true);
    try {
      const response = await fetch("/api/user-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feature: featureIdea }),
      });
      const data = await response.json();
      setStoryOutput(data.story);
    } catch (error) {
      console.error(error);
      setStoryOutput("Unable to generate user story.");
    }
    setStoryLoading(false);
  };

  const toggleAnswer = (id: number) => {
    setSelectedId(selectedId === id ? null : id);
  };

  const navigate = (section: Section) => setActiveSection(section);
  const goHome = () => setActiveSection("Home");
  const isHome = activeSection === "Home";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: 'DM Sans', sans-serif;
        }

        .app {
          display: grid;
          grid-template-columns: 230px 1fr;
          min-height: 100vh;
          background-color: var(--background);
          background-image: radial-gradient(circle at top left, rgba(56, 189, 248, 0.08), transparent 28%);
        }

        /* ── SIDEBAR ── */
        .sidebar {
          background: rgba(15, 23, 42, 0.96);
          padding: 28px 20px;
          display: flex;
          flex-direction: column;
          gap: 28px;
          position: relative;
          overflow: hidden;
        }
        .sidebar::before {
          content: '';
          position: absolute;
          top: -70px; right: -70px;
          width: 200px; height: 200px;
          border-radius: 50%;
          border: 48px solid rgba(56, 189, 248, 0.08);
          pointer-events: none;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 24px;
          border-bottom: 0.5px solid rgba(148,163,184,0.08);
          cursor: pointer;
        }
        .logo-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%);
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Serif Display', serif;
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
          flex-shrink: 0;
          letter-spacing: -0.02em;
        }
        .logo-text { font-size: 13px; font-weight: 500; color: rgba(226,232,240,0.95); line-height: 1.3; }
        .logo-sub  { font-size: 11px; color: rgba(226,232,240,0.55); margin-top: 2px; }

        .sidebar-profile-card {
          padding: 20px 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(148,163,184,0.12);
          border-radius: 18px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .sidebar-profile-heading {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #38bdf8;
          font-weight: 700;
        }
        .sidebar-profile-name {
          font-size: 16px;
          font-weight: 700;
          color: rgba(226,232,240,0.98);
          line-height: 1.2;
          margin: 0;
        }
        .sidebar-profile-meta {
          font-size: 12px;
          color: rgba(226,232,240,0.72);
          line-height: 1.5;
        }

        .sidebar-section { display: flex; flex-direction: column; gap: 6px; }
        .sidebar-label {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #38bdf8;
          margin-bottom: 2px;
        }
        .sidebar-val-main { font-size: 13px; color: rgba(226,232,240,0.95); font-weight: 500; }
        .sidebar-val      { font-size: 12px; color: rgba(226,232,240,0.62); line-height: 1.6; }

        .tag-list { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px; }
        .tag {
          font-size: 10px;
          padding: 3px 9px;
          border-radius: 20px;
          border: 0.5px solid rgba(56,189,248,0.28);
          color: rgba(226,232,240,0.72);
          background: rgba(255,255,255,0.04);
        }

        /* ── MAIN ── */
        .main {
          display: flex;
          flex-direction: column;
          background: transparent;
          min-height: auto;
          padding: 0 48px;
        }

        /* ── BACK BAR ── */
        .back-bar {
          display: flex;
          align-items: center;
          padding: 0;
          height: 48px;
          border-bottom: 0.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          flex-shrink: 0;
        }
        .back-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          color: rgba(226,232,240,0.88);
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          padding: 0;
          transition: color 0.15s;
        }
        .back-btn:hover { color: #38bdf8; }

        /* ── PAGE HEADER (used by inline modules) ── */
        .page-header {
          padding: 32px 0 24px;
          border-bottom: 0.5px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        }
        .page-title {
          font-family: 'DM Serif Display', serif;
          font-size: 34px;
          color: var(--foreground);
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 8px;
        }
        .page-subtitle {
          font-size: 14px;
          color: rgba(226,232,240,0.75);
          line-height: 1.6;
          max-width: 580px;
          margin: 0;
        }

        /* ── CONTENT ── */
        .content { padding: 28px 0; flex: 1; }

        /* ── CHAT BOX ── */
        .chat-box {
          border: 1px solid rgba(148,163,184,0.16);
          border-radius: 16px;
          background: rgba(255,255,255,0.04);
          padding: 18px;
          margin-bottom: 16px;
          box-shadow: 0 18px 36px rgba(0,0,0,0.12);
        }
        .chat-box textarea {
          width: 100%;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: var(--foreground);
          background: transparent;
          resize: none;
          min-height: 80px;
          line-height: 1.65;
        }
        .chat-box textarea::placeholder { color: rgba(226,232,240,0.45); }
        .chat-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(148,163,184,0.12);
        }
        .char-hint { font-size: 11px; color: rgba(226,232,240,0.65); }

        .ask-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 20px;
          background: #1f2937;
          color: #fff;
          border: 1px solid rgba(56,189,248,0.22);
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s, transform 0.15s;
        }
        .ask-btn:hover { opacity: 0.92; transform: translateY(-1px); }
        .ask-btn:disabled { opacity: 0.5; cursor: default; }
        .btn-dot { width: 6px; height: 6px; border-radius: 50%; background: #38bdf8; flex-shrink: 0; }

        /* ── RESPONSE ── */
        .response-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(148,163,184,0.16);
          border-left: 3px solid #38bdf8;
          border-radius: 18px;
          padding: 18px 20px;
          margin-bottom: 24px;
          animation: fadeUp 0.3s ease;
        }
        .response-label {
          font-size: 10px;
          font-weight: 500;
          color: #38bdf8;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .response-text { font-size: 13px; color: rgba(226,232,240,0.9); line-height: 1.75; white-space: pre-line; }

        /* ── FILTERS ── */
        .filter-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
        .filter-btn {
          font-size: 11px;
          padding: 5px 13px;
          border: 1px solid rgba(148,163,184,0.18);
          border-radius: 20px;
          background: rgba(255,255,255,0.04);
          cursor: pointer;
          color: rgba(226,232,240,0.82);
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .filter-btn:hover { border-color: rgba(56,189,248,0.25); color: #fff; }
        .filter-btn.active { background: rgba(56,189,248,0.18); color: #fff; border-color: rgba(56,189,248,0.35); }

        /* ── QA CARDS ── */
        .qa-list { display: flex; flex-direction: column; gap: 10px; }
        .qa-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(148,163,184,0.16);
          border-radius: 16px;
          padding: 18px 20px;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
        }
        .qa-card:hover { border-color: rgba(56,189,248,0.35); box-shadow: 0 18px 32px rgba(0,0,0,0.10); transform: translateY(-1px); }
        .qa-card.open { border-color: #38bdf8; }
        .qa-meta { font-size: 10px; font-weight: 500; color: #38bdf8; letter-spacing: 0.09em; text-transform: uppercase; margin-bottom: 8px; }
        .qa-question {
          font-size: 14px; font-weight: 500; color: rgba(226,232,240,0.94); line-height: 1.4;
          display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
        }
        .qa-chevron { font-size: 16px; color: rgba(226,232,240,0.65); flex-shrink: 0; transition: transform 0.2s; display: inline-block; }
        .qa-card.open .qa-chevron { transform: rotate(180deg); }
        .qa-answer {
          font-size: 13px; color: rgba(226,232,240,0.78); line-height: 1.75;
          margin-top: 14px; padding-top: 14px;
          border-top: 1px solid rgba(148,163,184,0.16);
          animation: fadeUp 0.2s ease;
        }

        /* ── KPI BLOCKS ── */
        .kpi-block { margin-bottom: 14px; }
        .kpi-block:last-child { margin-bottom: 0; }
        .kpi-block-label {
          display: block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #b8975a;
          margin-bottom: 4px;
        }
        .kpi-block p { margin: 0; font-size: 13px; color: rgba(226,232,240,0.82); line-height: 1.7; }
        .kpi-formula {
          font-style: italic;
          background: rgba(255,255,255,0.04);
          border-left: 3px solid #38bdf8;
          padding: 8px 12px;
          border-radius: 0 6px 6px 0;
          color: rgba(226,232,240,0.82);
        }

        /* ── BA COPILOT ── */
        .story-output {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(148,163,184,0.16);
          border-radius: 16px;
          padding: 18px;
          margin-top: 16px;
          animation: fadeUp 0.3s ease;
        }
        .story-output pre {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(226,232,240,0.92);
          line-height: 1.8;
          white-space: pre-wrap;
          margin: 0;
        }

        /* ── LOADING ── */
        .loading-dots { display: flex; gap: 5px; align-items: center; padding: 12px 0; }
        .loading-dots span {
          width: 7px; height: 7px; border-radius: 50%;
          background: #b8975a; opacity: 0.35;
          animation: dotPulse 1.2s ease-in-out infinite;
        }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes dotPulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.15); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: none; }
        }

        @media (max-width: 768px) {
          .app { grid-template-columns: 1fr; }
          .sidebar { display: none; }
          .main { padding: 0 20px; }
          .back-bar { padding: 0; }
          .page-header { padding: 24px 0 20px; }
          .content { padding: 20px 0; }
        }
      `}</style>

      <div className="app">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="logo-area" onClick={goHome}>
            <div className="logo-icon">BA</div>
            <div>
              <div className="logo-text">BA Prep AI</div>
              <div className="logo-sub">AI-powered Interview Toolkit</div>
            </div>
          </div>

          <div className="sidebar-profile-card">
            <div className="sidebar-profile-heading">{candidateProfile.heading}</div>
            <div className="sidebar-profile-name">{candidateProfile.name}</div>
            <div className="sidebar-profile-meta">
              {candidateProfile.role} · {candidateProfile.experience}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Role</div>
            <div className="sidebar-val-main">{candidateProfile.role}</div>
            <div className="sidebar-val">Product Management</div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Experience</div>
            <div className="sidebar-val-main">{candidateProfile.experience}</div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Domains</div>
            <div className="tag-list">
              {candidateProfile.domains.map((d) => (
                <span key={d} className="tag">{d}</span>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Skills</div>
            <div className="tag-list">
              {candidateProfile.skills.map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="main">

          {/* Back bar — only on feature pages */}
          {!isHome && (
            <div className="back-bar">
              <button className="back-btn" onClick={goHome}>
                ← Back to Home
              </button>
            </div>
          )}

          {/* ── Home ── */}
          {activeSection === "Home" && (
            <div className="content">
              <HomeDashboard onNavigate={(s) => navigate(s as Section)} />
            </div>
          )}

          {/* ── job-fit-intelligence ── */}
          {activeSection === "job-fit-intelligence" && (
            <div className="content">
              <JDInput />
            </div>
          )}

          {/* ── Mock Interview — owns its own header ── */}
          {activeSection === "Mock Interview" && (
            <div className="content">
              <InterviewSimulator />
            </div>
          )}

          {/* ── Ask Sarthak ── */}
          {activeSection === "Ask Sarthak" && (
            <>
              <header className="page-header">
                <h1 className="page-title">Ask Sarthak</h1>
                <p className="page-subtitle">
                  Ask questions about Sarthak&apos;s projects, experience, business analysis approach and interview scenarios.
                </p>
              </header>

              <div className="content">
                <div className="chat-box">
                  <textarea
                    placeholder="Ask about Sarthak&apos;s experience, projects, or approach…"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                  />
                  <div className="chat-footer">
                    <span className="char-hint">
                      {userQuestion.trim().length > 0
                        ? `${userQuestion.length} chars`
                        : "Ask anything — experience, decisions, tradeoffs"}
                    </span>
                    <button className="ask-btn" onClick={generateAnswer} disabled={loading}>
                      <span className="btn-dot" />
                      {loading ? "Thinking…" : "Ask Sarthak"}
                    </button>
                  </div>
                </div>

                {loading && (
                  <div className="loading-dots"><span /><span /><span /></div>
                )}

                {aiResponse && !loading && (
                  <div className="response-card">
                    <div className="response-label">Sarthak&apos;s Response</div>
                    <p className="response-text">{aiResponse}</p>
                  </div>
                )}

                <div className="filter-row">
                  {recruiterModes.map((mode) => (
                    <button
                      key={mode}
                      className={`filter-btn ${selectedMode === mode ? "active" : ""}`}
                      onClick={() => setSelectedMode(mode)}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <div className="qa-list">
                  {filteredQuestions.map((item) => (
                    <div
                      key={item.id}
                      className={`qa-card ${selectedId === item.id ? "open" : ""}`}
                      onClick={() => toggleAnswer(item.id)}
                    >
                      <div className="qa-meta">{item.category}</div>
                      <div className="qa-question">
                        <span>{item.question}</span>
                        <span className="qa-chevron">&#8964;</span>
                      </div>
                      {selectedId === item.id && (
                        <p className="qa-answer">{item.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── BA Copilot ── */}
          {activeSection === "BA Copilot" && (
            <>
              <header className="page-header">
                <h1 className="page-title">BA Copilot</h1>
                <p className="page-subtitle">
                  Generate User Stories, Acceptance Criteria, Edge Cases and BA documentation.
                </p>
              </header>

              <div className="content">
                <div className="chat-box">
                  <textarea
                    value={featureIdea}
                    onChange={(e) => setFeatureIdea(e.target.value)}
                    placeholder="e.g. Users should be able to login using OTP verification…"
                    style={{ minHeight: "90px" }}
                  />
                  <div className="chat-footer">
                    <span className="char-hint">Describe the feature in plain language</span>
                    <button className="ask-btn" onClick={generateUserStory} disabled={storyLoading}>
                      <span className="btn-dot" />
                      {storyLoading ? "Generating…" : "Generate"}
                    </button>
                  </div>
                </div>

                {storyLoading && (
                  <div className="loading-dots"><span /><span /><span /></div>
                )}

                {storyOutput && !storyLoading && (
                  <div className="story-output">
                    <pre>{storyOutput}</pre>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── KPI Library — owns its own header ── */}
          {activeSection === "KPI Library" && (
            <div className="content">
              <KPILibrary />
            </div>
          )}

        </div>
      </div>
    </>
  );
}
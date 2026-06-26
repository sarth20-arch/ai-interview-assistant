"use client";

import { useState } from "react";
import recruiterQA from "../data/recruiter_qa.json";
import kpis from "../data/kpis.json";
import InterviewSimulator from "../components/InterviewSimulator";

// ── Types ──────────────────────────────────────────────────────────────────

type Section =
  | "Mock Interview"
  | "Ask Sarthak"
  | "BA Copilot"
  | "KPI Library";

const NAV_TABS: Section[] = [
  "Mock Interview",
  "Ask Sarthak",
  "BA Copilot",
  "KPI Library",
];

const PAGE_META: Record<Section, { title: string; subtitle: string }> = {
  "Mock Interview": {
    title: "Mock Interview",
    subtitle:
      "Practice realistic Business Analyst interview questions and compare your approach with a sample answer.",
  },
  "Ask Sarthak": {
    title: "Ask Sarthak",
    subtitle:
      "Ask questions about Sarthak's projects, experience, business analysis approach and interview scenarios.",
  },
  "BA Copilot": {
    title: "BA Copilot",
    subtitle:
      "Generate User Stories, Acceptance Criteria, Edge Cases and BA documentation.",
  },
  "KPI Library": {
    title: "KPI Library",
    subtitle:
      "Explore commonly used Business and Product KPIs used during interviews.",
  },
};

// ── KPI Library ────────────────────────────────────────────────────────────

function KPILibrary() {
  const data: any = kpis || [];
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="qa-list">
      {Array.isArray(data) &&
        data.map((k: any) => (
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
  );
}

// ── Home ───────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("Mock Interview");

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

  const filteredQuestions = recruiterQA.filter(
    (item: any) =>
      selectedMode === "All" || item.category === selectedMode
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

  const { title, subtitle } = PAGE_META[activeSection];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        body {
          margin: 0;
          background: #f8f6f1;
          font-family: 'DM Sans', sans-serif;
        }

        .app {
          display: grid;
          grid-template-columns: 230px 1fr;
          min-height: 100vh;
        }

        /* ── SIDEBAR ── */
        .sidebar {
          background: #1a1714;
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
          border: 48px solid rgba(184,151,90,0.07);
          pointer-events: none;
        }

        .logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 24px;
          border-bottom: 0.5px solid rgba(255,255,255,0.08);
        }
        .logo-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: #b8975a;
          display: flex; align-items: center; justify-content: center;
          font-family: 'DM Serif Display', serif;
          font-size: 14px;
          font-weight: 600;
          color: #1a1714;
          flex-shrink: 0;
          letter-spacing: -0.02em;
        }
        .logo-text { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.9); line-height: 1.3; }
        .logo-sub  { font-size: 11px; color: rgba(255,255,255,0.38); margin-top: 2px; }

        .sidebar-section { display: flex; flex-direction: column; gap: 6px; }
        .sidebar-label {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #b8975a;
          margin-bottom: 2px;
        }
        .sidebar-val-main { font-size: 13px; color: rgba(255,255,255,0.85); font-weight: 500; }
        .sidebar-val      { font-size: 12px; color: rgba(255,255,255,0.55); line-height: 1.6; }

        .tag-list { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 4px; }
        .tag {
          font-size: 10px;
          padding: 3px 9px;
          border-radius: 20px;
          border: 0.5px solid rgba(184,151,90,0.28);
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.03);
        }

        /* ── MAIN ── */
        .main {
          display: flex;
          flex-direction: column;
          background: #f8f6f1;
          min-height: 100vh;
        }

        /* ── TOP NAV ── */
        .topbar {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 0 32px;
          border-bottom: 0.5px solid rgba(0,0,0,0.08);
          background: #f8f6f1;
        }
        .tab-btn {
          font-size: 13px;
          font-weight: 400;
          padding: 16px 18px;
          border: none;
          background: none;
          cursor: pointer;
          color: #7a7668;
          border-bottom: 2px solid transparent;
          margin-bottom: -0.5px;
          transition: color 0.15s, border-color 0.15s;
          font-family: 'DM Sans', sans-serif;
          white-space: nowrap;
        }
        .tab-btn:hover { color: #0e0d0b; background: rgba(0,0,0,0.02); }
        .tab-btn.active { color: #0e0d0b; border-bottom-color: #b8975a; font-weight: 500; }

        /* ── PAGE HEADER ── */
        .page-header {
          padding: 32px 32px 24px;
          border-bottom: 0.5px solid rgba(0,0,0,0.06);
        }
        .page-title {
          font-family: 'DM Serif Display', serif;
          font-size: 34px;
          color: #0e0d0b;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin: 0 0 8px;
        }
        .page-subtitle {
          font-size: 14px;
          color: #7a7668;
          line-height: 1.6;
          max-width: 580px;
          margin: 0;
        }

        /* ── CONTENT ── */
        .content { padding: 28px 32px; flex: 1; }

        /* ── CHAT BOX ── */
        .chat-box {
          border: 0.5px solid rgba(0,0,0,0.1);
          border-radius: 14px;
          background: #fff;
          padding: 16px;
          margin-bottom: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
        }
        .chat-box textarea {
          width: 100%;
          border: none;
          outline: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #0e0d0b;
          background: transparent;
          resize: none;
          min-height: 80px;
          line-height: 1.65;
        }
        .chat-box textarea::placeholder { color: #a09c8e; }
        .chat-footer {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 0.5px solid rgba(0,0,0,0.07);
        }
        .char-hint { font-size: 11px; color: #a09c8e; }

        .ask-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 20px;
          background: #1a1714;
          color: #fff;
          border: none;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .ask-btn:hover { opacity: 0.82; }
        .ask-btn:disabled { opacity: 0.5; cursor: default; }
        .btn-dot { width: 6px; height: 6px; border-radius: 50%; background: #b8975a; flex-shrink: 0; }

        /* ── RESPONSE ── */
        .response-card {
          background: #fff;
          border: 0.5px solid rgba(0,0,0,0.08);
          border-left: 3px solid #b8975a;
          border-radius: 0 12px 12px 0;
          padding: 16px 18px;
          margin-bottom: 24px;
          animation: fadeUp 0.3s ease;
        }
        .response-label {
          font-size: 10px;
          font-weight: 500;
          color: #b8975a;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .response-text { font-size: 13px; color: #3a3830; line-height: 1.75; white-space: pre-line; }

        /* ── FILTERS ── */
        .filter-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 18px; }
        .filter-btn {
          font-size: 11px;
          padding: 5px 13px;
          border: 0.5px solid rgba(0,0,0,0.12);
          border-radius: 20px;
          background: #fff;
          cursor: pointer;
          color: #3a3830;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.15s;
        }
        .filter-btn:hover { border-color: #b8975a; color: #0e0d0b; }
        .filter-btn.active { background: #1a1714; color: #fff; border-color: #1a1714; }

        /* ── QA CARDS ── */
        .qa-list { display: flex; flex-direction: column; gap: 10px; }
        .qa-card {
          background: #fff;
          border: 0.5px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          padding: 16px 18px;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .qa-card:hover { border-color: rgba(184,151,90,0.45); box-shadow: 0 2px 14px rgba(0,0,0,0.06); }
        .qa-card.open { border-color: #b8975a; }
        .qa-meta { font-size: 10px; font-weight: 500; color: #b8975a; letter-spacing: 0.09em; text-transform: uppercase; margin-bottom: 6px; }
        .qa-question {
          font-size: 14px; font-weight: 500; color: #0e0d0b; line-height: 1.4;
          display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;
        }
        .qa-chevron { font-size: 16px; color: #a09c8e; flex-shrink: 0; transition: transform 0.2s; display: inline-block; }
        .qa-card.open .qa-chevron { transform: rotate(180deg); }
        .qa-answer {
          font-size: 13px; color: #3a3830; line-height: 1.75;
          margin-top: 14px; padding-top: 14px;
          border-top: 0.5px solid rgba(0,0,0,0.07);
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
        .kpi-block p { margin: 0; font-size: 13px; color: #3a3830; line-height: 1.7; }
        .kpi-formula {
          font-style: italic;
          background: #f8f6f1;
          border-left: 3px solid #b8975a;
          padding: 8px 12px;
          border-radius: 0 6px 6px 0;
        }

        /* ── BA COPILOT ── */
        .story-output {
          background: #fff;
          border: 0.5px solid rgba(0,0,0,0.08);
          border-radius: 12px;
          padding: 18px;
          margin-top: 16px;
          animation: fadeUp 0.3s ease;
        }
        .story-output pre {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; color: #3a3830;
          line-height: 1.8; white-space: pre-wrap;
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
          .topbar { padding: 0 16px; overflow-x: auto; }
          .page-header { padding: 24px 20px 20px; }
          .content { padding: 20px; }
        }
      `}</style>

      <div className="app">

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <div className="logo-area">
            <div className="logo-icon">BA</div>
            <div>
              <div className="logo-text">BA Prep AI</div>
              <div className="logo-sub">AI-powered Interview Toolkit</div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Role</div>
            <div className="sidebar-val-main">Business Analyst</div>
            <div className="sidebar-val">Product Management</div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Experience</div>
            <div className="sidebar-val-main">3+ Years</div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Domains</div>
            <div className="tag-list">
              {["SaaS", "HealthTech", "Tax Platforms", "AI Products"].map((d) => (
                <span key={d} className="tag">{d}</span>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Skills</div>
            <div className="tag-list">
              {["Agile", "Stakeholder Mgmt", "Req. Gathering", "Product Thinking", "Implementation"].map((s) => (
                <span key={s} className="tag">{s}</span>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="main">

          {/* Top nav */}
          <nav className="topbar">
            {NAV_TABS.map((section) => (
              <button
                key={section}
                className={`tab-btn ${activeSection === section ? "active" : ""}`}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </button>
            ))}
          </nav>

          {/* Dynamic page header */}
          <header className="page-header">
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">{subtitle}</p>
          </header>

          {/* Content */}
          <div className="content">

            {/* ── Mock Interview ── */}
            {activeSection === "Mock Interview" && <InterviewSimulator />}

            {/* ── Ask Sarthak ── */}
            {activeSection === "Ask Sarthak" && (
              <>
                <div className="chat-box">
                  <textarea
                    placeholder="Ask about Sarthak's experience, projects, or approach…"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                  />
                  <div className="chat-footer">
                    <span className="char-hint">
                      {userQuestion.trim().length > 0
                        ? `${userQuestion.length} chars`
                        : "Ask anything — experience, decisions, tradeoffs"}
                    </span>
                    <button
                      className="ask-btn"
                      onClick={generateAnswer}
                      disabled={loading}
                    >
                      <span className="btn-dot" />
                      {loading ? "Thinking…" : "Ask Sarthak"}
                    </button>
                  </div>
                </div>

                {loading && (
                  <div className="loading-dots">
                    <span /><span /><span />
                  </div>
                )}

                {aiResponse && !loading && (
                  <div className="response-card">
                    <div className="response-label">Sarthak's Response</div>
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
                  {filteredQuestions.map((item: any) => (
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
              </>
            )}

            {/* ── BA Copilot ── */}
            {activeSection === "BA Copilot" && (
              <div>
                <div className="chat-box">
                  <textarea
                    value={featureIdea}
                    onChange={(e) => setFeatureIdea(e.target.value)}
                    placeholder="e.g. Users should be able to login using OTP verification…"
                    style={{ minHeight: "90px" }}
                  />
                  <div className="chat-footer">
                    <span className="char-hint">Describe the feature in plain language</span>
                    <button
                      className="ask-btn"
                      onClick={generateUserStory}
                      disabled={storyLoading}
                    >
                      <span className="btn-dot" />
                      {storyLoading ? "Generating…" : "Generate"}
                    </button>
                  </div>
                </div>

                {storyLoading && (
                  <div className="loading-dots">
                    <span /><span /><span />
                  </div>
                )}

                {storyOutput && !storyLoading && (
                  <div className="story-output">
                    <pre>{storyOutput}</pre>
                  </div>
                )}
              </div>
            )}

            {/* ── KPI Library ── */}
            {activeSection === "KPI Library" && <KPILibrary />}

          </div>
        </div>
      </div>
    </>
  );
}

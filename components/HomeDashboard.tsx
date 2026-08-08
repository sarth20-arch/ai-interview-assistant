  "use client";

    import type { Section } from "@/types/navigation";

  type Props = {
    onNavigate: (section: Section) => void;
  };

  const STATS = [
    { value: "50+", label: "Interview Questions" },
    { value: "5",   label: "Interviewers" },
    { value: "30+", label: "Competencies" },
    { value: "4",   label: "Learning Modules" },
  ];

  const FEATURES: {
    icon: string;
    title: string;
    badge: string;
    badgeType: "gold" | "dark" | "outline";
    description: string;
    cta: string;
    section: Section;
  }[] = [
    {
    icon: "🎯",
    title: "job-fit-intelligence",
    badge: "New",
    badgeType: "gold",
    description:
      "Analyze a Business Analyst job description, compare it with your resume, and receive recruiter-level insights, ATS analysis, and interview preparation guidance.",
    cta: "Analyze Resume",
    section: "job-fit-intelligence",
  },
    {
      icon: "🎤",
      title: "Mock Interview",
      badge: "Most Popular",
      badgeType: "dark",
      description:
        "Practice realistic Recruiter, Hiring Manager, Technical BA and Product interviews with structured coaching.",
      cta: "Start Interview",
      section: "Mock Interview",
    },
    {
      icon: "💬",
      title: "Ask Sarthak",
      badge: "AI Coach",
      badgeType: "gold",
      description:
        "Ask questions about Business Analysis, projects, stakeholder management and interview scenarios based on Sarthak's knowledge base.",
      cta: "Open Assistant",
      section: "Ask Sarthak",
    },
    {
      icon: "📝",
      title: "BA Copilot",
      badge: "Productivity",
      badgeType: "outline",
      description:
        "Generate BRDs, User Stories, Acceptance Criteria and business documentation faster.",
      cta: "Open Copilot",
      section: "BA Copilot",
    },
    {
      icon: "📈",
      title: "KPI Library",
      badge: "Learning",
      badgeType: "outline",
      description:
        "Understand KPIs, metrics and product measurements frequently asked in Business Analyst interviews.",
      cta: "Explore Library",
      section: "KPI Library",
    },
  ];

  const JOURNEY = [
    { label: "KPI Library",       section: "KPI Library" as Section },
    { label: "Ask Sarthak",       section: "Ask Sarthak" as Section },
    { label: "Mock Interview",    section: "Mock Interview" as Section },
    { label: "BA Copilot",        section: "BA Copilot" as Section },
    { label: "Interview Ready",   section: null },
  ];

  export default function HomeDashboard({ onNavigate }: Props) {
    return (
      <div className="hd-wrap">

        {/* ── Hero ── */}
        <section className="hd-hero">
          <div className="hd-hero-inner">
            <div className="hd-hero-eyebrow">BA Prep AI</div>
            <h1 className="hd-hero-title">Welcome to BA Prep AI</h1>
            <p className="hd-hero-subtitle">
              Your complete Business Analyst interview preparation platform.
            </p>
            <p className="hd-hero-support">
              Learn, practice and prepare using AI-powered tools designed
              specifically for Business Analysts.
            </p>
            <div className="hd-hero-actions">
              <button
                className="ask-btn"
                onClick={() => onNavigate("Mock Interview")}
              >
                <span className="btn-dot" />
                Start Mock Interview
              </button>
              <button
                className="hd-secondary-btn"
                onClick={() => onNavigate("Ask Sarthak")}
              >
                Ask Sarthak
              </button>
            </div>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="hd-stats">
          {STATS.map((s) => (
            <div key={s.label} className="hd-stat-card">
              <span className="hd-stat-value">{s.value}</span>
              <span className="hd-stat-label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* ── Feature Cards ── */}
        <section id="hd-features" className="hd-section">
          <div className="hd-section-header">
            <h2 className="hd-section-title">Everything You Need</h2>
            <p className="hd-section-sub">
              Four tools built around how BAs actually prepare for interviews.
            </p>
          </div>

          <div className="hd-feature-grid">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="hd-feature-card"
                onClick={() => onNavigate(f.section)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onNavigate(f.section)}
                aria-label={`Go to ${f.title}`}
              >
                <div className="hd-feature-top">
                  <span className="hd-feature-icon">{f.icon}</span>
                  <span className={`hd-badge hd-badge--${f.badgeType}`}>
                    {f.badge}
                  </span>
                </div>
                <h3 className="hd-feature-title">{f.title}</h3>
                <p className="hd-feature-desc">{f.description}</p>
                <span className="hd-feature-cta">{f.cta} →</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Journey ── */}
        <section className="hd-section hd-journey-section">
          <div className="hd-section-header">
            <h2 className="hd-section-title">Your Interview Journey</h2>
            <p className="hd-section-sub">
              A structured path from zero to interview-ready.
            </p>
          </div>

          <div className="hd-journey">
            {JOURNEY.map((step, i) => (
              <div key={step.label} className="hd-journey-item">
                <div
                  className={`hd-journey-node ${step.section ? "hd-journey-node--link" : "hd-journey-node--end"}`}
                  onClick={() => step.section && onNavigate(step.section)}
                  role={step.section ? "button" : undefined}
                  tabIndex={step.section ? 0 : undefined}
                  onKeyDown={(e) =>
                    e.key === "Enter" && step.section && onNavigate(step.section)
                  }
                >
                  <span className="hd-journey-num">{i + 1}</span>
                </div>
                <span className="hd-journey-label">{step.label}</span>
                {i < JOURNEY.length - 1 && (
                  <div className="hd-journey-connector" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </section>

        <style>{`
          .hd-wrap {
            display: flex;
            flex-direction: column;
          }

          /* ── HERO ── */
          .hd-hero {
            padding: 56px 0 48px;
            border-bottom: 1px solid rgba(148,163,184,0.16);
          }
          .hd-hero-inner { max-width: 560px; }
          .hd-hero-eyebrow {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #38bdf8;
            margin-bottom: 14px;
          }
          .hd-hero-title {
            font-family: 'DM Serif Display', serif;
            font-size: 42px;
            color: var(--foreground);
            line-height: 1.05;
            letter-spacing: -0.03em;
            margin: 0 0 16px;
          }
          .hd-hero-subtitle {
            font-size: 18px;
            font-weight: 500;
            color: rgba(226,232,240,0.88);
            line-height: 1.5;
            margin: 0 0 10px;
          }
          .hd-hero-support {
            font-size: 14px;
            color: rgba(226,232,240,0.7);
            line-height: 1.7;
            margin: 0 0 28px;
            max-width: 520px;
          }
          .hd-hero-actions {
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
          }

          /* ── SECONDARY BTN ── */
          .hd-secondary-btn {
            font-size: 13px;
            font-weight: 500;
            padding: 11px 22px;
            border: 1px solid rgba(56,189,248,0.24);
            border-radius: 14px;
            background: rgba(255,255,255,0.05);
            color: rgba(226,232,240,0.9);
            cursor: pointer;
            font-family: 'DM Sans', sans-serif;
            transition: border-color 0.15s, color 0.15s, transform 0.15s;
          }
          .hd-secondary-btn:hover {
            border-color: rgba(56,189,248,0.45);
            color: #fff;
            transform: translateY(-1px);
          }

          /* ── STATS ── */
          .hd-stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
            margin-top: 32px;
          }
          .hd-stat-card {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(148,163,184,0.16);
            border-radius: 22px;
            padding: 26px 20px;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .hd-stat-value {
            font-family: 'DM Serif Display', serif;
            font-size: 34px;
            color: #38bdf8;
            letter-spacing: -0.02em;
            line-height: 1;
          }
          .hd-stat-label {
            font-size: 12px;
            color: rgba(226,232,240,0.72);
            line-height: 1.4;
          }

          /* ── SECTION SHELL ── */
          .hd-section {
            padding: 48px 0;
            border-bottom: 1px solid rgba(148,163,184,0.16);
          }
          .hd-section-header { margin-bottom: 28px; }
          .hd-section-title {
            font-family: 'DM Serif Display', serif;
            font-size: 30px;
            color: var(--foreground);
            letter-spacing: -0.03em;
            margin: 0 0 8px;
          }
          .hd-section-sub {
            font-size: 14px;
            color: rgba(226,232,240,0.72);
            margin: 0;
            line-height: 1.65;
          }

          /* ── FEATURE GRID ── */
          .hd-feature-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          /* ── FEATURE CARD ── */
          .hd-feature-card {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(148,163,184,0.16);
            border-radius: 22px;
            padding: 24px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            gap: 12px;
            transition:
              border-color 200ms ease,
              box-shadow 200ms ease,
              transform 200ms ease;
            outline: none;
            user-select: none;
          }
          .hd-feature-card:hover {
            border-color: rgba(56,189,248,0.35);
            box-shadow: 0 22px 45px rgba(0,0,0,0.16);
            transform: translateY(-4px);
          }
          .hd-feature-card:focus-visible {
            border-color: rgba(56,189,248,0.55);
            box-shadow: 0 0 0 3px rgba(56,189,248,0.12);
          }
          .hd-feature-card:active {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.12);
          }

          .hd-feature-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .hd-feature-icon {
            font-size: 26px;
            line-height: 1;
          }

          /* ── BADGES ── */
          .hd-badge {
            font-size: 10px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 999px;
            letter-spacing: 0.05em;
            pointer-events: none;
          }
          .hd-badge--gold {
            background: rgba(56,189,248,0.12);
            color: #38bdf8;
            border: 1px solid rgba(56,189,248,0.22);
          }
          .hd-badge--dark {
            background: rgba(255,255,255,0.08);
            color: rgba(226,232,240,0.95);
            border: 1px solid rgba(255,255,255,0.08);
          }
          .hd-badge--outline {
            background: transparent;
            color: rgba(226,232,240,0.9);
            border: 1px solid rgba(148,163,184,0.18);
          }

          .hd-feature-title {
            font-size: 18px;
            font-weight: 700;
            color: var(--foreground);
            margin: 0;
            line-height: 1.25;
          }
          .hd-feature-desc {
            font-size: 14px;
            color: rgba(226,232,240,0.7);
            line-height: 1.75;
            margin: 0;
            flex: 1;
          }
          .hd-feature-cta {
            align-self: flex-start;
            font-size: 13px;
            font-weight: 600;
            color: #38bdf8;
            margin-top: 4px;
            pointer-events: none;
            transition: opacity 0.15s;
          }
          .hd-feature-card:hover .hd-feature-cta { opacity: 0.85; }

          /* ── JOURNEY ── */
          .hd-journey-section { border-bottom: none; }
          .hd-journey {
            display: flex;
            align-items: flex-start;
            overflow-x: auto;
            padding-bottom: 8px;
          }
          .hd-journey-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            flex: 1;
            min-width: 100px;
          }
          .hd-journey-node {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(255,255,255,0.06);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            position: relative;
            z-index: 1;
            transition: background 0.15s, transform 0.15s;
          }
          .hd-journey-node--link {
            cursor: pointer;
          }
          .hd-journey-node--link:hover {
            background: #38bdf8;
            transform: scale(1.06);
          }
          .hd-journey-node--end {
            background: rgba(56,189,248,0.12);
            cursor: default;
          }
          .hd-journey-num {
            font-size: 13px;
            font-weight: 700;
            color: #38bdf8;
            font-family: 'DM Serif Display', serif;
          }
          .hd-journey-node--link:hover .hd-journey-num { color: #fff; }
          .hd-journey-node--end .hd-journey-num { color: #38bdf8; }
          .hd-journey-label {
            font-size: 11px;
            font-weight: 500;
            color: rgba(226,232,240,0.75);
            text-align: center;
            margin-top: 10px;
            line-height: 1.4;
            max-width: 80px;
          }
          .hd-journey-connector {
            position: absolute;
            top: 18px;
            left: 50%;
            width: 100%;
            height: 0.5px;
            background: rgba(56,189,248,0.25);
            z-index: 0;
          }

          /* ── RESPONSIVE ── */
          @media (max-width: 640px) {
            .hd-hero-title { font-size: 32px; }
            .hd-stats { grid-template-columns: repeat(2, 1fr); }
            .hd-feature-grid { grid-template-columns: 1fr; }
            .hd-journey-label { font-size: 10px; max-width: 64px; }
          }
        `}</style>
      </div>
    );
  }
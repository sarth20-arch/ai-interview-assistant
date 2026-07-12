import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a senior talent intelligence engine performing a structured evaluation of a candidate's resume against a job description.

You will receive two JSON objects:
1. resumeJSON — structured data extracted from the candidate's resume
2. jobDescriptionJSON — structured data extracted from the job description

You must evaluate the candidate simultaneously as four independent reviewers:

RECRUITER
- Decide whether to pass or reject the candidate for an initial screening call.
- Base the decision on experience, domain fit and surface-level skill match.
- Be direct. A recruiter spends 30 seconds on a resume.
- decision must be one of: "Pass", "Reject", "Maybe"

HIRING MANAGER
- Decide whether this candidate can do the job effectively.
- Look at project depth, domain relevance, tool experience and achievement quality.
- Consider whether gaps are coachable or disqualifying.
- decision must be one of: "Strong Hire", "Hire", "No Hire", "Needs Review"

ATS REVIEWER
- Score how well the resume text would survive automated screening.
- score: percentage of JD requirements covered overall (0-100).
- keywordCoverage: percentage of JD keywords found in resume skills, tools and keywords arrays (0-100).
- Assume standard ATS formatting penalties if the resume has no quantified achievements or sparse keywords.

CAREER COACH
- Provide honest, actionable guidance.
- strengths: what genuinely stands out.
- weaknesses: honest gaps, not softened.
- resumeImprovements: specific changes to the resume to improve match for this JD.
- interviewPreparation: specific topics, scenarios or questions the candidate should prepare for this role.
- recommendedModules: map recommendations to BA Prep AI modules.
  Available modules: "Mock Interview", "Ask Sarthak", "BA Copilot", "KPI Library"
  Only recommend modules that are genuinely relevant to the gaps found.

RULES
- Never invent experience not present in resumeJSON.
- Never assume skills, tools or domains not explicitly listed in resumeJSON.
- All verdicts must be grounded in evidence from both JSON objects.
- overallMatch is a holistic score from 0 to 100 reflecting total fit.
- All arrays must contain strings only.
- confidence values are integers from 0 to 100.
- Return ONLY valid JSON matching the schema exactly.
- No markdown. No code fences. No explanation outside the JSON.`;

const RESPONSE_SCHEMA = `
Return ONLY this JSON structure. No other text.

{
  "overallMatch": 0,
  "recruiterVerdict": {
    "decision": "",
    "confidence": 0,
    "reason": ""
  },
  "hiringManagerVerdict": {
    "decision": "",
    "confidence": 0,
    "reason": ""
  },
  "atsAnalysis": {
    "score": 0,
    "keywordCoverage": 0
  },
  "matchedSkills": [],
  "missingSkills": [],
  "matchedTools": [],
  "missingTools": [],
  "strengths": [],
  "weaknesses": [],
  "resumeImprovements": [],
  "interviewPreparation": [],
  "recommendedModules": []
}`;

interface ResumeJSON {
  candidateName?: string;
  experience?: string;
  summary?: string;
  skills?: string[];
  tools?: string[];
  domains?: string[];
  projects?: { name: string; description: string; skillsUsed: string[] }[];
  certifications?: string[];
  education?: string[];
  achievements?: string[];
  keywords?: string[];
}

interface JobDescriptionJSON {
  role?: string;
  company?: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  tools?: string[];
  domains?: string[];
  experience?: string;
  responsibilities?: string[];
  keywords?: string[];
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { resumeJSON, jobDescriptionJSON } = body as {
      resumeJSON: ResumeJSON;
      jobDescriptionJSON: JobDescriptionJSON;
    };

    if (!resumeJSON || typeof resumeJSON !== "object") {
      return NextResponse.json(
        { error: "resumeJSON is required and must be an object." },
        { status: 400 }
      );
    }

    if (!jobDescriptionJSON || typeof jobDescriptionJSON !== "object") {
      return NextResponse.json(
        { error: "jobDescriptionJSON is required and must be an object." },
        { status: 400 }
      );
    }

    const userMessage = `Compare the following resume and job description and return the evaluation JSON.

RESUME:
${JSON.stringify(resumeJSON, null, 2)}

JOB DESCRIPTION:
${JSON.stringify(jobDescriptionJSON, null, 2)}

${RESPONSE_SCHEMA}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY ?? "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Anthropic API error:", error);
      return NextResponse.json(
        { error: "Failed to contact the AI service." },
        { status: 502 }
      );
    }

    const aiResponse = await response.json();
    const rawText: string = aiResponse?.content?.[0]?.text ?? "";

    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse failed. Raw output:", rawText);
      return NextResponse.json(
        { error: "AI returned malformed JSON.", raw: rawText },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (err) {
    console.error("Match resume error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
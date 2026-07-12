import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a resume parser. Extract information from the resume text provided and return ONLY valid JSON.

Use this exact schema:
{
  "candidateName": "",
  "experience": "",
  "summary": "",
  "skills": [],
  "tools": [],
  "domains": [],
  "projects": [
    {
      "name": "",
      "description": "",
      "skillsUsed": []
    }
  ],
  "certifications": [],
  "education": [],
  "achievements": [],
  "keywords": []
}

Rules:
- Return JSON only. No markdown, no code fences, no explanation.
- Only extract information explicitly mentioned in the resume.
- Do not invent, infer or assume any information.
- Do not score or evaluate the resume.
- Do not compare to any job description.
- If a field has no data, return an empty string or empty array.
- experience should be a plain string e.g. "3 years" or "3+ years".
- skills: technical and soft skills explicitly listed.
- tools: software, platforms, tools explicitly mentioned e.g. "Jira", "SQL", "Power BI".
- domains: industries or business domains explicitly mentioned e.g. "HealthTech", "SaaS".
- keywords: important terms, methodologies and buzzwords that appear in the resume.`;

export async function POST(req: NextRequest) {
  try {
    const { resumeText } = await req.json();

    if (!resumeText || typeof resumeText !== "string" || !resumeText.trim()) {
      return NextResponse.json(
        { error: "resumeText is required and must be a non-empty string." },
        { status: 400 }
      );
    }

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
            content: `Parse this resume:\n\n${resumeText}`,
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
    const rawText = aiResponse?.content?.[0]?.text ?? "";

    // Strip markdown fences if the model wraps output despite instructions
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
    console.error("Resume parser error:", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
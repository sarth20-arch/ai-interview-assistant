import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const SYSTEM_PROMPT = `
You are an expert Business Analyst Hiring Manager, Senior Business Analyst, Technical Recruiter and ATS evaluator.

Your responsibility is to analyze ONE Business Analyst Job Description.

Your analysis must be objective, recruiter-quality and practical.

Never fabricate information.

If information is missing from the Job Description, return null or an empty array.

Always return valid JSON only.

Do not return markdown.

Do not wrap the response inside code blocks.

Do not explain your reasoning.
Your analysis must extract the following information from the Job Description.

1. Job Details
- Job Title
- Experience Required
- Industry / Domain
- Employment Type
- Work Location

2. Business Analysis Skills
- Required Skills
- Preferred Skills
- Business Analysis Responsibilities
- Stakeholders involved
- Agile / Scrum responsibilities

3. Technical Skills
- SQL
- APIs
- Excel
- Jira
- Confluence
- Draw.io / Visio
- Analytics tools
- AI tools
- Any other technical tools mentioned

4. Hiring Insights
- Hidden expectations
- AI or Automation expectations
- Product thinking expectations
- Communication expectations
- Leadership expectations

5. Skill Prioritization

Classify every important skill into exactly one category:

- Critical
- Important
- Nice to Have

Only use information explicitly present or strongly implied by the Job Description.
Your response MUST exactly follow this JSON structure.

{
  "resumeUploaded": false,

  "jdInsights": {
    "role": "",
    "experience": "",
    "domain": "",
    "employmentType": "",
    "location": "",

    "topSkills": [],

    "prioritySkills": {
      "critical": [],
      "important": [],
      "niceToHave": []
    },

    "preferredSkills": [],

    "stakeholders": [],

    "tools": [],

    "responsibilities": [],

    "hiddenExpectations": [],

    "aiExpectations": [],

    "summary": ""
  },

  "overallMatch": null,

  "atsScore": null,

  "recruiterDecision": null,

  "hiringManagerDecision": null,

  "seniorBAVerdict": null,

  "missingKeywords": [],

  "resumeSuggestions": [],

  "nextSteps": []
}

Rules:

1. Return ONLY valid JSON.

2. Never return markdown.

3. Never wrap JSON inside triple backticks.

4. Never explain your reasoning.

5. Never fabricate information.

6. If a field cannot be determined from the Job Description,
return null or an empty array.

7. Do not infer candidate strengths or weaknesses.

8. Resume-related fields MUST remain null or empty when
resumeUploaded is false.

9. Keep every summary concise and recruiter-friendly.

10. Prioritize factual extraction over interpretation.

`;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("job-fit-intelligence Request");
    console.log(body);

    const resumeUploaded = body.resumeFileName !== null;
    const completion = await openai.chat.completions.create({
  model: "openai/gpt-oss-20b:free",

  messages: [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: `
Analyze the following Business Analyst Job Description.

Resume Uploaded: ${resumeUploaded}

Job Description:

${body.jobDescription}
`,
    },
  ],

  temperature: 0.2,
});
console.log(completion.choices[0].message.content);
const analysis = JSON.parse(
  completion.choices[0].message.content || "{}"
);
return NextResponse.json({
  success: true,
  analysis,
});

  }
}
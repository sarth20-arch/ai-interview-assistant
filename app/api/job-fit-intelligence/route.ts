import { NextResponse } from "next/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

async function extractTextFromPdf(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
  const pdfDocument = await loadingTask.promise;

  let extractedText = "";

  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
    const page = await pdfDocument.getPage(pageNumber);
    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) =>
        item && typeof item === "object" && "str" in item && typeof item.str === "string"
          ? item.str
          : ""
      )
      .join(" ");

    extractedText += pageText + "\n";
  }

  return extractedText.trim();
}

const SYSTEM_PROMPT = `
You are an expert Business Analyst Hiring Manager, Senior Business Analyst, Technical Recruiter and ATS evaluator.

Your responsibility is to analyze a Business Analyst Job Description and, when a resume is uploaded, evaluate the candidate against that Job Description.

Your analysis must be objective, recruiter-quality and practical.

Never fabricate information.

If information is missing from the Job Description, return null or an empty array.

Always return valid JSON only.

Do not return markdown.

Do not wrap the response inside code blocks.

Do not explain your reasoning.

Do not infer candidate skills, experience, or domain expertise unless they are explicitly shown in the provided resume text.

If a resume file was uploaded, resumeUploaded must be true. If no file was uploaded, resumeUploaded must be false.

Do not let the presence or absence of resume data be decided by the analysis. The server will supply resumeUploaded.

If a resume file was uploaded but resume text is unavailable, the analysis can still indicate that resume comparison fields are empty, but do not invent candidate details.

When resumeUploaded is true, use the following judgments for comparison fields:
- Strong Match
- Partial Match
- Missing

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
  "resumeUploaded": null,

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

  "overallMatch": 0,
  "atsScore": 0,
  "experienceMatch": "",
  "domainMatch": "",
  "skillMatch": "",
  "criticalSkillCoverage": "",
  "recruiterDecision": "",
  "hiringManagerDecision": "",
  "seniorBAVerdict": "",
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
11. When resumeUploaded is true, the resume comparison is mandatory.

Evaluate the candidate against the Job Description using these dimensions:

A. Experience Match
- Compare required experience with the candidate's actual experience.
- Identify whether the candidate meets, partially meets, or falls short of the requirement.

B. Skill Match
- Compare the candidate's demonstrated skills against the critical and important JD skills.
- Do not assume a skill exists just because it is related to another skill.

C. Domain Match
- Compare the candidate's actual domain/project experience with the JD domain.
- Clearly distinguish direct domain experience from transferable experience.

D. ATS Compatibility
- Evaluate keyword and skill alignment between the resume and JD.
- Do not invent keywords that are not present in either document.

E. Recruiter Evaluation
- Decide whether the resume is likely to be shortlisted.
- Give a concise reason based only on the evidence.

F. Hiring Manager Evaluation
- Decide whether the candidate appears capable of performing the role.
- Identify the strongest evidence and the biggest concern.

G. Senior BA Evaluation
- Evaluate BA maturity, ownership, requirements skills, stakeholder management,
  delivery experience and technical understanding.

H. Missing Keywords
- List important JD terms that are absent or insufficiently demonstrated in the resume.

I. Resume Improvements
- Give specific improvements based on the actual resume and JD.
- Do not invent achievements, metrics, tools or responsibilities.

J. Interview Preparation
- Generate preparation topics based on the actual gaps and requirements of the JD.

For scoring:
- overallMatch must be between 0 and 100.
- atsScore must be between 0 and 100.
- Scores must reflect the evidence found in the resume and Job Description.
- Do not automatically give high scores.
- Do not use 0 merely because information is incomplete.
- If the resume provides insufficient evidence for a specific assessment,
  use "Insufficient data" rather than guessing.

Base every comparison only on the provided resume and Job Description.
`;

export async function POST(request: Request) {
  try {
   const formData = await request.formData();

const jobDescription = formData.get("jobDescription")?.toString() || "";

const resumeFile = formData.get("resume") as File | null;
    const resumeFilename = resumeFile?.name ?? null;

    console.log("job-fit-intelligence Request");
    const resumeUploaded = !!resumeFile;
    let resumeText = "";

if (resumeFile) {
  try {
    resumeText = await extractTextFromPdf(resumeFile);

    console.log("========================================");
    console.log("Resume File:", resumeFile.name);
    console.log("Resume extracted characters:", resumeText.length);
    console.log("Resume extraction succeeded: true");
    console.log("========================================");
  } catch (pdfError) {
    console.error("Failed to parse resume PDF:", pdfError);
    resumeText = "";
    console.log("Resume File:", resumeFile.name);
    console.log("Resume extraction succeeded: false");
  }
}

console.log("========================================");
console.log("RESUME CHECK");
console.log("Filename:", resumeFilename);
console.log("Uploaded:", resumeUploaded);
console.log("Extraction success:", resumeUploaded ? resumeText.length > 0 : false);
console.log("Resume characters:", resumeText.length);
console.log("Resume available:", resumeText.length > 0);
console.log("========================================");
    if (!jobDescription.trim()) {
  return NextResponse.json(
    {
      success: false,
      message: "Job Description is required.",
    },
    {
      status: 400,
    }
  );
} 

console.log({
  jobDescriptionLength: jobDescription.length,
  resumeUploaded,
  resumeFilename,
  resumeTextLength: resumeText.length,
});
    const llmResumeText = resumeUploaded
      ? resumeText || "Resume was uploaded, but text extraction failed."
      : "No resume was uploaded.";

    const completion = await openai.chat.completions.create({
  model: "openai/gpt-oss-20b",

  messages: [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: `
You have two documents.

DOCUMENT 1 — JOB DESCRIPTION
${jobDescription}

DOCUMENT 2 — CANDIDATE RESUME
${llmResumeText}

ResumeUploaded: ${resumeUploaded}

TASK:

First extract the important requirements from the Job Description.

Then, if a resume is available and text is present, compare the candidate's actual experience against those requirements.

If a resume file was uploaded but no text is available, do not invent candidate information and keep resume-related comparison fields null or empty.

Do not analyze the resume in isolation.
Do not analyze the Job Description in isolation.

The final output must reflect the relationship between the two documents.

Determine:
- Experience match
- Skill match
- Domain match
- ATS compatibility
- Recruiter decision
- Hiring manager decision
- Senior BA assessment
- Missing keywords
- Resume improvements
- Interview preparation priorities

Return ONLY the JSON structure defined in the system instructions.
`,
    }
  ],

  temperature: 0.2,
});
console.log(completion.choices[0].message.content);

let analysis: any;
try {
  analysis = JSON.parse(
    completion.choices[0].message.content || "{}"
  );
} catch (parseError) {
  console.error("Failed to parse LLM JSON response:", parseError);
  console.error("Raw LLM output:", completion.choices[0].message.content);
  return NextResponse.json(
    {
      success: false,
      message: "AI returned invalid JSON. Please try again.",
    },
    {
      status: 502,
    }
  );
}

analysis.resumeUploaded = resumeUploaded;
analysis.resumeFilename = resumeFilename;

return NextResponse.json({
  success: true,
  analysis,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}
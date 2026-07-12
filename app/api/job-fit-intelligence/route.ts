import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("job-fit-intelligence Request");
    console.log(body);

    const resumeUploaded = body.resumeFileName !== null;

    const jdInsights = {
      role: "Business Analyst",
      experience: "2–4 Years",
      domain: "Revenue Operations",
      topSkills: [
        "Business Analysis",
        "Requirement Gathering",
        "Stakeholder Management",
        "SQL",
        "Agile",
        "User Stories",
      ],
      hiddenExpectations: [
        "AI Adoption",
        "Revenue Operations",
        "Cross-functional Collaboration",
      ],
    };

    const summary = resumeUploaded
      ? "Your profile aligns well with this Business Analyst role. Your implementation experience and stakeholder management are strong, but highlighting AI adoption, RevOps exposure and measurable business outcomes would strengthen your application."
      : "This role expects strong functional BA skills with exposure to Revenue Operations and AI tools. Review the top skills and hidden expectations above to identify gaps before applying.";

    const analysis = resumeUploaded
      ? {
          resumeUploaded: true,
          jdInsights,
          overallMatch: 86,
          atsScore: 82,
          recruiterDecision: "Shortlist",
          hiringManagerDecision: "Proceed to Interview",
          seniorBAVerdict:
            "Strong Functional BA. Product ownership could be stronger.",
          missingKeywords: [
            "Salesforce",
            "Confluence",
            "Revenue Operations",
            "Automation",
          ],
          resumeSuggestions: [
            "Quantify project impact.",
            "Mention AI tools used.",
            "Highlight stakeholder communication.",
            "Add measurable achievements.",
          ],
          nextSteps: [
            "Learn Revenue Operations basics.",
            "Revise Salesforce concepts.",
            "Prepare AI workflow examples.",
            "Practice stakeholder management scenarios.",
          ],
          summary,
        }
      : {
          resumeUploaded: false,
          jdInsights,
          overallMatch: null,
          atsScore: null,
          recruiterDecision: null,
          hiringManagerDecision: null,
          seniorBAVerdict: null,
          missingKeywords: [],
          resumeSuggestions: [],
          nextSteps: [],
          summary,
        };

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}
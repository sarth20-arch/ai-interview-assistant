import OpenAI from "openai";

import profileContext from "../../../data/profile_context";
import contextMap from "../../../data/contextMap";

import projects from "../../../data/projects.json";
import behavioral from "../../../data/behavioral.json";
import starStories from "../../../data/star_stories.json";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const userMessage = body.message.toLowerCase();

    let dynamicContext = "";
    let knowledgeContext = "";

    // Dynamic Context Selection

if (
  userMessage.includes("fitrofy") ||
  userMessage.includes("healthtech") ||
  userMessage.includes("partnership") ||
  userMessage.includes("white label")
) {
  dynamicContext = `
Use the Fitrofy project from the Knowledge Base.
Focus on partnerships, integrations, white-label opportunities,
business discussions, requirement gathering and interactions
with C-level executives.
`;
} else if (userMessage.includes("stakeholder")) {
  dynamicContext = contextMap.stakeholder;
} else if (userMessage.includes("agile")) {
  dynamicContext = contextMap.agile;
} else if (
  userMessage.includes("kpi") ||
  userMessage.includes("metrics")
) {
  dynamicContext = contextMap.kpi;
} else if (userMessage.includes("product")) {
  dynamicContext = contextMap.product;
} else if (userMessage.includes("implementation")) {
  dynamicContext = contextMap.implementation;
}

    // Knowledge Retrieval
// Knowledge Retrieval
console.log(projects);
console.log(typeof projects);
console.log(Array.isArray(projects));
const projectKnowledge = projects.filter((project: any) => {
  const combinedText = `
    ${project.projectName}
    ${project.summary}
    ${project.objective}
    ${project.challenge}
    ${project.outcome}
    ${project.skills?.join(" ")}
    ${project.keywords?.join(" ")}
  `.toLowerCase();

  return (
    combinedText.includes(userMessage) ||
    project.keywords?.some((keyword: string) =>
      userMessage.includes(keyword.toLowerCase())
    )
  );
});

const qaKnowledge = [...behavioral, ...starStories].filter(
  (item: any) => {
    const combinedText = JSON.stringify(item).toLowerCase();

    return (
      (userMessage.includes("stakeholder") &&
        combinedText.includes("stakeholder")) ||

      (userMessage.includes("agile") &&
        combinedText.includes("agile")) ||

      (userMessage.includes("requirement") &&
        combinedText.includes("requirement")) ||

      (userMessage.includes("implementation") &&
        combinedText.includes("implementation"))
    );
  }
);

const projectContext = projectKnowledge
  .slice(0, 2)
  .map(
    (project: any) => `
Project: ${project.projectName}

Summary: ${project.summary}

Objective: ${project.objective}

Challenge: ${project.challenge}

Actions:
${project.actions.join(", ")}

Outcome: ${project.outcome}
`
  )
  .join("\n\n");

const qaContext = qaKnowledge
  .slice(0, 3)
  .map(
    (item: any) =>
      `Question: ${item.question || item.scenario}
Answer: ${item.answer || item.result || item.action}`
  )
  .join("\n\n");

knowledgeContext = `
${projectContext}

${qaContext}
`;
 console.log(
  "OPENROUTER_API_KEY loaded:",
  !!process.env.OPENROUTER_API_KEY
);

    const completion =
      await openai.chat.completions.create({
        model: "google/gemma-4-31b-it:free",

        messages: [
          {
            role: "system",
            content: `
${profileContext}

Additional Context:
${dynamicContext}

Knowledge Base: (use these examples whenever possible and do not invent a different project if a relevant example exists):
${knowledgeContext}

Important:
- Answer as Sarthak Srivastava.
- Prefer using the provided Knowledge Base examples.
- If a relevant example exists, use it instead of creating a new scenario.
- Do not invent project details that are not present in the provided experience.
- Stay grounded in the supplied examples.
- Use provided experience when relevant.
- Keep answers conversational.
- Avoid generic AI language.
- Keep answers concise unless more detail is requested.
- If an outcome is not explicitly provided in the knowledge base, do not invent one.
- When information is unavailable, state the actions taken rather than creating metrics or results.

When answering project-related questions:
- Prefer using projectName, elevatorPitch and biggestContribution.
- If a project is marked mostSignificantProject=true, use it when asked about the most significant project.
- Prefer actual project examples over generic examples.
- Use stakeholder lists when discussing stakeholder management.
- Use implementationExperience when discussing implementation.
- Do not invent project details not present in the knowledge base.
- If the question asks about a project, first look for matching project information in the Knowledge Base before generating a response.
- Highlight personal contribution before describing the project.
- Prefer explaining what Sarthak personally owned and delivered.
- When discussing the Tax Officer Management Platform, mention end-to-end implementation involvement when relevant.
`,
          },
          {
            role: "user",
            content: body.message,
          },
        ],
      });

    return Response.json({
      reply:
        completion.choices[0].message.content ||
        "No response generated.",
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}

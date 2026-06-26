"use server";

import { GoogleGenerativeAI, Schema, SchemaType } from "@google/generative-ai";
import { MissionAnalysis, InitialMissionInput, RenegotiationInput } from "@/types/mission";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const missionSchema = {
  type: SchemaType.OBJECT,
  properties: {
    feasible: { type: SchemaType.BOOLEAN },
    conflict: {
      type: SchemaType.OBJECT,
      properties: {
        required: { type: SchemaType.NUMBER },
        available: { type: SchemaType.NUMBER },
      },
      required: ["required", "available"],
    },
    strategies: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING },
          label: { type: SchemaType.STRING },
          success: { type: SchemaType.NUMBER, description: "Success probability percentage (0-100)" },
          sacrifice_score: { type: SchemaType.NUMBER, description: "A score from 1 to 10 indicating how painful the required cuts are." },
          cuts: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          reason: { type: SchemaType.STRING },
        },
        required: ["id", "label", "success", "sacrifice_score", "cuts", "reason"],
      },
    },
    recommended: { type: SchemaType.STRING, nullable: true },
    rejected_alternatives_summary: { type: SchemaType.STRING },
    evidence_reviewed: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    primary_risks: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    milestones: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          expected_day: { type: SchemaType.NUMBER },
          critical: { type: SchemaType.BOOLEAN },
        },
        required: ["title", "expected_day", "critical"],
      },
    },
  },
  required: [
    "feasible",
    "conflict",
    "strategies",
    "recommended",
    "rejected_alternatives_summary",
    "evidence_reviewed",
    "primary_risks",
    "milestones",
  ],
} as Schema;

const systemInstruction = `Evaluate the mission feasibility.
Calculate required vs available effort.
Produce exactly three strategies.
Recommend exactly one strategy.
Generate milestones.
Explicitly list the external evidence you reviewed in 'evidence_reviewed' (e.g. "Parsed README", "14 Open Issues").
Return only structured output.
No markdown.
No prose.
No explanations outside schema.`;

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction,
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: missionSchema,
  },
});

export async function analyzeMission(
  input: InitialMissionInput | RenegotiationInput,
  retryCount = 0
): Promise<MissionAnalysis> {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  
  let promptText = "";
  if ("delayedMilestone" in input) {
    promptText = `RENEGOTIATION REQUIRED.
A schedule drift occurred:
Milestone: "${input.delayedMilestone}"
Expected Day: ${input.expectedDay}
Actual Day: ${input.actualDay}
Delay: ${input.actualDay - input.expectedDay} days.

Original Mission Constraints & Plan:
${JSON.stringify(input.originalMission, null, 2)}

Task: Re-evaluate constraints based on this delay. Generate a COMPLETE new MissionAnalysis object.
Include 'evidence_reviewed' to reflect the drift analysis.
If no feasible strategy exists, return feasible=false, strategies=[], recommended=null.`;
  } else {
    promptText = `MISSION INTAKE
User Description: ${input.description}
${input.githubData ? `\nExternal Evidence (GitHub Repository Data):\n${input.githubData}` : ""}

Task: Generate a COMPLETE MissionAnalysis based on the provided inputs. Deriving complexity and missing work from the external evidence if provided.`;
  }

  try {
    const result = await model.generateContent(promptText);
    const text = result.response.text();
    const parsed: MissionAnalysis = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error("AI Pipeline Error:", error);
    if (retryCount < 1) {
      console.warn("JSON parse or generation failed, retrying once...");
      return analyzeMission(input, retryCount + 1);
    }
    throw new Error("Failed to generate valid mission plan after multiple attempts. Please retry.");
  }
}

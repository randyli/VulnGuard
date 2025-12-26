import { GoogleGenAI, Type } from "@google/genai";
import { SastIssue, AIFixResponse } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeIssueWithGemini = async (issue: SastIssue): Promise<AIFixResponse> => {
  const modelId = "gemini-3-flash-preview"; 

  const prompt = `
    You are a Senior Security Engineer and Code Reviewer. 
    Analyze the following Static Application Security Testing (SAST) issue.
    
    Issue: ${issue.title}
    Description: ${issue.description}
    Rule ID: ${issue.ruleId}
    File: ${issue.filePath}
    
    Vulnerable Code Snippet:
    \`\`\`
    ${issue.snippet}
    \`\`\`
    
    Provide a detailed analysis, a secure code fix, and an explanation of why the fix works.
    Return the response in JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: "Brief analysis of the vulnerability context."
            },
            suggestedFix: {
              type: Type.STRING,
              description: "The corrected code snippet."
            },
            explanation: {
              type: Type.STRING,
              description: "Why this fix resolves the security issue."
            }
          },
          required: ["analysis", "suggestedFix", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AIFixResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to generate AI fix suggestion.");
  }
};

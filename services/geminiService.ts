import { GoogleGenAI, Type } from "@google/genai";
import { SastIssue, AIFixResponse } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeIssueWithGemini = async (issue: SastIssue): Promise<AIFixResponse> => {
  // Using gemini-3-pro-preview for better coding and reasoning capabilities
  const modelId = "gemini-3-pro-preview"; 

  const prompt = `
    Analyze the following Static Application Security Testing (SAST) issue.
    
    Issue Title: ${issue.title}
    Vulnerability Type (Rule ID): ${issue.ruleId}
    File Path: ${issue.filePath}
    Description: ${issue.description}
    
    Vulnerable Code:
    \`\`\`
    ${issue.snippet}
    \`\`\`
    
    Task:
    1. Explain the vulnerability in the context of this code.
    2. Provide a specific, secure code fix that replaces the vulnerable snippet.
    3. Explain why the fix is secure.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert Application Security Engineer. You provide precise, secure code remediation. Your explanations are concise and educational.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.STRING,
              description: "A concise analysis of why the code is vulnerable."
            },
            suggestedFix: {
              type: Type.STRING,
              description: "The corrected code block. Do not include markdown backticks."
            },
            explanation: {
              type: Type.STRING,
              description: "A brief explanation of the security mechanism in the fix."
            }
          },
          required: ["analysis", "suggestedFix", "explanation"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text) as AIFixResponse;
    
    // Clean up if the model includes backticks despite instructions
    result.suggestedFix = result.suggestedFix.replace(/^```\w*\n?/, '').replace(/\n?```$/, '');
    
    return result;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to generate AI fix suggestion.");
  }
};

import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, JobDetails, CoverLetterResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

/**
 * Uses Gemini with Search Grounding to find details about a job from a link.
 */
export async function analyzeJobLink(link: string): Promise<JobDetails> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze this job application link and provide structured details: ${link}. 
    Focus on the Job Title, Company Name, Key Technical/Soft Skill Requirements, and Company Culture.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          company: { type: Type.STRING },
          requirements: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          culture: { type: Type.STRING },
          summary: { type: Type.STRING }
        },
        required: ["title", "company", "requirements", "summary"]
      }
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    throw new Error("Failed to parse job analysis results.");
  }
}

/**
 * Generates an impeccable cover letter by matching profile data with job requirements.
 */
export async function generateCoverLetter(
  job: JobDetails, 
  profile: UserProfile
): Promise<CoverLetterResponse> {
  const profileContext = `
    User Name: ${profile.name}
    User Bio: ${profile.bio}
    Skills: ${profile.skills.join(", ")}
    Supporting Documents Text: ${profile.documents.map(d => d.content).join("\n\n")}
  `;

  const jobContext = `
    Job Title: ${job.title}
    Company: ${job.company}
    Requirements: ${job.requirements.join(", ")}
    Company Culture: ${job.culture}
    Job Summary: ${job.summary}
  `;

  const prompt = `
    Act as a world-class career coach. 
    Using the User Profile and Job Details provided below, create an impeccable, professional, and highly persuasive cover letter.
    
    CRITICAL INSTRUCTIONS:
    1. Identify specific "touchpoints" where the user's skills/experience directly solve the company's needs.
    2. Maintain a professional yet enthusiastic tone that matches the company culture.
    3. Ensure the cover letter is structured: Header, Salutation, Hook, Body (Evidence/Touchpoints), Call to Action, Sign-off.
    4. Provide a list of the touchpoints you identified and suggestions for the user to improve the application further.

    USER PROFILE:
    ${profileContext}

    JOB DETAILS:
    ${jobContext}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: { type: Type.STRING, description: "The full text of the cover letter in Markdown format." },
          touchpoints: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of key matching points found between user and job."
          },
          suggestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Tips for tailoring the application further."
          }
        },
        required: ["content", "touchpoints", "suggestions"]
      }
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    throw new Error("Failed to generate cover letter.");
  }
}

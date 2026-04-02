import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeNews(text: string): Promise<AnalysisResult> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following news text for authenticity. Provide a prediction (Real or Fake), a confidence score (0-1), and a brief explanation of why.
    
    News Text: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prediction: {
            type: Type.STRING,
            enum: ["Real", "Fake"],
            description: "The authenticity prediction"
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence score from 0 to 1"
          },
          explanation: {
            type: Type.STRING,
            description: "Brief reasoning for the prediction"
          }
        },
        required: ["prediction", "confidence", "explanation"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  return {
    prediction: result.prediction || "Fake",
    confidence: result.confidence || 0.5,
    explanation: result.explanation || "No explanation provided."
  };
}


import { GoogleGenAI, Type } from "@google/genai";
import { Student, RecognitionResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const recognizeStudent = async (
  capturedImageBase64: string,
  roster: Student[]
): Promise<RecognitionResponse> => {
  try {
    const rosterContext = roster.map(s => `ID: ${s.id}, Name: ${s.name}, Grade: ${s.grade}`).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              text: `You are a high-security Biometric Liveness Engine. 
              TASK 1: LIVENESS CHECK. 
              Determine if the image is a LIVE human or a reproduction (photo, screen, mask).
              Look for: Screen moiré patterns, glare on glass, paper borders, or 2D flatness.
              
              TASK 2: IDENTIFICATION.
              Compare the live human against this roster:
              ${rosterContext}
              
              STRICT RULES:
              - If it's a photo of a photo/screen, set isLive: false.
              - Only if isLive: true, attempt identification.
              
              Return strict JSON.`
            },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: capturedImageBase64.split(',')[1] || capturedImageBase64
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            studentId: { type: Type.STRING, nullable: true },
            confidence: { type: Type.NUMBER },
            isLive: { type: Type.BOOLEAN, description: "True only if subject is a physical live person" },
            name: { type: Type.STRING },
            reasoning: { type: Type.STRING }
          },
          required: ["studentId", "confidence", "isLive"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini recognition error:", error);
    return { studentId: null, confidence: 0, isLive: false, reasoning: "Security Protocol Error" };
  }
};

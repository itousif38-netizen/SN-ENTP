
import { GoogleGenAI, Type } from "@google/genai";
import { EstimateItem } from "../types.ts";

// Always use process.env.API_KEY exclusively.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// The responseSchema must use object literals as per guidelines.
const estimateSchema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING, description: "Name of the material or labor task" },
          quantity: { type: Type.NUMBER, description: "Estimated quantity needed" },
          unit: { type: Type.STRING, description: "Unit of measurement (e.g., hours, sqft, pcs)" },
          unitPrice: { type: Type.NUMBER, description: "Estimated price per unit in Indian Rupees (INR)" },
          total: { type: Type.NUMBER, description: "Total cost for this item (quantity * unitPrice)" }
        },
        required: ["description", "quantity", "unit", "unitPrice", "total"]
      }
    }
  },
  required: ["items"]
};

// Use gemini-3-pro-preview for complex reasoning tasks like cost estimation.
export const generateConstructionEstimate = async (projectDescription: string): Promise<EstimateItem[]> => {
  if (!navigator.onLine) {
    throw new Error("You are currently offline. Please connect to the internet to use AI features.");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate a detailed construction cost estimate for the following project: "${projectDescription}". 
      Break it down into materials and labor. Be realistic with current market prices in India (INR).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: estimateSchema,
        systemInstruction: "You are an expert construction estimator. Provide detailed, itemized lists of materials and labor required for construction projects. Be precise with units and conservative with pricing in Indian Rupees."
      }
    });

    // Access text as a property of GenerateContentResponse.
    const text = response.text;
    if (!text) return [];

    const data = JSON.parse(text.trim());
    return data.items || [];
  } catch (error) {
    console.error("Error generating estimate:", error);
    throw error;
  }
};

// Use gemini-3-flash-preview for general-purpose chatbot tasks.
export const chatWithSuperintendent = async (history: { role: string; parts: { text: string }[] }[], newMessage: string) => {
  if (!navigator.onLine) {
    return "Connection lost. I am in offline mode. I will be back when the internet is restored.";
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      // History is passed to maintain context between turns.
      config: {
        systemInstruction: "You are a seasoned Construction Site Superintendent with 30 years of experience in India. You are knowledgeable about IS codes, safety regulations, project scheduling, concrete, framing, electrical, and plumbing basics. You are tough but helpful, prioritizing safety and quality above all else. Keep answers concise and actionable."
      }
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
};

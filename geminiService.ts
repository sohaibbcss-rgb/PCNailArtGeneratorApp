import { GoogleGenAI } from "@google/genai";
import { NailDesignState } from "../types";

const MODEL_NAME = "gemini-2.5-flash-image";

export const generateNailArt = async (
  originalImageBase64: string,
  design: NailDesignState
): Promise<string> => {
  // Use the API key securely from Vercel environment variables
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    throw new Error("API Key is missing. Please configure VITE_API_KEY in Vercel Settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Clean base64 string (remove data:image/png;base64, prefix if present)
  const cleanBase64 = originalImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  // Construct a precise prompt for the model
  let prompt = `
    Act as a professional beauty editor. Edit the attached photo of a hand.
    Goal: Apply a photorealistic nail art design to the fingernails.
    
    Strict Constraints:
    1. PRESERVE the original hand's skin tone, lighting, shadows, and finger positions exactly. Do not regenerate the hand or background.
    2. Only modify the fingernails.
    3. Ensure the nail edges are sharp and realistic (perfect segmentation).
    4. Apply realistic lighting reflections to the nails matching the scene.
    
    Design Specifications:
    - Nail Shape: ${design.shape}
    - Nail Length: ${design.length}
    - Finish/Texture: ${design.finish}
  `;

  if (design.patternPrompt) {
    prompt += `\n- Design/Pattern: ${design.patternPrompt}`;
    prompt += `\n- Base Color: Use ${design.color} as a base if the design allows, or integrate it.`;
  } else {
    prompt += `\n- Color: Solid color ${design.color}.`;
  }

  prompt += `\n\nOutput the result as a high-quality image.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/png",
              data: cleanBase64
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("No content generated");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

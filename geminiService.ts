import { GoogleGenAI } from "@google/genai";
import { NailDesignState } from "./types";

// Using Flash-Image for better reliability and speed
const MODEL_NAME = "gemini-2.5-flash-image";

export const generateNailArt = async (
  originalImageBase64: string,
  design: NailDesignState
): Promise<string> => {
  
  // 1. Try Vercel Env Var
  let apiKey = process.env.API_KEY;

  // 2. Try WordPress/Window Injection
  if (!apiKey && window.nailArtSettings?.apiKey) {
    apiKey = window.nailArtSettings.apiKey;
  }

  // 3. Try AI Studio Selection (if available in preview)
  // We don't need to manually get the key string for AI Studio, 
  // checking hasSelectedApiKey verifies we can proceed.
  const isAIStudio = window.aistudio && await window.aistudio.hasSelectedApiKey();

  if (!apiKey && !isAIStudio) {
    throw new Error("API Key is missing. Please set VITE_API_KEY in Vercel Settings or inject via window.nailArtSettings.");
  }

  // Initialize AI Client
  // If we are in AI Studio, the key is injected automatically by the SDK context,
  // so we can pass a dummy key or rely on the environment if process.env.API_KEY is populated by the studio.
  // However, the safest bet for the SDK is to assume process.env.API_KEY is set if we are in a valid env.
  // If we are falling back to a manually provided key (Env or Window), we use it.
  
  const ai = new GoogleGenAI({ apiKey: apiKey || process.env.API_KEY || 'DUMMY_KEY_FOR_STUDIO' });

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


import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMovieTrivia = async (movieTitle: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 3 interesting and short fun facts about the movie "${movieTitle}". Format as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return ["The director shot this movie on IMAX film.", "The soundtrack was composed using vintage synthesizers.", "Most of the sets were built as practical effects."];
  }
};

export const getSmartRecommendation = async (genres: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on an interest in ${genres.join(', ')}, suggest one classic must-watch movie with a short hook.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING }
          },
          required: ["title", "hook"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { title: "Blade Runner 2049", hook: "A visual masterpiece about what it means to be human." };
  }
};

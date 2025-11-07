import { GoogleGenAI, Type } from "@google/genai";
import { Clue } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateClues = async (topic: string, gridSize: number): Promise<Clue[]> => {
  // 3x3 grid needs 8 clues + 1 free space
  // 4x4 grid needs 16 clues (no free space)
  // 5x5 grid needs 24 clues + 1 free space
  const isOddSized = gridSize % 2 !== 0;
  const cluesToGenerate = isOddSized ? (gridSize * gridSize) - 1 : gridSize * gridSize;

  try {
    const prompt = `Generate ${cluesToGenerate} unique bingo clues for a tech-themed bingo game on the topic: '${topic}'.
Each clue should be a short, descriptive phrase that hints at a specific company, technology, or term.
The company name should be the answer to the clue.
Do not repeat companies.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clues: {
              type: Type.ARRAY,
              description: `An array of ${cluesToGenerate} unique bingo clues.`,
              items: {
                type: Type.OBJECT,
                properties: {
                  companyName: {
                    type: Type.STRING,
                    description: 'The company, technology, or term that is the answer to the clue.',
                  },
                  clueText: {
                    type: Type.STRING,
                    description: 'The text of the clue.',
                  },
                },
                required: ['companyName', 'clueText'],
              },
            },
          },
          required: ['clues'],
        },
      },
    });

    const jsonResponse = JSON.parse(response.text);
    if (jsonResponse.clues && Array.isArray(jsonResponse.clues) && jsonResponse.clues.length >= cluesToGenerate) {
      return jsonResponse.clues.slice(0, cluesToGenerate);
    }
    throw new Error('Invalid format or insufficient clues generated.');
  } catch (error) {
    console.error("Error generating clues with Gemini:", error);
    throw new Error("Failed to generate clues. Please check your API key and try again.");
  }
};

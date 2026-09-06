
import { GoogleGenAI, Type } from "@google/genai";
import { Board, Tetromino } from "../types";

export async function getGameAdvice(board: Board, nextPiece: Tetromino, score: number, level: number) {
  // [Fix] Instantiate GoogleGenAI right before making an API call to ensure use of correct configuration
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Convert board to a simple string representation for the AI
  const boardStr = board.map(row => 
    row.map(cell => cell ? 'X' : '.').join('')
  ).join('\n');

  const prompt = `
    You are a world-class Tetris Grandmaster. Analyze this board state and provide strategic advice.
    
    Current Board:
    ${boardStr}
    
    Next Piece: ${nextPiece.id}
    Current Score: ${score}
    Level: ${level}
    
    Provide 2-3 brief, actionable tips to improve my current position or score. Keep it encouraging and technical.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            advice: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of 2-3 strategic tips."
            },
            riskLevel: {
              type: Type.STRING,
              description: "Low, Medium, or High risk current state."
            }
          },
          required: ["advice", "riskLevel"]
        }
      },
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini AI error:", error);
    return null;
  }
}

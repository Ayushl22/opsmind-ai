import { GoogleGenerativeAI } from "@google/generative-ai";
import withTimeout from "../utils/withTimeout.js";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// IMPORTANT:
// gemini-2.0-flash-001 is causing quota issues on free tier
const model = genAI.getGenerativeModel({
   model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 512,
  },
});

const generateAnswer = async (question, chunks) => {
  console.log(`[chatAgent] Starting LLM generation for question: "${question}"`);

  try {
    const contextBlock = chunks
      .map((c, i) => `[${i + 1}] (Source: ${c.source})\n${c.text}`)
      .join("\n\n");

    const prompt = `
You are OpsMind AI.

Use ONLY the provided context.

CONTEXT:
${contextBlock}

QUESTION:
${question}

ANSWER:
`;

    console.log("[chatAgent] Calling Gemini API...");

    const result = await withTimeout(
      model.generateContent(prompt),
      30000,
      "Gemini generateContent"
    );

    const rawAnswer = result.response.text().trim();

    const uniqueSources = [...new Set(chunks.map((c) => c.source))];

    return {
      answer: rawAnswer,
      sources: uniqueSources,
      isOutOfContext: false,
    };
  } catch (error) {
    console.error("[chatAgent] Error during LLM generation:", error.message);
    throw error;
  }
};

export default generateAnswer;
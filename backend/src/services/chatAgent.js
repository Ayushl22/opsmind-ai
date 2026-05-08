import { GoogleGenerativeAI } from "@google/generative-ai";
import withTimeout from "../utils/withTimeout.js";

// ── Singleton: initialize as null, create on first use ──
let genAI = null;
let model = null;

const generateAnswer = async (question, chunks) => {
  console.log(`[chatAgent] Starting LLM generation for question: "${question}"`);
  console.log(`[chatAgent] Number of context chunks: ${chunks.length}`);

  // API ERROR FIX: loaded after dotenv
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      console.error("[chatAgent] FATAL: GEMINI_API_KEY is missing from process.env!");
      throw new Error("Missing API Key");
    }
    console.log("[chatAgent] Initializing Google AI Client...");
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: {
        temperature: 0.2,       
        maxOutputTokens: 2048,   // +INCREASED
      },
    });
  }

  try {
    const contextBlock = chunks
      .map((c, i) => `[${i + 1}] (Source: ${c.source})\n${c.text}`)
      .join("\n\n");

    const prompt = `You are OpsMind AI — a concise, professional assistant that answers questions using ONLY the company documents below.

CONTEXT:
${contextBlock}

RULES:
1. Answer ONLY from the context above. Do NOT add outside knowledge.
2. If the answer is not in the context, reply EXACTLY: "I'm sorry, I don't have enough information in the available documents to answer that question."
3. Keep your answer to 2-4 sentences unless a list or table is clearly needed.
4. Use bullet points for multi-part answers.
5. End with "Sources: <filename1>, <filename2>" on a new line (only if you answered).

QUESTION: ${question}

ANSWER:`;

    console.log("[chatAgent] Calling Gemini API...");

    // Wrap generateContent with 30-second timeout
    const result = await withTimeout(
      model.generateContent(prompt),
      30000,
      "Gemini generateContent"
    );

    console.log("[chatAgent] Gemini response received successfully");
    const rawAnswer = result.response.text().trim();

    // DEBUG LOGS for DEV
    console.log("\n========== RAW LLM ANSWER ==========");
    console.log(rawAnswer);
    console.log("====================================\n");

    const OUT_OF_CONTEXT_SIGNAL =
      "i don't have enough information in the available documents";
    const isOutOfContext = rawAnswer.toLowerCase().includes(OUT_OF_CONTEXT_SIGNAL);

    const uniqueSources = [...new Set(chunks.map((c) => c.source))];

    console.log(`[chatAgent] LLM generation complete. isOutOfContext: ${isOutOfContext}`);

    return {
      answer: rawAnswer,
      sources: isOutOfContext ? [] : uniqueSources,
      isOutOfContext,
    };
  } catch (error) {
    console.error("[chatAgent] Error during LLM generation:", error.message);
    throw error; 
  }
};

export default generateAnswer;
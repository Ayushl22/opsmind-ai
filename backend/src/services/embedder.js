import { GoogleGenerativeAI } from "@google/generative-ai";
import withTimeout from "../utils/withTimeout.js";

// ── Singleton: initialize as null, create on first use ──
let genAI = null;
let embeddingModel = null;

const getEmbedding = async (text) => {
  console.log("[embedder] Generating embedding for text...");

  // Lazy Initialization: Only run this the very first time we need an embedding
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      console.error("[embedder] FATAL: GEMINI_API_KEY is missing from process.env!");
      throw new Error("Missing API Key");
    }
    console.log("[embedder] Initializing Google AI Client...");
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Note: Consider upgrading to text-embedding-004 when ready!
    embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  }

  try {
    // Wrap embedContent with 15-second timeout
    const result = await withTimeout(
      embeddingModel.embedContent(text),
      15000,
      "Gemini embedContent"
    );

    console.log("[embedder] Embedding generated successfully");
    console.log(process.env.GEMINI_API_KEY);
    return result.embedding.values;
  } catch (error) {
    console.error("[embedder] Error generating embedding:", error.message);
    throw error;
  }
};

export default getEmbedding;
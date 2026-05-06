import { GoogleGenerativeAI } from "@google/generative-ai";
import withTimeout from "../utils/withTimeout.js";

// ── Singleton: reuse the same client & model across all requests ──
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });

const getEmbedding = async (text) => {
  console.log("[embedder] Generating embedding for text...");

  try {
    // Wrap embedContent with 15-second timeout
    const result = await withTimeout(
      embeddingModel.embedContent(text),
      15000,
      "Gemini embedContent"
    );

    console.log("[embedder] Embedding generated successfully");
    return result.embedding.values;
  } catch (error) {
    console.error("[embedder] Error generating embedding:", error.message);
    throw error;
  }
};

export default getEmbedding;
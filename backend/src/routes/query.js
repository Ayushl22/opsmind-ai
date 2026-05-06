import express from "express";
import retrieveChunks from "../services/retriever.js";
import generateAnswer from "../services/chatAgent.js";

const router = express.Router();

/**
 * POST /api/query
 * Body: { "question": "What is the leave policy?" }
 *
 * Response (success):
 * {
 *   "question": "...",
 *   "answer": "...",
 *   "sources": ["policy.pdf", "handbook.pdf"],
 *   "chunks": [{ text, source, score }, ...]   // raw chunks for debugging
 * }
 *
 * Response (out-of-context):
 * {
 *   "question": "...",
 *   "answer": "I'm sorry, I don't have enough information ...",
 *   "sources": [],
 *   "isOutOfContext": true
 * }
 */
router.post("/query", async (req, res) => {
  try {
    const { question } = req.body;

    // 🔹 Validate input
    if (!question || question.trim().length === 0) {
      console.log("[query] Validation failed: empty question");
      return res.status(400).json({ message: "Question is required" });
    }

    console.log(`[query] Processing question: "${question}"`);

    // Step 1: Retrieve relevant chunks
    console.log("[query] Starting chunk retrieval...");
    const chunks = await retrieveChunks(question);
    console.log(`[query] Retrieved ${chunks.length} chunks`);

    if (chunks.length === 0) {
      console.log("[query] No relevant chunks found");
      return res.status(200).json({
        question,
        message: "No relevant documents found",
        answer: "I'm sorry, I don't have enough information in the available documents to answer that question.",
        sources: [],
        isOutOfContext: true,
        chunks: [],
      });
    }

    // Step 2: Generate answer using LLM
    console.log("[query] Starting LLM answer generation...");
    const { answer, sources, isOutOfContext } = await generateAnswer(
      question,
      chunks
    );
    console.log("[query] LLM answer generation complete");

    // Step 3: Build structured sources for the frontend UI
    const structuredSources = isOutOfContext
      ? []
      : chunks.map((chunk, idx) => ({
          fileName: chunk.source,
          section: `Matched chunk ${idx + 1}`,
          confidence: Math.round((chunk.score || 0.9) * 100),
          snippet: chunk.text.substring(0, 200),
        }));

    // Step 4: Return response
    return res.json({
      question,
      answer,
      sources: structuredSources,
      isOutOfContext: isOutOfContext || false,
      chunks: chunks, // Include raw chunks for debugging
    });
  } catch (err) {
    console.error("[query] Error in query handler:", err.message);
    console.error(err.stack);
    
    // Ensure a response is always sent, never leave the request hanging
    return res.status(500).json({
      message: "Query processing failed",
      error: err.message,
      type: err.name,
    });
  }
});

export default router;
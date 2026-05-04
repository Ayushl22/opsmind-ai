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

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ message: "Question is required" });
    }

    // ── Step 1: Retrieve relevant chunks from vector DB ──────────────────────
    const chunks = await retrieveChunks(question);

    if (chunks.length === 0) {
      return res.status(200).json({
        question,
        answer:
          "I'm sorry, I don't have enough information in the available documents to answer that question.",
        sources: [],
        isOutOfContext: true,
      });
    }

    // ── Step 2: Generate AI answer via Gemini ────────────────────────────────
    const { answer, sources, isOutOfContext } = await generateAnswer(
      question,
      chunks
    );

    return res.status(200).json({
      question,
      answer,
      sources,
      isOutOfContext,
      // Include raw chunks in dev; strip in prod if preferred
      ...(process.env.NODE_ENV !== "production" && { chunks }),
    });
  } catch (err) {
    console.error("Query error:", err);
    res.status(500).json({ message: "Query failed", error: err.message });
  }
});

export default router;
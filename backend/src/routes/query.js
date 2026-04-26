import express from "express";
import retrieveChunks from "../services/retriever.js";

const router = express.Router();

router.post("/query", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({ message: "Question is required" });
    }

    const chunks = await retrieveChunks(question);

    if (chunks.length === 0) {
      return res.status(200).json({
        message: "No relevant documents found",
        results: [],
      });
    }

    res.json({
      question,
      results: chunks,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Retrieval failed", error: err.message });
  }
});

export default router;
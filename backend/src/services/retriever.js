import Document from "../models/Document.js";
import getEmbedding from "./embedder.js";
import retrieverPipeline from "./retrieverPipeline.js";

const retrieveChunks = async (question, topK = 5) => {
  const queryEmbedding = await getEmbedding(question);

  const results = await Document.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 50,
        limit: topK,
      },
    },
    {
      $project: {
        _id: 0,
        text: 1,
        source: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
    {
      $sort: { score: -1 },   // safeguard: ensure highest score is first
    },
  ]);

  // Trim long chunks to 300 chars for clean response
  return results.map((chunk) => ({
    text: chunk.text.substring(0, 300),
    source: chunk.source,
    score: chunk.score,
  }));
};

export default retrieveChunks;

/**
 * Public entry point for retrieval.
 * Delegates to retrieverPipeline — keeping the import in query.js unchanged.
 *
 * @param {string} question
 * @returns {Promise<Array<{ text, source, score }>>}
 */
const retrieveChunks = async (question) => {
  return await retrieverPipeline(question);
};

export default retrieveChunks;
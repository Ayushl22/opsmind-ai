import Document from "../models/Document.js";
import {
  VECTOR_INDEX,
  EMBEDDING_PATH,
  NUM_CANDIDATES,
} from "../constants/retriever.constants.js";

/**
 * Runs MongoDB Atlas $vectorSearch against the stored embeddings.
 * @param {number[]} queryEmbedding
 * @param {number}   topK
 * @returns {Promise<Array<{ text, source, score }>>}
 */
const runVectorSearch = async (queryEmbedding, topK) => {
  return await Document.aggregate([
    {
      $vectorSearch: {
        index: VECTOR_INDEX,
        path: EMBEDDING_PATH,
        queryVector: queryEmbedding,
        numCandidates: NUM_CANDIDATES,
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
  ]);
};

export default runVectorSearch;
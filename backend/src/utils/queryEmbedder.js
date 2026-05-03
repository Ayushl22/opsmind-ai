import getEmbedding from "../services/embedder.js";

/**
 * Converts a user question string into a vector embedding.
 * @param {string} question
 * @returns {Promise<number[]>}
 */
const embedQuery = async (question) => {
  if (!question || question.trim().length === 0) {
    throw new Error("Question must be a non-empty string");
  }
  return await getEmbedding(question);
};

export default embedQuery;
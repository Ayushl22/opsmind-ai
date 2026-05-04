import { MAX_CHUNK_LENGTH } from "../constants/retriever.constants.js";

/**
 * Trims chunk text and shapes each result into a clean output object.
 * @param {Array<{ text, source, score }>} results
 * @returns {Array<{ text, source, score }>}
 */
const formatResults = (results) => {
  return results.map((chunk) => ({
    text: chunk.text.substring(0, MAX_CHUNK_LENGTH),
    source: chunk.source,
    score: chunk.score,
  }));
};

export default formatResults;
import embedQuery from "../utils/queryEmbedder.js";
import runVectorSearch from "../utils/vectorSearch.js";
import sortByScore from "../utils/resultSorter.js";
import formatResults from "../utils/resultFormatter.js";
import { TOP_K } from "../constants/retriever.constants.js";

/**
 * Full retrieval pipeline:
 *   1. Embed the question
 *   2. Run vector search
 *   3. Sort by score
 *   4. Format & trim results
 *
 * @param {string} question
 * @param {number} topK
 * @returns {Promise<Array<{ text, source, score }>>}
 */
const retrieverPipeline = async (question, topK = TOP_K) => {
  const queryEmbedding = await embedQuery(question);
  const rawResults = await runVectorSearch(queryEmbedding, topK);
  const sorted = sortByScore(rawResults);
  const formatted = formatResults(sorted);
  return formatted;
};

export default retrieverPipeline;
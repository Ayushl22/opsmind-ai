import embedQuery from "../utils/queryEmbedder.js";
import runVectorSearch from "../utils/vectorSearch.js";
import sortByScore from "../utils/resultSorter.js";
import formatResults from "../utils/resultFormatter.js";
import { TOP_K } from "../constants/retriever.constants.js";

const retrieverPipeline = async (question, topK = TOP_K) => {
  const queryEmbedding = await embedQuery(question);
  const rawResults = await runVectorSearch(queryEmbedding, topK);
  const sorted = sortByScore(rawResults);
  const formatted = formatResults(sorted);
  return formatted;
};

export default retrieverPipeline;
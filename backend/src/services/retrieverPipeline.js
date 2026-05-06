import embedQuery from "../utils/queryEmbedder.js";
import runVectorSearch from "../utils/vectorSearch.js";
import sortByScore from "../utils/resultSorter.js";
import formatResults from "../utils/resultFormatter.js";
import { TOP_K } from "../constants/retriever.constants.js";

const retrieverPipeline = async (question, topK = TOP_K) => {
  try {
    console.log(`[retrieverPipeline] Starting retrieval for: "${question}"`);
    
    console.log("[retrieverPipeline] Step 1: Embedding query...");
    const queryEmbedding = await embedQuery(question);
    console.log("[retrieverPipeline] Query embedded successfully");

    console.log("[retrieverPipeline] Step 2: Running vector search...");
    const rawResults = await runVectorSearch(queryEmbedding, topK);
    console.log(`[retrieverPipeline] Vector search returned ${rawResults.length} results`);

    console.log("[retrieverPipeline] Step 3: Sorting results...");
    const sorted = sortByScore(rawResults);
    console.log("[retrieverPipeline] Results sorted");

    console.log("[retrieverPipeline] Step 4: Formatting results...");
    const formatted = formatResults(sorted);
    console.log(`[retrieverPipeline] Retrieval complete. Formatted ${formatted.length} chunks`);

    return formatted;
  } catch (error) {
    console.error("[retrieverPipeline] Error in retrieval pipeline:", error.message);
    throw error;
  }
};

export default retrieverPipeline;
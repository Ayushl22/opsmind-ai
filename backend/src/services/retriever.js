import retrieverPipeline from "./retrieverPipeline.js";

const retrieveChunks = async (question) => {
  return await retrieverPipeline(question);
};

export default retrieveChunks;
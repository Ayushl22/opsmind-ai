import { GoogleGenerativeAI } from "@google/generative-ai";

const getEmbedding = async (text) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding.values;
};

export default getEmbedding;
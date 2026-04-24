import axios from "axios";

const getEmbedding = async (text) => {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
    {
      content: {
        parts: [{ text }]
      }
    }
  );

  return res.data.embedding.values;
};

export default getEmbedding;
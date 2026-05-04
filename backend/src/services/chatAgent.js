import { GoogleGenerativeAI } from "@google/generative-ai";

const generateAnswer = async (question, chunks) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  const contextBlock = chunks
    .map((c, i) => `[${i + 1}] (Source: ${c.source})\n${c.text}`)
    .join("\n\n");

  const prompt = `You are OpsMind AI, a helpful assistant that answers questions strictly based on the company documents provided below.

CONTEXT (retrieved from company documents):
${contextBlock}

INSTRUCTIONS:
- Answer ONLY using the information in the context above.
- If the answer is not present in the context, respond with exactly:
  "I'm sorry, I don't have enough information in the available documents to answer that question."
- Be clear, concise, and professional.
- At the end of your answer, list the document sources you used as "Sources: <name1>, <name2>, ...".
  If you could not answer, omit the sources line.

QUESTION: ${question}

ANSWER:`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
  const result = await model.generateContent(prompt);
  const rawAnswer = result.response.text().trim();

  const OUT_OF_CONTEXT_SIGNAL =
    "i don't have enough information in the available documents";
  const isOutOfContext = rawAnswer.toLowerCase().includes(OUT_OF_CONTEXT_SIGNAL);

  const uniqueSources = [...new Set(chunks.map((c) => c.source))];

  return {
    answer: rawAnswer,
    sources: isOutOfContext ? [] : uniqueSources,
    isOutOfContext,
  };
};

export default generateAnswer;
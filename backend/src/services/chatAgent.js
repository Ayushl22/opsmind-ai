import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a final AI answer from retrieved context chunks.
 *
 * @param {string} question   - The user's original question
 * @param {Array}  chunks     - Array of { text, source, score } objects from the retriever
 * @returns {Object}          - { answer, sources, isOutOfContext }
 */
const generateAnswer = async (question, chunks) => {
  // ── 1. Build context block from retrieved chunks ──────────────────────────
  const contextBlock = chunks
    .map((c, i) => `[${i + 1}] (Source: ${c.source})\n${c.text}`)
    .join("\n\n");

  // ── 2. Compose the prompt ──────────────────────────────────────────────────
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

  // ── 3. Call Gemini ─────────────────────────────────────────────────────────
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const result = await model.generateContent(prompt);
  const rawAnswer = result.response.text().trim();

  // ── 4. Detect out-of-context responses ────────────────────────────────────
  const OUT_OF_CONTEXT_SIGNAL =
    "i don't have enough information in the available documents";
  const isOutOfContext = rawAnswer
    .toLowerCase()
    .includes(OUT_OF_CONTEXT_SIGNAL);

  // ── 5. Deduplicate source filenames cited ─────────────────────────────────
  const uniqueSources = [...new Set(chunks.map((c) => c.source))];

  return {
    answer: rawAnswer,
    sources: isOutOfContext ? [] : uniqueSources,
    isOutOfContext,
  };
};

export default generateAnswer;
const chunkText = (text, chunkSize = 1000, overlap = 100) => {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const chunks = [];

  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    const chunk = text.slice(i, i + chunkSize);
    if (chunk.trim().length > 0) {
      chunks.push(chunk);
    }
  }

  return chunks;
};

export default chunkText;
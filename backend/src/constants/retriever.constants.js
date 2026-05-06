// Retriever configuration constants

export const TOP_K = 5;               // Number of top results to return
export const NUM_CANDIDATES = 50;     // Number of candidates for vector search
export const MAX_CHUNK_LENGTH = 800;  // Max characters per returned chunk (was 300 — too aggressive)
export const VECTOR_INDEX = "vector_index";  // MongoDB Atlas vector index name
export const EMBEDDING_PATH = "embedding";   // Field path in MongoDB document
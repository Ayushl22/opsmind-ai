# Week 2 — Retrieval Engine

## Objective
Retrieve the most relevant document chunks from MongoDB Atlas based on the meaning of a user's question.

## New Files
```
src/routes/query.js
src/services/retriever.js
```

---

## How It Works

### Query Pipeline

```
User Question (POST /api/query)
   │
   ▼
[embedder.js]    →  Convert question → vector embedding via Gemini
   │
   ▼
[retriever.js]   →  $vectorSearch against stored embeddings in MongoDB Atlas
   │
   ▼
[retriever.js]   →  Sort results by similarity score (highest first)
   │
   ▼
[query.js]       →  Return { question, results: [ { text, source, score } ] }
```

---

## Key Design Decisions

### 1. Semantic search over keyword search
The question is embedded using the same Gemini model used during ingestion (`gemini-embedding-001`).
This ensures the query vector lives in the same space as the stored chunk vectors — enabling meaning-based retrieval, not just keyword matching.

### 2. MongoDB Atlas $vectorSearch
Uses MongoDB's native `$vectorSearch` aggregation stage with the `vector_index` index.
`numCandidates: 50` is scanned and narrowed down to `topK: 5` most relevant chunks.

### 3. Score-based sorting
Results are sorted by similarity score descending as a safeguard, ensuring the most relevant chunk is always first regardless of DB return order.

### 4. Chunk trimming
Each returned chunk is trimmed to 300 characters to keep API responses clean and lightweight before being passed to the next stage.

---

## API Contract

### Request
```
POST /api/query
Content-Type: application/json

{ "question": "What is the onboarding process?" }
```

### Response — chunks found
```json
{
  "question": "What is the onboarding process?",
  "results": [
    {
      "text": "New employees are required to complete...",
      "source": "employee_handbook.pdf",
      "score": 0.91
    },
    {
      "text": "The HR team will schedule an orientation...",
      "source": "hr_policy.pdf",
      "score": 0.87
    }
  ]
}
```

### Response — no chunks found
```json
{
  "message": "No relevant documents found",
  "results": []
}
```

---

## No New Dependencies Required
`@google/generative-ai` and `mongoose` are already in `package.json` from Week 1.